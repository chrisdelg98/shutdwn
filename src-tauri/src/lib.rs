mod settings;
mod timer;
mod tray;

use settings::SettingsState;
use tauri::{Manager, WindowEvent};
use timer::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .manage(AppState::default())
        .manage(SettingsState::default())
        .invoke_handler(tauri::generate_handler![
            timer::start_timer,
            timer::cancel_timer,
            timer::get_status,
            settings::get_settings,
            settings::set_settings,
        ])
        .setup(|app| {
            tray::build(app.handle())?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                let app = window.app_handle();
                let state = app.state::<SettingsState>();
                let close_to_tray = state.0.lock().unwrap().close_to_tray;
                if close_to_tray {
                    let _ = window.hide();
                    api.prevent_close();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
