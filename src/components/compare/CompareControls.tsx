import type { ArrayPattern } from "../../utils/arrayGenerators";
import { ALGORITHM_LABELS } from "../../data/complexityData";

interface CompareControlsProps {
  selectedAlgorithms: string[];
  onToggleAlgorithm: (algo: string) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  pattern: ArrayPattern;
  onPatternChange: (p: ArrayPattern) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onGenerate: () => void;
  onStart: () => void;
  isSorting: boolean;
}

export default function CompareControls({
  selectedAlgorithms,
  onToggleAlgorithm,
  arraySize,
  onArraySizeChange,
  pattern,
  onPatternChange,
  speed,
  onSpeedChange,
  onGenerate,
  onStart,
  isSorting,
}: CompareControlsProps) {
  const allAlgorithms = Object.keys(ALGORITHM_LABELS);
  
  return (
    <div className="flex flex-col gap-4 p-4 bg-surface-850 border-b border-surface-700 shrink-0">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Algorithms Selection */}
        <div className="flex-1">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
            Select Algorithms (2-4)
          </label>
          <div className="flex flex-wrap gap-2">
            {allAlgorithms.map(algo => {
              const isSelected = selectedAlgorithms.includes(algo);
              return (
                <button
                  key={algo}
                  onClick={() => onToggleAlgorithm(algo)}
                  disabled={isSorting}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all duration-200
                    ${isSelected 
                      ? "bg-neon-600/20 text-neon-300 border border-neon-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                      : "bg-surface-800 text-gray-400 border border-surface-600 hover:bg-surface-700"}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {ALGORITHM_LABELS[algo]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Controls */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1 w-24">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Size: {arraySize}</label>
            <input type="range" min={10} max={100} value={arraySize} onChange={(e) => onArraySizeChange(Number(e.target.value))} disabled={isSorting} className="w-full accent-neon-400 cursor-pointer" />
          </div>

          <div className="flex flex-col gap-1 w-24">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Delay: {speed}ms</label>
            <input type="range" min={5} max={300} step={5} value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))} disabled={isSorting} className="w-full accent-neon-400 cursor-pointer" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Pattern</label>
            <select value={pattern} onChange={(e) => onPatternChange(e.target.value as ArrayPattern)} disabled={isSorting} className="bg-surface-800 text-xs px-2 py-1.5 rounded-lg border border-surface-600 outline-none text-gray-200 cursor-pointer">
              <option value="random">Random</option>
              <option value="nearly-sorted">Nearly Sorted</option>
              <option value="reverse-sorted">Reverse Sorted</option>
              <option value="few-unique">Few Unique</option>
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <button onClick={onGenerate} disabled={isSorting} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface-700 hover:bg-surface-600 text-gray-300 border border-surface-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            ⟳ New Data
          </button>
          <button 
            onClick={onStart} 
            disabled={isSorting || selectedAlgorithms.length < 2 || selectedAlgorithms.length > 4} 
            className={`
              px-6 py-2.5 rounded-xl text-sm font-bold transition-all
              ${isSorting ? "bg-amber-600/30 text-amber-300 border border-amber-500/30" : "bg-neon-600 hover:bg-neon-500 text-white hover:shadow-[0_0_16px_rgba(6,182,212,0.4)]"}
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            {isSorting ? "Comparing..." : "▶ Start Compare"}
          </button>
        </div>

      </div>
    </div>
  );
}
