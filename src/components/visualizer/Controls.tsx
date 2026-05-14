import type { ArrayPattern } from "../../utils/arrayGenerators";

const ALGORITHMS = [
  { value: "bubble", label: "Bubble Sort", enabled: true },
  { value: "selection", label: "Selection Sort", enabled: true },
  { value: "insertion", label: "Insertion Sort", enabled: true },
  { value: "merge", label: "Merge Sort", enabled: true },
  { value: "quick", label: "Quick Sort", enabled: true },
  { value: "heap", label: "Heap Sort", enabled: true },
  { value: "counting", label: "Counting Sort", enabled: true },
  { value: "radix", label: "Radix Sort", enabled: true },
];

interface ControlsProps {
  algorithm: string;
  speed: number;
  isSorting: boolean;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  pattern: ArrayPattern;
  onPatternChange: (p: ArrayPattern) => void;
  onAlgorithmChange: (algo: string) => void;
  onSpeedChange: (speed: number) => void;
  onGenerateArray: () => void;
  onStartSorting: () => void;
  onExplainAlgorithm: () => void;
}

export default function Controls({
  algorithm,
  speed,
  isSorting,
  arraySize,
  onArraySizeChange,
  pattern,
  onPatternChange,
  onAlgorithmChange,
  onSpeedChange,
  onGenerateArray,
  onStartSorting,
  onExplainAlgorithm,
}: ControlsProps) {
  return (
    <div
      id="visualizer-controls"
      className="
        flex flex-wrap items-center gap-4 p-4
        bg-surface-850 border-b border-surface-700
      "
    >
      {/* Algorithm Select */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="algorithm-select"
          className="text-[10px] font-mono uppercase tracking-wider text-gray-500"
        >
          Algorithm
        </label>
        <select
          id="algorithm-select"
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isSorting}
          className="
            bg-surface-800 text-gray-200 text-sm font-mono
            px-3 py-2 rounded-lg border border-surface-600/50
            outline-none cursor-pointer
            focus:border-neon-500/50 focus:ring-1 focus:ring-neon-500/20
            transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {ALGORITHMS.map((algo) => (
            <option
              key={algo.value}
              value={algo.value}
              disabled={!algo.enabled}
            >
              {algo.label}{!algo.enabled ? " (coming soon)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Pattern Select */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
          Pattern
        </label>
        <select
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value as ArrayPattern)}
          disabled={isSorting}
          className="
            bg-surface-800 text-gray-200 text-sm font-mono
            px-3 py-2 rounded-lg border border-surface-600/50
            outline-none cursor-pointer
            focus:border-neon-500/50 focus:ring-1 focus:ring-neon-500/20
            transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          <option value="random">Random</option>
          <option value="nearly-sorted">Nearly Sorted</option>
          <option value="reverse-sorted">Reverse Sorted</option>
          <option value="few-unique">Few Unique</option>
        </select>
      </div>

      {/* Size Slider */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
          Size: {arraySize}
        </label>
        <input
          type="range"
          min={10}
          max={200}
          step={5}
          value={arraySize}
          onChange={(e) => onArraySizeChange(Number(e.target.value))}
          disabled={isSorting}
          className="
            w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-surface-600
            accent-neon-400
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-neon-400
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.5)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-125
          "
        />
      </div>

      {/* Speed Slider */}
      <div className="flex flex-col gap-1 min-w-[140px]">
        <label
          htmlFor="speed-slider"
          className="text-[10px] font-mono uppercase tracking-wider text-gray-500"
        >
          Delay: {speed}ms
        </label>
        <input
          id="speed-slider"
          type="range"
          min={5}
          max={500}
          step={5}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="
            w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-surface-600
            accent-neon-400
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-neon-400
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(6,182,212,0.5)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-125
          "
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Generate Array */}
        <button
          id="generate-array-button"
          type="button"
          onClick={onGenerateArray}
          disabled={isSorting}
          className="
            px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-surface-700 hover:bg-surface-600 text-gray-300
            border border-surface-600/50
            transition-all duration-200
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          ⟳ New Array
        </button>

        {/* Explain Algorithm */}
        <button
          id="explain-algorithm-button"
          type="button"
          onClick={onExplainAlgorithm}
          disabled={isSorting}
          className="
            px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-blue-600/20 hover:bg-blue-600/30 text-blue-300
            border border-blue-500/30 hover:border-blue-500/50
            transition-all duration-200
            active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center gap-1.5
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          Explain
        </button>

        {/* Start Sorting */}
        <button
          id="start-sorting-button"
          type="button"
          onClick={onStartSorting}
          disabled={isSorting}
          className={`
            px-5 py-2.5 rounded-xl text-sm font-bold
            transition-all duration-200
            active:scale-95
            disabled:cursor-not-allowed
            ${
              isSorting
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/30 disabled:opacity-70"
                : "bg-neon-600 hover:bg-neon-500 text-white hover:shadow-[0_0_16px_rgba(6,182,212,0.4)]"
            }
          `}
        >
          {isSorting ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              Sorting…
            </span>
          ) : (
            "▶ Start Sorting"
          )}
        </button>
      </div>
    </div>
  );
}
