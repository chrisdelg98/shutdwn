mod timer;

use timer::AppState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            timer::start_timer,
            timer::cancel_timer,
            timer::get_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
