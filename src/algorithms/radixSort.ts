import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

export function radixSortSteps(input: number[]): SortStep[] {
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

  // Find the maximum number to know number of digits
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    if (cancelToken.cancelled) return steps;
    if (arr[i] > max) max = arr[i];
  }

  steps.push(snapshot(
    {},
    `Max value is ${max}. Beginning digit-by-digit sorting.`,
    [{ type: "info", text: `Found maximum value ${max}. Radix Sort will process digits from least significant (1s) to most significant.` }]
  ));

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    if (cancelToken.cancelled) return steps;
    
    steps.push(snapshot(
      {},
      `Sorting based on digit at place ${exp}`,
      [{ type: "milestone", text: `Starting pass for the ${exp}s place digit.` }]
    ));

    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    // Store count of occurrences in count[]
    for (let i = 0; i < n; i++) {
      if (cancelToken.cancelled) return steps;
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      steps.push(snapshot(
        { [i]: "comparing" },
        `Reading digit ${digit} from ${arr[i]}`,
        [{ type: "compare", text: `The ${exp}s digit of ${arr[i]} is ${digit}. Incrementing bucket ${digit}.` }]
      ));
    }

    // Change count[i] so that count[i] now contains actual
    // position of this digit in output[]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build the output array (going backward for stability)
    for (let i = n - 1; i >= 0; i--) {
      if (cancelToken.cancelled) return steps;
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]--;
      const targetIdx = count[digit];
      output[targetIdx] = arr[i];
    }

    // Copy the output array to arr[], so that arr[] now
    // contains sorted numbers according to current digit
    for (let i = 0; i < n; i++) {
      if (cancelToken.cancelled) return steps;
      arr[i] = output[i];
      steps.push(snapshot(
        { [i]: "swapped" }, // Using "swapped" to trigger a "write" metric
        `Writing ${arr[i]} back to array`,
        [{ type: "swap", text: `Writing ${arr[i]} back into the main array for this pass.` }]
      ));
    }
  }

  // Final sorted state
  steps.push({ 
    array: [...arr], 
    barStates: new Array(n).fill("sorted"), 
    description: "✓ Radix Sort complete!",
    advisorMessages: [{ type: "complete", text: "Radix Sort has processed all digits. The array is fully sorted!" }]
  });

  return steps;
}
