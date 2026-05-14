import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

export function mergeSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const n = arr.length;
  const steps: SortStep[] = [];

  const snapshot = (
    overrides: Record<number, BarState>,
    description: string,
    advisorMessages?: import("./types").AdvisorMessagePayload[]
  ): SortStep => {
    const barStates: BarState[] = new Array(n).fill("default");
    // No strict "sorted until" for merge sort until the end
    for (const [idx, state] of Object.entries(overrides)) {
      barStates[Number(idx)] = state;
    }
    return { array: [...arr], barStates, description, advisorMessages };
  };

  function merge(left: number, mid: number, right: number) {
    if (cancelToken.cancelled) return;
    const temp = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      steps.push(snapshot(
        { [i]: "comparing", [j]: "comparing" },
        `Comparing ${arr[i]} and ${arr[j]}`,
        [{ type: "compare", text: `Comparing ${arr[i]} from the left subarray and ${arr[j]} from the right subarray.` }]
      ));

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }
    }

    while (i <= mid) {
      temp.push(arr[i++]);
    }
    while (j <= right) {
      temp.push(arr[j++]);
    }

    // Copy temp back to arr
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      
      const overrides: Record<number, BarState> = {};
      for(let x = left; x <= right; x++) overrides[x] = "comparing";
      overrides[left + k] = "swapped";
      
      steps.push(snapshot(
        overrides,
        `Overwriting value at index ${left + k} with ${temp[k]}`,
        [{ type: "swap", text: `Writing the chosen element ${temp[k]} into the merged array at index ${left + k}.` }]
      ));
    }
  }

  function sort(left: number, right: number) {
    if (cancelToken.cancelled) return;
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    
    steps.push(snapshot(
      {},
      `Dividing array from index ${left} to ${right}`,
      [{ type: "info", text: `Dividing the current array section (indices ${left} to ${right}) into two smaller subarrays.` }]
    ));

    sort(left, mid);
    sort(mid + 1, right);
    
    steps.push(snapshot(
      {},
      `Merging subarrays from index ${left} to ${right}`,
      [{ type: "milestone", text: `Ready to merge the sorted left and right subarrays back together.` }]
    ));
    
    merge(left, mid, right);
  }

  sort(0, n - 1);
  steps.push({ array: [...arr], barStates: new Array(n).fill("sorted"), description: "✓ Sorting complete!" });

  return steps;
}
