import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

export function heapSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];
  const sortedIndices = new Set<number>();

  const snapshot = (
    overrides: Record<number, BarState>,
    description: string,
    advisorMessages?: import("./types").AdvisorMessagePayload[]
  ): SortStep => {
    const barStates: BarState[] = new Array(n).fill("default");
    for (const idx of sortedIndices) barStates[idx] = "sorted";
    for (const [idx, state] of Object.entries(overrides)) {
      barStates[Number(idx)] = state;
    }
    return { array: [...arr], barStates, description, advisorMessages };
  };

  function heapify(N: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < N) {
      steps.push(snapshot(
        { [i]: "comparing", [left]: "comparing" },
        `Comparing parent ${arr[i]} with left child ${arr[left]}`,
        [{ type: "compare", text: `Heapifying: comparing parent ${arr[i]} with its left child ${arr[left]}.` }]
      ));
      if (arr[left] > arr[largest]) largest = left;
    }

    if (right < N) {
      steps.push(snapshot(
        { [largest]: "comparing", [right]: "comparing" },
        `Comparing current largest ${arr[largest]} with right child ${arr[right]}`,
        [{ type: "compare", text: `Heapifying: comparing current largest ${arr[largest]} with its right child ${arr[right]}.` }]
      ));
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push(snapshot(
        { [i]: "swapped", [largest]: "swapped" },
        `Swapped to maintain max heap: ${arr[i]} and ${arr[largest]}`,
        [{ type: "swap", text: `Swapping ${arr[i]} and ${arr[largest]} to maintain the max-heap property.` }]
      ));
      heapify(N, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (cancelToken.cancelled) return steps;
    heapify(n, i);
  }
  
  steps.push(snapshot(
    {},
    `Max heap built`,
    [{ type: "milestone", text: `The array has been successfully arranged into a valid max-heap.` }]
  ));

  // Heap sort
  for (let i = n - 1; i > 0; i--) {
    if (cancelToken.cancelled) return steps;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sortedIndices.add(i);
    steps.push(snapshot(
      { [0]: "swapped", [i]: "swapped" },
      `Moved max element ${arr[i]} to the end`,
      [{ type: "milestone", text: `Swapped the root (max element ${arr[i]}) to the end of the array, locking it into its sorted position.` }]
    ));
    
    heapify(i, 0);
  }
  
  sortedIndices.add(0);
  steps.push({ array: [...arr], barStates: new Array(n).fill("sorted"), description: "✓ Sorting complete!" });

  return steps;
}
