import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

export function quickSortSteps(input: number[]): SortStep[] {
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

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    steps.push(snapshot(
      { [high]: "swapped" },
      `Pivot selected: ${pivot}`,
      [{ type: "milestone", text: `Choosing ${pivot} as the pivot element for this partition.` }]
    ));
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      steps.push(snapshot(
        { [high]: "swapped", [j]: "comparing" },
        `Comparing ${arr[j]} with pivot ${pivot}`,
        [{ type: "compare", text: `Comparing ${arr[j]} against the pivot ${pivot}.` }]
      ));
      
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i !== j) {
          steps.push(snapshot(
            { [high]: "swapped", [i]: "swapped", [j]: "swapped" },
            `Swapped ${arr[i]} and ${arr[j]} (smaller than pivot)`,
            [{ type: "swap", text: `${arr[i]} is smaller than the pivot, swapping it to the left partition.` }]
          ));
        }
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    if (i + 1 !== high) {
      steps.push(snapshot(
        { [i + 1]: "swapped", [high]: "swapped" },
        `Moved pivot ${pivot} to its correct position`,
        [{ type: "swap", text: `Moving the pivot ${pivot} into its final sorted position between the two partitions.` }]
      ));
    } else {
      steps.push(snapshot(
        { [high]: "swapped" },
        `Pivot ${pivot} is already in its correct position`,
        [{ type: "info", text: `The pivot ${pivot} is already in its correct position.` }]
      ));
    }
    
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (cancelToken.cancelled) return;
    if (low < high) {
      const pi = partition(low, high);
      sortedIndices.add(pi);
      steps.push(snapshot(
        {},
        `Pivot ${arr[pi]} is in its sorted position`,
        [{ type: "info", text: `The pivot element ${arr[pi]} is now permanently sorted.` }]
      ));
      
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
      steps.push(snapshot(
        {},
        `Element ${arr[low]} is in its sorted position`,
        [{ type: "info", text: `Single element ${arr[low]} is trivially sorted.` }]
      ));
    }
  }

  sort(0, n - 1);
  steps.push({ array: [...arr], barStates: new Array(n).fill("sorted"), description: "✓ Sorting complete!" });

  return steps;
}
