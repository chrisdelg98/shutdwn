use serde::Serialize;

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ElevationStatus {
    pub platform: String,
    pub needed: bool,
    pub configured: bool,
}

#[tauri::command]
pub fn get_elevation_status() -> ElevationStatus {
    #[cfg(target_os = "windows")]
    {
        ElevationStatus {
            platform: "windows".into(),
            needed: false,
            configured: true,
        }
    }
    #[cfg(target_os = "linux")]
    {
        ElevationStatus {
            platform: "linux".into(),
            needed: true,
            configured: linux::is_configured(),
        }
    }
    #[cfg(target_os = "macos")]
    {
        ElevationStatus {
            platform: "macos".into(),
            needed: true,
            configured: macos::is_configured(),
        }
    }
}

#[tauri::command]
pub fn install_elevation() -> Result<ElevationStatus, String> {
    #[cfg(target_os = "windows")]
    {
        Ok(get_elevation_status())
    }
    #[cfg(target_os = "linux")]
    {
        linux::try_install()?;
        Ok(get_elevation_status())
    }
    #[cfg(target_os = "macos")]
    {
        macos::try_install()?;
        Ok(get_elevation_status())
    }
}

#[cfg(target_os = "linux")]
mod linux {
    use std::fs;
    use std::path::Path;
    use std::process::Command;

    pub const RULE_PATH: &str = "/etc/polkit-1/rules.d/50-shutdwn.rules";

    const RULE_TEMPLATE: &str = r#"// shutdwn polkit rule
// Allows the configured user to power off the system without password.
polkit.addRule(function(action, subject) {
    if ((action.id == "org.freedesktop.login1.power-off" ||
         action.id == "org.freedesktop.login1.power-off-multiple-sessions" ||
         action.id == "org.freedesktop.login1.power-off-ignore-inhibit") &&
        subject.user == "__USER__") {
        return polkit.Result.YES;
    }
});
"#;

    pub fn is_configured() -> bool {
        Path::new(RULE_PATH).exists()
    }

    pub fn try_install() -> Result<(), String> {
        let user = std::env::var("USER")
            .map_err(|_| "USER env not set".to_string())?;
        let rule = RULE_TEMPLATE.replace("__USER__", &user);

        let tmp = "/tmp/shutdwn-polkit-50.rules";
        fs::write(tmp, rule).map_err(|e| format!("write tmp: {}", e))?;

        let status = Command::new("pkexec")
            .args(["install", "-m", "644", tmp, RULE_PATH])
            .status()
            .map_err(|e| format!("pkexec spawn: {}", e))?;

        let _ = fs::remove_file(tmp);

        if !status.success() {
            return Err("pkexec returned non-zero (user cancelled?)".to_string());
        }
        Ok(())
    }
}

#[cfg(target_os = "macos")]
mod macos {
    use std::fs;
    use std::path::Path;
    use std::process::Command;

    pub const SUDOERS_PATH: &str = "/etc/sudoers.d/shutdwn";

    pub fn is_configured() -> bool {
        Path::new(SUDOERS_PATH).exists()
    }

    pub fn try_install() -> Result<(), String> {
        let user = std::env::var("USER")
            .map_err(|_| "USER env not set".to_string())?;
        let line = format!("{} ALL=(ALL) NOPASSWD: /sbin/shutdown\n", user);

        let tmp = "/tmp/shutdwn-sudoers";
        fs::write(tmp, &line).map_err(|e| format!("write tmp: {}", e))?;

        let script = format!(
            "do shell script \"install -m 0440 -o root -g wheel {} {}\" with administrator privileges with prompt \"shutdwn needs admin access to enable automatic shutdown without a password.\"",
            tmp, SUDOERS_PATH
        );

        let status = Command::new("osascript")
            .args(["-e", &script])
            .status()
            .map_err(|e| format!("osascript spawn: {}", e))?;

        let _ = fs::remove_file(tmp);

        if !status.success() {
            return Err("osascript returned non-zero (user cancelled?)".to_string());
        }
        Ok(())
    }
}
