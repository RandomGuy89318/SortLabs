export type SortStatus = "idle" | "running" | "completed";

export type SortMetrics = {
  comparisons: number;
  swaps: number;
  elapsedMs: number;
  status: SortStatus;
};

export type ComparisonRun = {
  algorithm: string;
  array: number[];
  metrics: SortMetrics;
};
