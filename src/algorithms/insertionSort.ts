import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

export function insertionSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];

  const snapshot = (
    overrides: Record<number, BarState>,
    description: string,
    advisorMessages?: import("./types").AdvisorMessagePayload[]
  ): SortStep => {
    const barStates: BarState[] = new Array(n).fill("default");
    for (let k = 0; k <= sortedUntil; k++) barStates[k] = "sorted";
    for (const [idx, state] of Object.entries(overrides)) {
      barStates[Number(idx)] = state;
    }
    return { array: [...arr], barStates, description, advisorMessages };
  };

  let sortedUntil = 0;
  steps.push(snapshot({}, `First element ${arr[0]} is considered sorted`, [
    { type: "info", text: `Starting Insertion Sort. The first element (${arr[0]}) is trivially sorted by itself.` }
  ]));

  for (let i = 1; i < n; i++) {
    if (cancelToken.cancelled) return steps;
    let j = i;
    
    steps.push(snapshot(
      { [i]: "comparing" },
      `Looking at element ${arr[i]}`,
      [{ type: "info", text: `Taking the next value (${arr[i]}) and preparing to insert it into the sorted portion.` }]
    ));

    while (j > 0 && arr[j - 1] > arr[j]) {
      steps.push(snapshot(
        { [j]: "comparing", [j - 1]: "comparing" },
        `Comparing ${arr[j]} and ${arr[j - 1]}`,
        [{ type: "compare", text: `Comparing ${arr[j]} against ${arr[j - 1]} in the sorted portion.` }]
      ));

      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      
      steps.push(snapshot(
        { [j]: "swapped", [j - 1]: "swapped" },
        `Swapped ${arr[j]} and ${arr[j - 1]}`,
        [{ type: "swap", text: `Shifting ${arr[j]} to the left because it is smaller than ${arr[j - 1]}.` }]
      ));
      
      j--;
    }
    
    sortedUntil = i;
    steps.push(snapshot(
      { [j]: "sorted" },
      `Element inserted at correct position`,
      [{ type: "milestone", text: `Successfully inserted ${arr[j]} into its correct position within the sorted subarray.` }]
    ));
  }

  steps.push({ array: [...arr], barStates: new Array(n).fill("sorted"), description: "✓ Sorting complete!" });

  return steps;
}
