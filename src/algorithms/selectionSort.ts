import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

export function selectionSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];

  const snapshot = (
    overrides: Record<number, BarState>,
    description: string,
    advisorMessages?: import("./types").AdvisorMessagePayload[]
  ): SortStep => {
    const barStates: BarState[] = new Array(n).fill("default");
    for (let k = 0; k < sortedUntil; k++) barStates[k] = "sorted";
    for (const [idx, state] of Object.entries(overrides)) {
      barStates[Number(idx)] = state;
    }
    return { array: [...arr], barStates, description, advisorMessages };
  };

  let sortedUntil = 0;

  for (let i = 0; i < n - 1; i++) {
    if (cancelToken.cancelled) return steps;
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push(snapshot(
        { [i]: "swapped", [minIdx]: "comparing", [j]: "comparing" },
        `Finding minimum: comparing ${arr[j]} with current min ${arr[minIdx]}`,
        [{ type: "compare", text: `Scanning unsorted section: comparing ${arr[j]} with the current minimum ${arr[minIdx]}.` }]
      ));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(snapshot(
          { [i]: "swapped", [minIdx]: "swapped" },
          `New minimum found: ${arr[minIdx]}`,
          [{ type: "info", text: `A new minimum has been found: ${arr[minIdx]} at index ${minIdx}.` }]
        ));
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push(snapshot(
        { [i]: "swapped", [minIdx]: "swapped" },
        `Swapped ${arr[minIdx]} and ${arr[i]}`,
        [{ type: "swap", text: `Swapping the smallest found value (${arr[i]}) into its correct position at index ${i}.` }]
      ));
    } else {
      steps.push(snapshot(
        { [i]: "swapped" },
        `Element ${arr[i]} is already the minimum`,
        [{ type: "info", text: `The element ${arr[i]} is already the smallest remaining, so no swap is needed.` }]
      ));
    }
    
    sortedUntil = i + 1;
    steps.push(snapshot(
      { [i]: "sorted" },
      `${arr[i]} is in its sorted position`,
      [{ type: "milestone", text: `The value ${arr[i]} is now locked into its final sorted position.` }]
    ));
  }

  sortedUntil = n;
  const finalStates: Record<number, BarState> = {};
  for(let k=0; k<n; k++) finalStates[k] = "sorted";
  steps.push({ array: [...arr], barStates: new Array(n).fill("sorted"), description: "✓ Sorting complete!" });

  return steps;
}
