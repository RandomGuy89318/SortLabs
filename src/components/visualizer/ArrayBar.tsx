import type { BarState } from "../../algorithms";

interface ArrayBarProps {
  value: number;
  maxValue: number;
  index: number;
  totalBars: number;
  state?: BarState;
  hideLabels?: boolean;
}

/**
 * Visual config for each bar state.
 * Each state has distinct gradients, glows, and CSS animation class.
 */
const STATE_STYLES: Record<
  BarState,
  {
    barBg: string;
    shine: string;
    glow: string;
    label: string;
    animation: string;
    ring: string;
  }
> = {
  default: {
    barBg: "bg-gradient-to-t from-cyan-700 via-cyan-500 to-cyan-400",
    shine: "from-white/10 to-transparent",
    glow: "",
    label: "text-gray-500",
    animation: "",
    ring: "",
  },
  comparing: {
    barBg: "bg-gradient-to-t from-amber-600 via-yellow-400 to-yellow-300",
    shine: "from-white/20 to-transparent",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.6),0_0_40px_rgba(245,158,11,0.2)]",
    label: "text-yellow-300",
    animation: "bar-comparing",
    ring: "ring-2 ring-yellow-400/50",
  },
  swapped: {
    barBg: "bg-gradient-to-t from-rose-600 via-pink-500 to-pink-400",
    shine: "from-white/20 to-transparent",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.6),0_0_40px_rgba(244,63,94,0.2)]",
    label: "text-pink-400",
    animation: "bar-swapped",
    ring: "ring-2 ring-pink-400/50",
  },
  sorted: {
    barBg: "bg-gradient-to-t from-emerald-600 via-emerald-500 to-green-400",
    shine: "from-white/15 to-transparent",
    glow: "shadow-[0_0_16px_rgba(16,185,129,0.45),0_0_32px_rgba(16,185,129,0.15)]",
    label: "text-emerald-400",
    animation: "bar-sorted",
    ring: "",
  },
};

export default function ArrayBar({
  value,
  maxValue,
  index,
  totalBars,
  state = "default",
  hideLabels = false,
}: ArrayBarProps) {
  const heightPercent = (value / maxValue) * 100;
  const s = STATE_STYLES[state];

  return (
    <div
      className="relative flex flex-col items-center justify-end group h-full"
      style={{
        flex: 1,
        maxWidth: "72px",
        minWidth: "2px",
      }}
    >
      {/* Value label above bar — always visible during active states if not hidden */}
      {!hideLabels && (
        <span
          className={`
            text-[10px] font-mono font-bold mb-1
            transition-all duration-150
            ${
              state !== "default"
                ? `opacity-100 ${s.label} drop-shadow-[0_0_4px_currentColor]`
                : "opacity-0 group-hover:opacity-100 text-neon-300"
            }
          `}
        >
          {value}
        </span>
      )}

      {/* Bar container with glow + ring + animation */}
      <div
        className={`
          relative w-full rounded-t-lg overflow-hidden
          ${s.barBg} ${s.glow} ${s.ring} ${s.animation}
          transition-all duration-200 ease-out
          origin-bottom
        `}
        style={{ height: `${heightPercent}%`, minHeight: "10px" }}
      >
        {/* Inner shine — left-edge highlight for 3D depth */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-r ${s.shine}
            pointer-events-none
          `}
          style={{ width: "40%" }}
        />

        {/* Top highlight line for glass effect */}
        <div className="absolute top-0 left-1 right-1 h-px bg-white/20 rounded-full" />
      </div>

      {/* Reflection / base glow */}
      {state !== "default" && (
        <div
          className={`
            absolute bottom-5 left-1/2 -translate-x-1/2
            w-[80%] h-2 rounded-full blur-md opacity-60
            ${state === "comparing" ? "bg-yellow-400" : ""}
            ${state === "swapped" ? "bg-pink-400" : ""}
            ${state === "sorted" ? "bg-emerald-400" : ""}
          `}
        />
      )}

      {/* Value label below bar */}
      {!hideLabels && (
        <span
          className={`
            mt-2 text-[11px] font-mono font-medium transition-colors duration-150
            ${state !== "default" ? s.label : "text-gray-500 group-hover:text-neon-400"}
          `}
        >
          {value}
        </span>
      )}
    </div>
  );
}
