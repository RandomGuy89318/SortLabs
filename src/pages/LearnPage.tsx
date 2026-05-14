import ChatPanel from "../components/chat/ChatPanel";
import VisualizerPanel from "../components/visualizer/VisualizerPanel";

export default function LearnPage() {
  return (
    <div className="flex flex-1 overflow-hidden flex-col md:flex-row h-full">
      {/* Left Panel — Chat (30% on desktop) */}
      <aside className="
        w-full md:w-[30%] md:min-w-[320px] md:max-w-[420px]
        h-[30vh] md:h-auto
        shrink-0
        border-b md:border-b-0
        border-surface-700
      ">
        <ChatPanel />
      </aside>

      {/* Right Panel — Visualizer (70% on desktop) */}
      <section className="flex-1 min-w-0 h-full overflow-hidden">
        <VisualizerPanel />
      </section>
    </div>
  );
}
