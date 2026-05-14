import { useState, useCallback, useEffect } from "react";
import CompareControls from "../components/compare/CompareControls";
import CompareCard from "../components/compare/CompareCard";
import type { ArrayPattern } from "../utils/arrayGenerators";
import { generateArray } from "../utils/arrayGenerators";
import { resetCancelToken, cancelSort } from "../algorithms/cancelToken";
import ChatPanel from "../components/chat/ChatPanel";
import { useAdvisorStore } from "../store/useAdvisorStore";
import { ALGORITHM_LABELS } from "../data/complexityData";

export default function ComparePage() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(["bubble", "quick"]);
  const [arraySize, setArraySize] = useState(30);
  const [pattern, setPattern] = useState<ArrayPattern>("random");
  const [speed, setSpeed] = useState(20);
  const [isSorting, setIsSorting] = useState(false);
  const [sharedArray, setSharedArray] = useState<number[]>([]);
  const [completedAlgos, setCompletedAlgos] = useState<Set<string>>(new Set());
  const addMessage = useAdvisorStore((s) => s.addMessage);

  useEffect(() => {
    return () => cancelSort();
  }, []);

  const handleGenerate = useCallback(() => {
    cancelSort();
    setSharedArray(generateArray(arraySize, pattern));
    setIsSorting(false);
    setCompletedAlgos(new Set());
  }, [arraySize, pattern]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleToggleAlgorithm = (algo: string) => {
    setSelectedAlgorithms(prev => {
      if (prev.includes(algo)) {
        return prev.filter(a => a !== algo);
      } else {
        if (prev.length >= 4) return prev; // max 4
        return [...prev, algo];
      }
    });
  };

  const handleStart = () => {
    resetCancelToken();
    setIsSorting(true);
    setCompletedAlgos(new Set());
  };

  const handleComplete = useCallback((algo: string) => {
    setCompletedAlgos(prev => {
      const next = new Set(prev);
      next.add(algo);
      return next;
    });
  }, []);

  useEffect(() => {
    if (isSorting && completedAlgos.size === selectedAlgorithms.length && selectedAlgorithms.length > 0) {
      setIsSorting(false);
      
      const names = selectedAlgorithms.map(a => ALGORITHM_LABELS[a]).join(", ");
      addMessage({
        algorithm: "System",
        type: "insight",
        text: `Comparison run finished for: ${names}. Check the metrics panels to compare their comparisons and writes.`
      });
    }
  }, [completedAlgos, isSorting, selectedAlgorithms.length, selectedAlgorithms, addMessage]);

  return (
    <div className="flex flex-1 overflow-hidden flex-col md:flex-row h-full">
      {/* Left Panel — Chat */}
      <aside className="
        w-full md:w-[30%] md:min-w-[320px] md:max-w-[420px]
        h-[30vh] md:h-auto shrink-0 border-b md:border-b-0 border-surface-700
      ">
        <ChatPanel />
      </aside>

      {/* Right Panel */}
      <section className="flex-1 flex flex-col h-full bg-surface-950 overflow-hidden">
        <CompareControls
          selectedAlgorithms={selectedAlgorithms}
          onToggleAlgorithm={handleToggleAlgorithm}
          arraySize={arraySize}
          onArraySizeChange={setArraySize}
          pattern={pattern}
          onPatternChange={setPattern}
          speed={speed}
          onSpeedChange={setSpeed}
          onGenerate={handleGenerate}
          onStart={handleStart}
          isSorting={isSorting}
        />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface-950">
        {selectedAlgorithms.length < 2 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface-800 border border-surface-700 flex items-center justify-center mb-4 text-neon-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2">Select Algorithms to Compare</h2>
            <p className="text-sm text-gray-400 font-mono max-w-md">
              Choose between 2 and 4 sorting algorithms from the controls above to start comparing their real-time performance.
            </p>
          </div>
        ) : (
          <div className={`
            grid gap-6 
            ${selectedAlgorithms.length === 2 ? 'grid-cols-1 xl:grid-cols-2 max-w-5xl mx-auto' : ''}
            ${selectedAlgorithms.length === 3 ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto' : ''}
            ${selectedAlgorithms.length === 4 ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 max-w-[1600px] mx-auto' : ''}
          `}>
            {selectedAlgorithms.map(algo => (
              <CompareCard
                key={algo}
                algorithm={algo}
                initialArray={sharedArray}
                isSorting={isSorting}
                speed={speed}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
      </section>
    </div>
  );
}
