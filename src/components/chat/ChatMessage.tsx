import { motion } from "framer-motion";
import type { AdvisorMessage } from "../../store/useAdvisorStore";

interface ChatMessageProps {
  message: AdvisorMessage;
  index: number;
}

export default function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.type === "user";

  let bgClass = "bg-surface-800 text-gray-300 border-surface-600/50";
  let dotClass = "bg-neon-400 animate-pulse";
  let titleClass = "text-neon-400/80";

  if (isUser) {
    bgClass = "bg-neon-600/20 text-neon-100 border-neon-500/30";
  } else if (message.type === "compare") {
    bgClass = "bg-amber-900/20 text-amber-200 border-amber-500/30";
    dotClass = "bg-amber-400";
    titleClass = "text-amber-400/80";
  } else if (message.type === "swap") {
    bgClass = "bg-rose-900/20 text-rose-200 border-rose-500/30";
    dotClass = "bg-rose-400";
    titleClass = "text-rose-400/80";
  } else if (message.type === "milestone") {
    bgClass = "bg-blue-900/20 text-blue-200 border-blue-500/30";
    dotClass = "bg-blue-400";
    titleClass = "text-blue-400/80";
  } else if (message.type === "complete") {
    bgClass = "bg-emerald-900/20 text-emerald-200 border-emerald-500/30";
    dotClass = "bg-emerald-400";
    titleClass = "text-emerald-400/80";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed border
          ${bgClass}
          ${isUser ? "rounded-br-md" : "rounded-bl-md"}
        `}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            <span className={`text-[11px] font-mono font-medium uppercase tracking-wider ${titleClass}`}>
              {message.algorithm}
            </span>
            <span className="text-[10px] text-gray-500 ml-auto font-mono">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        )}
        <p className="m-0 whitespace-pre-wrap">{message.text}</p>
      </div>
    </motion.div>
  );
}
