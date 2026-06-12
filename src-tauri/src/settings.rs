use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub notify_one_minute: bool,
    pub close_to_tray: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            notify_one_minute: true,
            close_to_tray: true,
        }
    }
}

#[derive(Default)]
pub struct SettingsState(pub Mutex<Settings>);

#[tauri::command]
pub fn get_settings(state: State<SettingsState>) -> Settings {
    state.0.lock().unwrap().clone()
}

#[tauri::command]
pub fn set_settings(state: State<SettingsState>, settings: Settings) -> Settings {
    *state.0.lock().unwrap() = settings.clone();
    settings
}
