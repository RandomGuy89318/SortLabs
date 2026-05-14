import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

export function countingSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];

  const snapshot = (
    overrides: Record<number, BarState>,
    description: string,
    advisorMessages?: import("./types").AdvisorMessagePayload[]
  ): SortStep => {
    const barStates: BarState[] = new Array(n).fill("default");
    for (const [idx, state] of Object.entries(overrides)) {
      barStates[Number(idx)] = state;
    }
    return { array: [...arr], barStates, description, advisorMessages };
  };

  if (n === 0) return steps;

  // Find max to determine count array size
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    if (cancelToken.cancelled) return steps;
    steps.push(snapshot(
      { [i]: "comparing" },
      `Finding max value: scanning ${arr[i]}`,
      [{ type: "compare", text: `Scanning array to find the maximum value. Current element: ${arr[i]}` }]
    ));
    if (arr[i] > max) max = arr[i];
  }

  steps.push(snapshot(
    {},
    `Max value found: ${max}. Creating frequency array of size ${max + 1}`,
    [{ type: "info", text: `The maximum value is ${max}. Creating a frequency array to count occurrences of each value.` }]
  ));

  const count = new Array(max + 1).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    if (cancelToken.cancelled) return steps;
    count[arr[i]]++;
    steps.push(snapshot(
      { [i]: "comparing" },
      `Counting element ${arr[i]} (frequency: ${count[arr[i]]})`,
      [{ type: "compare", text: `Found value ${arr[i]}. Incrementing its count to ${count[arr[i]]}.` }]
    ));
  }

  // Accumulate counts (skip visualizing this abstract array)
  for (let i = 1; i <= max; i++) {
    if (cancelToken.cancelled) return steps;
    count[i] += count[i - 1];
  }

  steps.push(snapshot(
    {},
    `Accumulated frequencies to determine final positions`,
    [{ type: "milestone", text: `Computed prefix sums in the frequency array. This tells us the final sorted position for each value.` }]
  ));

  // Build the output array (going backwards for stability)
  const output = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    if (cancelToken.cancelled) return steps;
    const val = arr[i];
    count[val]--;
    const targetIdx = count[val];
    output[targetIdx] = val;
    
    steps.push(snapshot(
      { [i]: "comparing" },
      `Placing ${val} into target index ${targetIdx}`,
      [{ type: "swap", text: `Looking at original value ${val}. According to frequency array, it goes to index ${targetIdx}.` }]
    ));
  }

  // Copy output back to original array to visualize writes
  for (let i = 0; i < n; i++) {
    if (cancelToken.cancelled) return steps;
    arr[i] = output[i];
    steps.push(snapshot(
      { [i]: "swapped" }, // Using "swapped" to trigger a "write" metric
      `Writing ${arr[i]} to index ${i}`,
      [{ type: "swap", text: `Writing sorted value ${arr[i]} directly into position ${i}.` }]
    ));
  }

  // Final sorted state
  steps.push({ 
    array: [...arr], 
    barStates: new Array(n).fill("sorted"), 
    description: "✓ Counting Sort complete!",
    advisorMessages: [{ type: "complete", text: "Counting Sort is complete. Notice how it didn't compare elements directly, but counted them instead." }]
  });

  return steps;
}
