<div align="center">

<img src="docs/logo.svg" alt="shutdwn" width="120" height="120" />

# shutdwn

**A minimalist scheduled shutdown app — for when music plays and you're already half asleep.**
**Una app minimalista para apagar el equipo automáticamente — para cuando la música suena y ya te estás durmiendo.**

[![Platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square)](#)
[![Tauri](https://img.shields.io/badge/built%20with-Tauri%202-24C8DB?style=flat-square&logo=tauri)](https://tauri.app)
[![React](https://img.shields.io/badge/UI-React%20%2B%20TS-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Rust](https://img.shields.io/badge/core-Rust-DEA584?style=flat-square&logo=rust)](https://www.rust-lang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[English](#english) · [Español](#español)

</div>

---

## English

### What is it?

**shutdwn** is a tiny, beautiful desktop app whose only job is to power off your computer after a chosen amount of time. No menus, no settings, no clutter — one screen, one task, done.

### Why?

You put on some music, settle in, and drift off. You don't want your machine running all night. shutdwn lets you tap a button and forget about it.

### Features

- One-screen design, idle and active states clearly differentiated
- Quick presets: 15 min, 30 min, 1 hour, 2 hours, or custom
- Live countdown with the exact target shutdown time
- Cancel any time with a single button
- Minimize to system tray with the countdown visible in the tooltip
- Light / Dark mode toggle
- Keyboard shortcuts for power users
- ~5 MB installer · instant startup · low memory footprint

### Tech stack

- **Tauri 2** — native shell, ~5 MB binaries
- **React + TypeScript + Vite** — UI
- **Tailwind CSS + shadcn/ui** — styling
- **Rust** — timer core and OS shutdown commands

### Install

Download the latest installer for your OS from the [Releases](https://github.com/chrisdelg98/shutdwn/releases) page:

- Windows → `.msi`
- macOS → `.dmg`
- Linux → `.AppImage` / `.deb`

### Build from source

```bash
git clone https://github.com/chrisdelg98/shutdwn.git
cd shutdwn
npm install
npm run tauri dev      # development with hot reload
npm run tauri build    # production installer
```

### License

MIT — do whatever you like with it. Improvements welcome.

---

## Español

### ¿Qué es?

**shutdwn** es una app de escritorio pequeña y bonita cuyo único objetivo es apagar tu equipo después del tiempo que elijas. Sin menús, sin ajustes, sin ruido — una pantalla, una tarea, listo.

### ¿Por qué?

Pones música, te acomodas y te quedas dormido. No quieres que tu equipo siga encendido toda la noche. shutdwn te deja darle un toque y olvidarte.

### Características

- Una sola pantalla, con estados *inactivo* y *activo* claramente diferenciados
- Presets rápidos: 15 min, 30 min, 1 hora, 2 horas, o personalizado
- Cuenta regresiva en vivo con la hora exacta de apagado
- Cancela en cualquier momento con un solo botón
- Se minimiza a la bandeja del sistema mostrando el tiempo restante en el tooltip
- Tema claro / oscuro con un toggle
- Atajos de teclado para quien quiera ir rápido
- Instalador de ~5 MB · arranque instantáneo · poco consumo de RAM

### Stack técnico

- **Tauri 2** — cápsula nativa, binarios de ~5 MB
- **React + TypeScript + Vite** — interfaz
- **Tailwind CSS + shadcn/ui** — estilos
- **Rust** — timer interno y comandos de apagado del SO

### Instalar

Descarga el instalador para tu sistema desde la página de [Releases](https://github.com/chrisdelg98/shutdwn/releases):

- Windows → `.msi`
- macOS → `.dmg`
- Linux → `.AppImage` / `.deb`

### Compilar desde el código

```bash
git clone https://github.com/chrisdelg98/shutdwn.git
cd shutdwn
npm install
npm run tauri dev      # desarrollo con hot reload
npm run tauri build    # instalador de producción
```

### Licencia

MIT — úsalo, modifícalo, mejóralo. Pull requests bienvenidos.

---

<div align="center">

Made with ☕ and Rust by [@chrisdelg98](https://github.com/chrisdelg98)

</div>
