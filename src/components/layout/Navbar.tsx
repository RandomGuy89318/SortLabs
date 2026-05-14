import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex items-center px-5 py-2.5 border-b border-surface-700 bg-surface-900/80 backdrop-blur-md z-10 shrink-0">
      <div className="flex items-center gap-2.5 mr-8">
        <div className="
          w-7 h-7 rounded-lg bg-neon-600/20 border border-neon-500/30
          flex items-center justify-center neon-glow-sm
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-neon-400">
            <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10.5 7A1.5 1.5 0 0 0 9 8.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10.5 7ZM5.5 12A1.5 1.5 0 0 0 4 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 5.5 12Z" />
          </svg>
        </div>
        <h1 className="text-base font-bold text-gray-100 tracking-tight">
          Sort<span className="text-neon-400">Labs</span>
        </h1>
      </div>

      <nav className="flex items-center gap-1">
        <NavLink
          to="/learn"
          className={({ isActive }) => `
            px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive 
              ? "bg-neon-500/10 text-neon-400 border border-neon-500/20" 
              : "text-gray-400 hover:text-gray-200 hover:bg-surface-800 border border-transparent"}
          `}
        >
          Learn
        </NavLink>
        <NavLink
          to="/compare"
          className={({ isActive }) => `
            px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive 
              ? "bg-neon-500/10 text-neon-400 border border-neon-500/20" 
              : "text-gray-400 hover:text-gray-200 hover:bg-surface-800 border border-transparent"}
          `}
        >
          Compare
        </NavLink>
        <NavLink
          to="/code-viewer"
          className={({ isActive }) => `
            px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${isActive 
              ? "bg-neon-500/10 text-neon-400 border border-neon-500/20" 
              : "text-gray-400 hover:text-gray-200 hover:bg-surface-800 border border-transparent"}
          `}
        >
          Code Viewer
        </NavLink>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-[10px] font-mono text-gray-500 hidden sm:inline">
          Interactive Sorting Playground
        </span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-neon-400 transition-colors duration-200"
          aria-label="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
