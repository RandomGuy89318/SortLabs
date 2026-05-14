import { create } from "zustand";

export type MessageType = "user" | "info" | "compare" | "swap" | "milestone" | "complete" | "insight";

export interface AdvisorMessage {
  id: string;
  timestamp: number;
  algorithm: string;
  type: MessageType;
  text: string;
}

interface AdvisorStore {
  messages: AdvisorMessage[];
  mode: "simple" | "learning";
  setMode: (mode: "simple" | "learning") => void;
  addMessage: (msg: Omit<AdvisorMessage, "id" | "timestamp">) => void;
  clearMessages: () => void;
}

const INITIAL_MESSAGE: AdvisorMessage = {
  id: "initial",
  timestamp: Date.now(),
  algorithm: "System",
  type: "info",
  text: "Welcome to SortLabs Advisor! 👋\n\nI will act as your educational guide. When you start sorting, I will provide real-time commentary explaining what the algorithm is doing and why.",
};

export const useAdvisorStore = create<AdvisorStore>((set) => ({
  messages: [INITIAL_MESSAGE],
  mode: "learning",
  setMode: (mode) => set({ mode }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...msg,
          id: Math.random().toString(36).substring(2, 9), // simple id
          timestamp: Date.now(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}));
