import { useState, useEffect, useRef } from "react";
import ArrayBar from "../visualizer/ArrayBar";
import MetricsPanel from "./MetricsPanel";
import ComplexitySummary from "./ComplexitySummary";
import type { SortMetrics } from "../../types/compare";
import { ALGORITHM_LABELS } from "../../data/complexityData";
import { delay } from "../../utils/delay";
import {
  bubbleSortSteps,
  selectionSortSteps,
  insertionSortSteps,
  mergeSortSteps,
  quickSortSteps,
  heapSortSteps,
  countingSortSteps,
  radixSortSteps,
  type BarState,
  type SortStep,
} from "../../algorithms";

interface CompareCardProps {
  algorithm: string;
  initialArray: number[];
  isSorting: boolean;
  speed: number;
  onComplete?: (algo: string) => void;
}

export default function CompareCard({
  algorithm,
  initialArray,
  isSorting,
  speed,
  onComplete,
}: CompareCardProps) {
  const [array, setArray] = useState<number[]>(initialArray);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [metrics, setMetrics] = useState<SortMetrics>({ comparisons: 0, swaps: 0, elapsedMs: 0, status: "idle" });

  const speedRef = useRef(speed);
  speedRef.current = speed;
  const abortRef = useRef(false);

  useEffect(() => {
    setArray(initialArray);
    setBarStates(new Array(initialArray.length).fill("default"));
    setMetrics({ comparisons: 0, swaps: 0, elapsedMs: 0, status: "idle" });
  }, [initialArray]);

  useEffect(() => {
    if (!isSorting) return;
    abortRef.current = false;
    
    let steps: SortStep[] = [];
    const arrCopy = [...initialArray];
    switch (algorithm) {
      case "bubble": steps = bubbleSortSteps(arrCopy); break;
      case "selection": steps = selectionSortSteps(arrCopy); break;
      case "insertion": steps = insertionSortSteps(arrCopy); break;
      case "merge": steps = mergeSortSteps(arrCopy); break;
      case "quick": steps = quickSortSteps(arrCopy); break;
      case "heap": steps = heapSortSteps(arrCopy); break;
      case "counting": steps = countingSortSteps(arrCopy); break;
      case "radix": steps = radixSortSteps(arrCopy); break;
    }

    let compCount = 0;
    let swapCount = 0;

    const run = async () => {
      setMetrics((m) => ({ ...m, status: "running" }));
      
      for (let i = 0; i < steps.length; i++) {
        if (abortRef.current) break;
        const step = steps[i];
        
        if (step.barStates.some((s: BarState) => s === "comparing")) compCount++;
        if (step.barStates.some((s: BarState) => s === "swapped")) swapCount++;

        setArray(step.array);
        setBarStates(step.barStates);
        setMetrics((m) => ({ ...m, comparisons: compCount, swaps: swapCount }));

        await delay(speedRef.current);
      }

      if (!abortRef.current) {
        setArray(steps[steps.length - 1].array);
        setBarStates(new Array(initialArray.length).fill("sorted"));
        setMetrics((m) => ({ ...m, status: "completed" }));
        if (onComplete) onComplete(algorithm);
      }
    };
    
    run();
    
    return () => { abortRef.current = true; };
  }, [isSorting, algorithm, initialArray]);

  const maxValue = Math.max(...initialArray);
  const hideLabels = array.length > 20;

  return (
    <div className="flex flex-col bg-surface-900 border border-surface-700/80 rounded-2xl p-4 gap-3 shadow-xl relative overflow-hidden group hover:border-surface-600 transition-colors">
      {/* Subtle background glow when active */}
      {metrics.status === 'running' && (
        <div className="absolute inset-0 bg-neon-500/5 opacity-50 pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 z-10">
        <div className={`w-2 h-2 rounded-full ${
          metrics.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' :
          metrics.status === 'running' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse' :
          'bg-neon-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
        }`} />
        {ALGORITHM_LABELS[algorithm]}
      </h3>

      {/* Mini Visualizer */}
      <div className="h-[180px] w-full flex items-end justify-center gap-[1px] bg-surface-950 rounded-xl p-2 border border-surface-800/80 relative viz-grid-bg z-10">
        {array.map((value, index) => (
          <ArrayBar
            key={index}
            value={value}
            maxValue={maxValue}
            index={index}
            totalBars={array.length}
            state={barStates[index] || "default"}
            hideLabels={hideLabels}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col gap-2 mt-1">
        <MetricsPanel metrics={metrics} algorithm={algorithm} />
        <ComplexitySummary algorithm={algorithm} />
      </div>
    </div>
  );
}
