import type { SortMetrics } from "../../types/compare";

export default function MetricsPanel({ metrics, algorithm }: { metrics: SortMetrics, algorithm?: string }) {
  const isNonComp = algorithm === "counting" || algorithm === "radix";
  return (
    <div className="flex items-center justify-between bg-surface-950 p-3 rounded-xl border border-surface-700/50">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono mb-1">Status</span>
        <span className={`text-xs font-bold font-mono tracking-wide ${
          metrics.status === 'completed' ? 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]' : 
          metrics.status === 'running' ? 'text-amber-400 animate-pulse' : 'text-gray-400'
        }`}>
          {metrics.status.toUpperCase()}
        </span>
      </div>
      <div className="w-px h-8 bg-surface-700/50" />
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono mb-1">Comparisons</span>
        <span className="text-sm font-bold font-mono text-neon-300 drop-shadow-[0_0_4px_rgba(103,232,249,0.3)]">
          {metrics.comparisons}
        </span>
      </div>
      <div className="w-px h-8 bg-surface-700/50" />
      <div className="flex flex-col items-end">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono mb-1">{isNonComp ? "Writes" : "Swaps"}</span>
        <span className="text-sm font-bold font-mono text-pink-400 drop-shadow-[0_0_4px_rgba(244,114,182,0.3)]">
          {metrics.swaps}
        </span>
      </div>
    </div>
  );
}
