import { formatRemaining } from "@/lib/format";

interface CountdownRingProps {
  remainingMs: number;
  progress: number;
  size?: number;
}

export function CountdownRing({
  remainingMs,
  progress,
  size = 220,
}: CountdownRingProps) {
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.6s ease",
            filter: "drop-shadow(0 0 3px var(--accent-glow))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-4xl font-semibold tabular-nums">
          {formatRemaining(remainingMs)}
        </span>
      </div>
    </div>
  );
}
