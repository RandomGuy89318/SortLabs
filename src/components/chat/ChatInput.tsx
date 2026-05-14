import { useState, type FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 border-t border-surface-700"
    >
      <input
        id="chat-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about sorting algorithms..."
        className="
          flex-1 bg-surface-850 text-gray-200 text-sm
          px-4 py-2.5 rounded-xl border border-surface-600/50
          placeholder:text-gray-500 font-mono
          outline-none
          focus:border-neon-500/50 focus:ring-1 focus:ring-neon-500/20
          transition-all duration-200
        "
      />
      <button
        id="chat-send-button"
        type="submit"
        className="
          flex items-center justify-center
          w-10 h-10 rounded-xl
          bg-neon-600 hover:bg-neon-500
          text-white text-sm font-semibold
          transition-all duration-200
          hover:shadow-[0_0_12px_rgba(6,182,212,0.4)]
          active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
        "
        disabled={!input.trim()}
        aria-label="Send message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95l14.095-5.637a.75.75 0 0 0 0-1.39L3.105 2.288Z" />
        </svg>
      </button>
    </form>
  );
}
