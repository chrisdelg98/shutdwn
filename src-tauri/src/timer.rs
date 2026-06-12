use serde::Serialize;
use std::process::{Command, ExitStatus};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tauri::tray::TrayIcon;
use tauri::{AppHandle, Emitter, Manager, State};
use tauri_plugin_notification::NotificationExt;

#[derive(Default)]
pub struct AppState {
    pub timer: Mutex<Option<TimerSlot>>,
    pub tray: Mutex<Option<TrayIcon>>,
}

pub struct TimerSlot {
    pub target_unix_ms: u64,
    pub duration_ms: u64,
    pub cancel: Arc<AtomicBool>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct TimerStatus {
    pub active: bool,
    pub target_unix_ms: Option<u64>,
    pub duration_ms: Option<u64>,
    pub remaining_ms: Option<i64>,
}

impl TimerStatus {
    fn idle() -> Self {
        Self {
            active: false,
            target_unix_ms: None,
            duration_ms: None,
            remaining_ms: None,
        }
    }

    fn running(target_unix_ms: u64, duration_ms: u64) -> Self {
        let remaining = target_unix_ms as i64 - now_unix_ms() as i64;
        Self {
            active: true,
            target_unix_ms: Some(target_unix_ms),
            duration_ms: Some(duration_ms),
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
        Some(slot) => TimerStatus::running(slot.target_unix_ms, slot.duration_ms),
    }
}

pub fn tooltip_for(status: &TimerStatus) -> String {
    match status.remaining_ms {
        Some(ms) if status.active => format!("shutdwn — {} left", format_remaining(ms)),
        _ => "shutdwn — Idle".to_string(),
    }
}

fn format_remaining(ms: i64) -> String {
    let total = (ms.max(0) / 1000) as u64;
    let h = total / 3600;
    let m = (total % 3600) / 60;
    let s = total % 60;
    if h > 0 {
        format!("{}h {:02}m", h, m)
    } else if m > 0 {
        format!("{}m {:02}s", m, s)
    } else {
        format!("{}s", s)
    }
}

fn update_tray_tooltip(app: &AppHandle, status: &TimerStatus) {
    let text = tooltip_for(status);
    let state = app.state::<AppState>();
    let guard = state.tray.lock().unwrap();
    if let Some(tray) = guard.as_ref() {
        let _ = tray.set_tooltip(Some(&text));
    }
}

pub fn cancel_timer_internal(app: &AppHandle) -> TimerStatus {
    let state = app.state::<AppState>();
    let mut guard = state.timer.lock().unwrap();
    if let Some(slot) = guard.take() {
        slot.cancel.store(true, Ordering::Relaxed);
    }
    drop(guard);

    let status = TimerStatus::idle();
    let _ = app.emit("timer-changed", status.clone());
    update_tray_tooltip(app, &status);
    status
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
        let mut last_tooltip = Instant::now();
        let tooltip_interval = Duration::from_secs(30);

        let warn_at = if duration_ms > 60_000 {
            Some(deadline - Duration::from_secs(60))
        } else {
            None
        };
        let mut warned = false;

        loop {
            let now = Instant::now();
            if now >= deadline {
                break;
            }
            if cancel_thread.load(Ordering::Relaxed) {
                return;
            }
            if let Some(w) = warn_at {
                if !warned && now >= w {
                    let notify = {
                        let s = app_thread.state::<crate::settings::SettingsState>();
                        let guard = s.0.lock().unwrap();
                        guard.notify_one_minute
                    };
                    if notify {
                        send_warning(&app_thread);
                    }
                    warned = true;
                }
            }
            if now.duration_since(last_tooltip) >= tooltip_interval {
                let status =
                    TimerStatus::running(target_unix_ms, duration_ms);
                update_tray_tooltip(&app_thread, &status);
                last_tooltip = now;
            }
            let sleep_for = std::cmp::min(deadline - now, poll);
            thread::sleep(sleep_for);
        }
        if cancel_thread.load(Ordering::Relaxed) {
            return;
        }

        {
            let state = app_thread.state::<AppState>();
            *state.timer.lock().unwrap() = None;
        }
        let idle = TimerStatus::idle();
        update_tray_tooltip(&app_thread, &idle);
        let _ = app_thread.emit("timer-changed", idle);
        let _ = app_thread.emit("timer-fired", ());
        let _ = execute_shutdown();
    });

    *state.timer.lock().unwrap() = Some(TimerSlot {
        target_unix_ms,
        duration_ms,
        cancel,
    });

    let status = TimerStatus::running(target_unix_ms, duration_ms);
    let _ = app.emit("timer-changed", status.clone());
    update_tray_tooltip(&app, &status);
    status
}

#[tauri::command]
pub fn cancel_timer(_state: State<AppState>, app: AppHandle) -> TimerStatus {
    cancel_timer_internal(&app)
}

#[tauri::command]
pub fn get_status(state: State<AppState>) -> TimerStatus {
    snapshot(&state)
}

fn send_warning(app: &AppHandle) {
    let _ = app
        .notification()
        .builder()
        .title("shutdwn")
        .body("Shutting down in 1 minute. Open shutdwn to cancel.")
        .show();
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
