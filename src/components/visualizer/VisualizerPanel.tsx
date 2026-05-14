import { useState, useCallback, useRef, useEffect } from "react";
import { useAdvisorStore } from "../../store/useAdvisorStore";
import Controls from "./Controls";
import ArrayBar from "./ArrayBar";
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
} from "../../algorithms";
import { delay } from "../../utils/delay";
import { getAlgorithmExplanation } from "../../utils/getAlgorithmExplanation";
import { resetCancelToken, cancelSort } from "../../algorithms/cancelToken";
import { generateArray } from "../../utils/arrayGenerators";
import type { ArrayPattern } from "../../utils/arrayGenerators";

const DEFAULT_SPEED = 80;

/** Legend items for the bar state colors */
const LEGEND: { state: BarState; color: string; label: string }[] = [
  { state: "default", color: "bg-cyan-500", label: "Unsorted" },
  { state: "comparing", color: "bg-yellow-400", label: "Comparing" },
  { state: "swapped", color: "bg-pink-500", label: "Swapped" },
  { state: "sorted", color: "bg-emerald-500", label: "Sorted" },
];

const ALGO_INFO: Record<string, { name: string; intro: string; outro: string }> = {
  bubble: {
    name: "Bubble Sort",
    intro: "Starting Bubble Sort. It repeatedly compares adjacent elements and swaps them if they are out of order, pushing larger values toward the end of the array.",
    outro: "Bubble Sort completed. Time complexity is O(n²), making it simple but inefficient for large datasets.",
  },
  selection: {
    name: "Selection Sort",
    intro: "Starting Selection Sort. It repeatedly scans the unsorted section to find the minimum element, then swaps it into its correct position.",
    outro: "Selection Sort completed. Time complexity is always O(n²), making it inefficient for most practical applications.",
  },
  insertion: {
    name: "Insertion Sort",
    intro: "Starting Insertion Sort. It builds the sorted array one element at a time by repeatedly taking the next element and inserting it into the correct position.",
    outro: "Insertion Sort completed. Time complexity is O(n²), but it performs very well on small or nearly sorted datasets.",
  },
  merge: {
    name: "Merge Sort",
    intro: "Starting Merge Sort. It divides the array into smaller subarrays, sorts them, and then merges them back together in order.",
    outro: "Merge Sort completed. It guarantees O(n log n) performance and is stable, making it a strong general-purpose choice.",
  },
  quick: {
    name: "Quick Sort",
    intro: "Starting Quick Sort. It selects a 'pivot' element and partitions the array around it, then recursively sorts the sub-partitions.",
    outro: "Quick Sort completed. Average performance is O(n log n), but poor pivot choices can degrade performance to O(n²).",
  },
  heap: {
    name: "Heap Sort",
    intro: "Starting Heap Sort. It first builds a max-heap, then repeatedly swaps the largest element (root) to the end of the array.",
    outro: "Heap Sort completed. It guarantees O(n log n) performance and is in-place, but it is not a stable sort.",
  },
  counting: {
    name: "Counting Sort",
    intro: "Starting Counting Sort. It creates a frequency array based on the maximum value, then reconstructs the array without comparing elements directly.",
    outro: "Counting Sort completed. It has O(n + k) time complexity, making it extremely fast for small integer ranges.",
  },
  radix: {
    name: "Radix Sort",
    intro: "Starting Radix Sort. It processes the numbers digit by digit, from least significant to most significant, using a stable counting sort per pass.",
    outro: "Radix Sort completed. It efficiently sorts integers in O(nk) time without direct comparisons.",
  },
};

