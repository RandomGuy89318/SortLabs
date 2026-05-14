import { useState } from "react";
import { ALGORITHM_DOCS, type AlgorithmDoc } from "../data/algorithmDocs";
import ChatPanel from "../components/chat/ChatPanel";
import { useAdvisorStore } from "../store/useAdvisorStore";

export default function CodeViewerPage() {
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>("bubble");
  const [activeTab, setActiveTab] = useState<"code" | "pseudo" | "explain">("code");

  const algorithms = Object.values(ALGORITHM_DOCS);
  const selectedDoc: AlgorithmDoc | undefined = ALGORITHM_DOCS[selectedAlgoId];
  const addMessage = useAdvisorStore((s) => s.addMessage);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-surface-950 overflow-hidden">
      {/* LEFT: Algorithm Selector and Advisor */}
      <div className="lg:w-64 shrink-0 border-r border-surface-700/50 bg-surface-900/40 flex flex-col h-full">
        <div className="p-4 flex flex-col gap-2 overflow-y-auto max-h-[50vh]">
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 px-2">Algorithms</h3>
          {algorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setSelectedAlgoId(algo.id)}
              className={`
                w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${selectedAlgoId === algo.id 
                  ? "bg-neon-600/20 text-neon-300 border border-neon-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]" 
                  : "text-gray-400 border border-transparent hover:bg-surface-800 hover:text-gray-200"}
              `}
            >
              {algo.name}
            </button>
          ))}
        </div>
        <div className="flex-1 min-h-[300px] overflow-hidden border-t border-surface-700/50 bg-surface-900">
          <ChatPanel />
        </div>
      </div>

      {/* CENTER: Code Viewer Tabs */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-950 relative border-r border-surface-700/50">
        {!selectedDoc ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 font-mono">
            Select an algorithm to view its implementation
          </div>
        ) : (
          <>
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/50 bg-surface-900/20 shrink-0">
              <div className="flex items-center gap-2">
                <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${activeTab === "code" ? "bg-neon-500/10 text-neon-400" : "text-gray-500 hover:text-gray-300"}`}
              >
                TypeScript
              </button>
              <button
                onClick={() => setActiveTab("pseudo")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${activeTab === "pseudo" ? "bg-neon-500/10 text-neon-400" : "text-gray-500 hover:text-gray-300"}`}
              >
                Pseudocode
              </button>
              <button
                onClick={() => setActiveTab("explain")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${activeTab === "explain" ? "bg-neon-500/10 text-neon-400" : "text-gray-500 hover:text-gray-300"}`}
              >
                Explanation
              </button>
              </div>
              <button
                onClick={() => {
                  addMessage({
                    algorithm: selectedDoc.name,
                    type: "insight",
                    text: `Let's break down the logic for ${selectedDoc.name} line-by-line:\n\n${selectedDoc.pseudocode.map((line, i) => `${i + 1}. ${line}`).join('\n')}\n\n${selectedDoc.explanation}`
                  });
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-neon-600/20 hover:bg-neon-600/40 text-neon-300 border border-neon-500/30"
              >
                Explain Code Logic
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {activeTab === "code" && (
                <pre className="p-6 rounded-xl bg-[#0f111a] border border-surface-800 text-sm font-mono leading-relaxed text-gray-300 overflow-x-auto shadow-inner">
                  <code>{selectedDoc.code}</code>
                </pre>
              )}

              {activeTab === "pseudo" && (
                <pre className="p-6 rounded-xl bg-[#0f111a] border border-surface-800 text-sm font-mono leading-relaxed text-neon-100 overflow-x-auto shadow-inner">
                  <code>{selectedDoc.pseudocode.join("\n")}</code>
                </pre>
              )}

              {activeTab === "explain" && (
                <div className="p-6 rounded-xl bg-surface-900/50 border border-surface-800 text-sm text-gray-300 leading-loose max-w-3xl">
                  {selectedDoc.explanation}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* RIGHT: Complexity Panel */}
      <div className="lg:w-80 shrink-0 bg-surface-900/30 p-6 overflow-y-auto">
        <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6">Algorithm Profile</h3>
        
        {selectedDoc ? (
          <div className="flex flex-col gap-6">
            {/* Time Complexity */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-200 border-b border-surface-700/50 pb-2">Time Complexity</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <span className="text-gray-500">Best Case</span>
                <span className="text-emerald-400 text-right">{selectedDoc.complexity.best}</span>
                <span className="text-gray-500">Average Case</span>
                <span className="text-amber-400 text-right">{selectedDoc.complexity.average}</span>
                <span className="text-gray-500">Worst Case</span>
                <span className="text-rose-400 text-right">{selectedDoc.complexity.worst}</span>
              </div>
            </div>

            {/* Space Complexity */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-200 border-b border-surface-700/50 pb-2">Space Complexity</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <span className="text-gray-500">Memory</span>
                <span className="text-purple-400 text-right">{selectedDoc.complexity.space}</span>
              </div>
            </div>

            {/* Attributes */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-200 border-b border-surface-700/50 pb-2">Attributes</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <span className="text-gray-500">Stable</span>
                <div className="text-right flex items-center justify-end gap-1.5">
                  {selectedDoc.stable ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Yes</>
                  ) : (
                    <><span className="w-1.5 h-1.5 rounded-full bg-surface-600" /> No</>
                  )}
                </div>
                
                <span className="text-gray-500">In-Place</span>
                <div className="text-right flex items-center justify-end gap-1.5">
                  {selectedDoc.inPlace ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Yes</>
                  ) : (
                    <><span className="w-1.5 h-1.5 rounded-full bg-surface-600" /> No</>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No profile data available.</div>
        )}
      </div>

    </div>
  );
}
