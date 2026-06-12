use serde::Serialize;
use std::process::{Command, ExitStatus};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter, State};

#[derive(Default)]
pub struct AppState {
    pub timer: Mutex<Option<TimerSlot>>,
}

pub struct TimerSlot {
    pub target_unix_ms: u64,
    pub cancel: Arc<AtomicBool>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TimerStatus {
    pub active: bool,
    pub target_unix_ms: Option<u64>,
    pub remaining_ms: Option<i64>,
}

impl TimerStatus {
    fn idle() -> Self {
        Self { active: false, target_unix_ms: None, remaining_ms: None }
    }

    fn running(target_unix_ms: u64) -> Self {
        let remaining = target_unix_ms as i64 - now_unix_ms() as i64;
        Self {
            active: true,
            target_unix_ms: Some(target_unix_ms),
            remaining_ms: Some(remaining.max(0)),
        }
    }
}

fn now_unix_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

fn snapshot(state: &State<AppState>) -> TimerStatus {
    let guard = state.timer.lock().unwrap();
    match guard.as_ref() {
        None => TimerStatus::idle(),
        Some(slot) => TimerStatus::running(slot.target_unix_ms),
    }
}

#[tauri::command]
pub fn start_timer(state: State<AppState>, app: AppHandle, minutes: u32) -> TimerStatus {
    if minutes == 0 {
        return snapshot(&state);
    }

    {
        let mut guard = state.timer.lock().unwrap();
        if let Some(slot) = guard.take() {
            slot.cancel.store(true, Ordering::Relaxed);
        }
    }

    let duration_ms = (minutes as u64) * 60_000;
    let target_unix_ms = now_unix_ms() + duration_ms;

    let cancel = Arc::new(AtomicBool::new(false));
    let cancel_thread = cancel.clone();
    let app_thread = app.clone();

    thread::spawn(move || {
        let deadline = Instant::now() + Duration::from_millis(duration_ms);
        let poll = Duration::from_millis(250);
        loop {
            let now = Instant::now();
            if now >= deadline {
                break;
            }
            if cancel_thread.load(Ordering::Relaxed) {
                return;
            }
            let sleep_for = std::cmp::min(deadline - now, poll);
            thread::sleep(sleep_for);
        }
        if cancel_thread.load(Ordering::Relaxed) {
            return;
        }
        let _ = app_thread.emit("timer-fired", ());
        let _ = execute_shutdown();
    });

    *state.timer.lock().unwrap() = Some(TimerSlot { target_unix_ms, cancel });

    let status = TimerStatus::running(target_unix_ms);
    let _ = app.emit("timer-changed", status.clone());
    status
}

#[tauri::command]
pub fn cancel_timer(state: State<AppState>, app: AppHandle) -> TimerStatus {
    let mut guard = state.timer.lock().unwrap();
    if let Some(slot) = guard.take() {
        slot.cancel.store(true, Ordering::Relaxed);
    }
    drop(guard);

    let status = TimerStatus::idle();
    let _ = app.emit("timer-changed", status.clone());
    status
}

#[tauri::command]
pub fn get_status(state: State<AppState>) -> TimerStatus {
    snapshot(&state)
}

fn execute_shutdown() -> std::io::Result<ExitStatus> {
    #[cfg(target_os = "windows")]
    {
        Command::new("shutdown").args(["/s", "/t", "0", "/f"]).status()
    }
    #[cfg(target_os = "macos")]
    {
        Command::new("osascript")
            .args(["-e", r#"tell application "System Events" to shut down"#])
            .status()
    }
    #[cfg(target_os = "linux")]
    {
        match Command::new("systemctl").arg("poweroff").status() {
            Ok(s) if s.success() => Ok(s),
            _ => Command::new("shutdown").args(["-h", "now"]).status(),
        }
    }
}
