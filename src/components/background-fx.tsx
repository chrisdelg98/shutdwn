import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

export function BackgroundFx() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (theme === "dark") {
      raf = runMatrix(ctx, canvas);
    } else {
      raf = runClouds(ctx, canvas);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-100"
    />
  );
}

function runMatrix(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const fontSize = 14;
  const chars =
    "01アイウエオカキクケコサシスセソタチツテトナニヌネノｱｲｳｴｵｶｷｸ#$%";

  let cols = 0;
  let drops: number[] = [];
  let widthCss = 0;
  let heightCss = 0;

  const recompute = () => {
    widthCss = canvas.clientWidth;
    heightCss = canvas.clientHeight;
    cols = Math.ceil(widthCss / fontSize);
    drops = Array.from({ length: cols }, () =>
      Math.floor(Math.random() * (heightCss / fontSize)),
    );
  };

  recompute();

  let last = performance.now();
  const interval = 80;

  const draw = (now: number) => {
    if (canvas.clientWidth !== widthCss || canvas.clientHeight !== heightCss) {
      recompute();
    }
    if (now - last >= interval) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.16)";
      ctx.fillRect(0, 0, widthCss, heightCss);
      ctx.font = `${fontSize}px ui-monospace, "Cascadia Code", Menlo, monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const isHead = Math.random() < 0.04;
        ctx.fillStyle = isHead
          ? "rgba(186, 230, 253, 0.55)"
          : "rgba(56, 189, 248, 0.28)";
        ctx.fillText(ch, x, y);
        if (y > heightCss && Math.random() > 0.965) drops[i] = 0;
        else drops[i]++;
      }
      last = now;
    }
    raf = requestAnimationFrame(draw);
  };

  let raf = requestAnimationFrame(draw);
  return raf;
}

function runClouds(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  type Blob = {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    hue: number;
  };

  let blobs: Blob[] = [];
  let widthCss = 0;
  let heightCss = 0;

  const init = () => {
    widthCss = canvas.clientWidth;
    heightCss = canvas.clientHeight;
    blobs = Array.from({ length: 5 }, () => ({
      x: Math.random() * widthCss,
      y: Math.random() * heightCss,
      r: 110 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.12,
      hue: 215 + Math.random() * 30,
    }));
  };

  init();

  const draw = () => {
    if (canvas.clientWidth !== widthCss || canvas.clientHeight !== heightCss) {
      init();
    }
    ctx.clearRect(0, 0, widthCss, heightCss);

    for (const b of blobs) {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.r) b.x = widthCss + b.r;
      if (b.x > widthCss + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = heightCss + b.r;
      if (b.y > heightCss + b.r) b.y = -b.r;

      const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grd.addColorStop(0, `hsla(${b.hue}, 90%, 75%, 0.22)`);
      grd.addColorStop(1, `hsla(${b.hue}, 90%, 75%, 0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  };

  let raf = requestAnimationFrame(draw);
  return raf;
}
