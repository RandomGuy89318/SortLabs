export type BarState = "default" | "comparing" | "swapped" | "sorted";
export type MessageType = "info" | "compare" | "swap" | "milestone" | "complete";

export interface AdvisorMessagePayload {
  type: MessageType;
  text: string;
}

export interface SortStep {
  array: number[];
  barStates: BarState[];
  description: string;
  advisorMessages?: AdvisorMessagePayload[];
}