export default function VisualizerPanel() {
  // ── Core state ──────────────────────────────────────────────
  const [arraySize, setArraySize] = useState(50);
  const [pattern, setPattern] = useState<ArrayPattern>("random");
  
  const [array, setArray] = useState<number[]>([]);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [statusText, setStatusText] = useState("READY");
  
  const lastMsgTimeRef = useRef(0);
  const lastMsgTypeRef = useRef("");
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const addMessage = useAdvisorStore((s) => s.addMessage);
  const clearMessages = useAdvisorStore((s) => s.clearMessages);

  // We use a ref for speed so the animation loop always reads the
  // latest slider value without needing to restart the loop.
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Abort flag — lets us cancel a running animation when the user
  // generates a new array (future-proofing).
  const abortRef = useRef(false);

  useEffect(() => {
    return () => cancelSort();
  }, []);

  const maxValue = Math.max(...array);

  // ── Generate new array automatically when controls change ───
  useEffect(() => {
    cancelSort();
    setIsSorting(false);
    const newArr = generateArray(arraySize, pattern);
    setArray(newArr);
    setBarStates(new Array(newArr.length).fill("default"));
    setStatusText("READY");
    setComparisons(0);
    setSwaps(0);
  }, [arraySize, pattern]);

  // ── Manual Generate Button Handler ──────────────────────────
  const handleGenerateArray = useCallback(() => {
    cancelSort();
    setIsSorting(false);
    const newArr = generateArray(arraySize, pattern);
    setArray(newArr);
    setBarStates(new Array(newArr.length).fill("default"));
    setStatusText("READY");
    setComparisons(0);
    setSwaps(0);
  }, [arraySize, pattern]);

  // ── Explain Algorithm ──────────────────────────────────────────
  const handleExplainAlgorithm = useCallback(() => {
    if (isSorting) return;
    
    const algoInfo = ALGO_INFO[algorithm] || ALGO_INFO.bubble;
    const algoName = algoInfo.name;
    const explanation = getAlgorithmExplanation(algorithm);

    clearMessages();
    addMessage({
      algorithm: algoName,
      type: "info",
      text: explanation,
    });
  }, [algorithm, isSorting, addMessage, clearMessages]);

  // ── Run the sorting animation ───────────────────────────────
  const handleStartSorting = useCallback(async () => {
    if (isSorting) return;

    setIsSorting(true);
    abortRef.current = false;
    resetCancelToken();
    setStatusText("SORTING…");
    setComparisons(0);
    setSwaps(0);

    const algoInfo = ALGO_INFO[algorithm] || ALGO_INFO.bubble;
    const algoName = algoInfo.name;

    clearMessages();
    addMessage({
      algorithm: algoName,
      type: "info",
      text: algoInfo.intro,
    });

    // Generate all animation steps up front
    let steps;
    switch (algorithm) {
      case "selection":
        steps = selectionSortSteps(array);
        break;
      case "insertion":
        steps = insertionSortSteps(array);
        break;
      case "merge":
        steps = mergeSortSteps(array);
        break;
      case "quick":
        steps = quickSortSteps(array);
        break;
      case "heap":
        steps = heapSortSteps(array);
        break;
      case "counting":
        steps = countingSortSteps(array);
        break;
      case "radix":
        steps = radixSortSteps(array);
        break;
      case "bubble":
      default:
        steps = bubbleSortSteps(array);
        break;
    }

    // Replay each step with an async delay
    let compCount = 0;
    let swapCount = 0;
    
    lastMsgTimeRef.current = 0;
    lastMsgTypeRef.current = "";

    for (let i = 0; i < steps.length; i++) {
      if (abortRef.current) break;

      const step = steps[i];

      // Count comparisons and swaps from bar states
      const hasComparing = step.barStates.some((s) => s === "comparing");
      const hasSwapped = step.barStates.some((s) => s === "swapped");
      if (hasComparing) compCount++;
      if (hasSwapped) swapCount++;

      setArray(step.array);
      setBarStates(step.barStates);
      setStatusText(step.description);
      setComparisons(compCount);
      setSwaps(swapCount);

      if (step.advisorMessages) {
        const mode = useAdvisorStore.getState().mode;
        const now = Date.now();
        for (const msg of step.advisorMessages) {
          if (mode === "simple" && (msg.type === "compare" || msg.type === "swap")) continue;

          const isSpammable = msg.type === "compare" || msg.type === "swap";
          const wasSpammable = lastMsgTypeRef.current === "compare" || lastMsgTypeRef.current === "swap";
          
          if (isSpammable && wasSpammable && (now - lastMsgTimeRef.current < 2500)) {
            continue; // Anti-spam throttle
          }

          addMessage({
            algorithm: algoName,
            type: msg.type,
            text: msg.text,
          });
          lastMsgTimeRef.current = now;
          lastMsgTypeRef.current = msg.type;
        }
      }

      await delay(speedRef.current);
    }

    // Ensure final "all sorted" state
    if (!abortRef.current) {
      const finalArr = steps[steps.length - 1].array;
      setArray(finalArr);
      setBarStates(new Array(finalArr.length).fill("sorted"));
      setStatusText("✓ Sorting complete!");
      
      const isNonComp = algorithm === "counting" || algorithm === "radix";
      addMessage({
        algorithm: algoName,
        type: "complete",
        text: `${algoInfo.outro}\n\nPerformance Insight: This run completed with ${compCount} comparisons and ${swapCount} ${isNonComp ? "writes" : "swaps"}.`,
      });
    }

    setIsSorting(false);
  }, [isSorting, algorithm, array, addMessage, clearMessages]);

  // ── Render ──────────────────────────────────────────────────
  return (
    <div id="visualizer-panel" className="flex flex-col h-full bg-surface-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-700 bg-surface-900">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-neon-400"
          >
            <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10.5 7A1.5 1.5 0 0 0 9 8.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10.5 7ZM5.5 12A1.5 1.5 0 0 0 4 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 5.5 12Z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-100 tracking-wide">
            Sorting Visualizer
          </h2>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 ml-6">
          {LEGEND.map((item) => (
            <div key={item.state} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
              <span className="text-[10px] font-mono text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <span className="ml-auto text-[10px] font-mono text-gray-500">
          {array.length} elements
        </span>
      </div>

      {/* Controls */}
      <Controls
        algorithm={algorithm}
        speed={speed}
        isSorting={isSorting}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        pattern={pattern}
        onPatternChange={setPattern}
        onAlgorithmChange={setAlgorithm}
        onSpeedChange={setSpeed}
        onGenerateArray={handleGenerateArray}
        onStartSorting={handleStartSorting}
        onExplainAlgorithm={handleExplainAlgorithm}
      />

      {/* Visualization Area */}
      <div className="flex-1 flex items-end justify-center gap-1 px-6 pt-6 pb-8 overflow-hidden viz-grid-bg relative min-h-[400px]">
        {/* Horizontal reference lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 px-6 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-dashed border-surface-600/50" />
          ))}
        </div>

        {/* Bars */}
        <div 
          className="flex items-end justify-center w-full h-full relative z-10"
          style={{ gap: array.length > 80 ? '0px' : array.length > 40 ? '1px' : array.length > 20 ? '2px' : '4px' }}
        >
          {array.map((value, index) => (
            <ArrayBar
              key={index}
              value={value}
              maxValue={maxValue}
              index={index}
              totalBars={array.length}
              state={barStates[index]}
              hideLabels={array.length > 25}
            />
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-surface-700 bg-surface-900">
        <span className="text-[11px] font-mono text-gray-400 truncate flex items-center gap-2">
          {isSorting && (
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
          {!isSorting && statusText.startsWith("✓") && (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          )}
          {statusText}
        </span>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-4 shrink-0">
          <span className="text-[10px] font-mono text-gray-500">
            Comparisons: <span className="text-neon-400">{comparisons}</span>
          </span>
          <span className="text-[10px] font-mono text-gray-500">
            {algorithm === "counting" || algorithm === "radix" ? "Writes" : "Swaps"}: <span className="text-pink-400">{swaps}</span>
          </span>
          <span className="text-[10px] font-mono text-gray-600">
            v0.1.0
          </span>
        </div>
      </div>
    </div>
  );
}
