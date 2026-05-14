import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useAdvisorStore } from "../../store/useAdvisorStore";

/** Rule-based responses for the advisor chat */
function getAdvisorResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("fastest") || lower.includes("best")) {
    return "For general-purpose sorting, Quick Sort averages O(n log n) and is often the fastest in practice. However, Merge Sort guarantees O(n log n) worst-case. It depends on your data!";
  }
  if (lower.includes("merge")) {
    return "Merge Sort is a stable, divide-and-conquer algorithm with O(n log n) time complexity in all cases. It's great for linked lists and when stability matters, but uses O(n) extra space.";
  }
  if (lower.includes("bubble")) {
    return "Bubble Sort is simple but slow — O(n²) average and worst case. It repeatedly swaps adjacent elements. Best used for educational purposes or nearly-sorted small arrays.";
  }
  if (lower.includes("quick")) {
    return "Quick Sort picks a pivot and partitions the array. Average O(n log n), but O(n²) worst case with bad pivots. In-place and cache-friendly, making it very fast in practice.";
  }
  if (lower.includes("insertion")) {
    return "Insertion Sort builds the sorted array one element at a time. O(n²) worst case but O(n) on nearly sorted data. Great for small datasets and online sorting.";
  }
  if (lower.includes("selection")) {
    return "Selection Sort finds the minimum element repeatedly and places it at the beginning. Always O(n²) — simple to implement but rarely used in production.";
  }
  if (lower.includes("compare") || lower.includes("vs") || lower.includes("difference")) {
    return "Key comparisons:\n• Bubble Sort: O(n²), stable, in-place\n• Merge Sort: O(n log n), stable, O(n) space\n• Quick Sort: O(n log n) avg, not stable, in-place\n• Insertion Sort: O(n²), stable, in-place\n\nFor large datasets, prefer Merge or Quick Sort.";
  }
  if (lower.includes("stable") || lower.includes("stability")) {
    return "A stable sort preserves the relative order of equal elements. Merge Sort and Insertion Sort are stable. Quick Sort and Selection Sort are not stable by default.";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hey! 👋 Ask me anything about sorting algorithms — time complexity, use cases, comparisons, or trade-offs!";
  }

  return "I'm not sure about that one. Try asking about specific algorithms like Bubble Sort, Merge Sort, Quick Sort, or ask me to compare them!";
}

export default function ChatPanel() {
  const messages = useAdvisorStore((s) => s.messages);
  const addMessage = useAdvisorStore((s) => s.addMessage);
  const mode = useAdvisorStore((s) => s.mode);
  const setMode = useAdvisorStore((s) => s.setMode);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (content: string) => {
    addMessage({
      algorithm: "User",
      type: "user",
      text: content,
    });

    setTimeout(() => {
      addMessage({
        algorithm: "System",
        type: "info",
        text: getAdvisorResponse(content),
      });
    }, 500);
  };

  return (
    <div
      id="chat-panel"
      className="
        flex flex-col h-full
        bg-surface-900 border-r border-surface-700
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-400 neon-glow-sm animate-pulse" />
          <h2 className="text-sm font-semibold text-gray-100 tracking-wide">
            SortLabs Advisor
          </h2>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider hidden sm:block">
            Learning Mode
          </span>
          <button
            onClick={() => setMode(mode === "learning" ? "simple" : "learning")}
            className={`
              relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none
              ${mode === "learning" ? "bg-neon-500" : "bg-surface-600"}
            `}
          >
            <span
              className={`
                inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out
                ${mode === "learning" ? "translate-x-4" : "translate-x-1"}
              `}
            />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <ChatMessage key={msg.id} message={msg} index={i} />
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
