export const COMPLEXITY_DATA: Record<string, { best: string; average: string; worst: string; space: string; stable: boolean; }> = {
  bubble: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true },
  selection: { best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: false },
  insertion: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true },
  merge: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: true },
  quick: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: false },
  heap: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: false },
  counting: { best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)", space: "O(n + k)", stable: true },
  radix: { best: "O(nk)", average: "O(nk)", worst: "O(nk)", space: "O(n + k)", stable: true },
};

export const ALGORITHM_LABELS: Record<string, string> = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
  heap: "Heap Sort",
  counting: "Counting Sort",
  radix: "Radix Sort"
};
