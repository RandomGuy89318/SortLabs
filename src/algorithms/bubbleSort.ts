import type { BarState, SortStep } from "./types";
import { cancelToken } from "./cancelToken";

/**
 * Bubble Sort — Animation Step Generator
 *
 * Instead of returning a sorted array, this produces an ordered list of
 * "animation steps" that the visualizer replays one-by-one so the user
 * can watch every comparison and swap in real time.
 */

/**
 * Generate every animation step for a classic Bubble Sort.
 *
 * Time complexity: O(n²) — intentionally kept simple for educational value.
 */
export function bubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input]; // work on a copy
  const n = arr.length;
  const steps: SortStep[] = [];

  const snapshot = (
    overrides: Record<number, BarState>,
    description: string,
    advisorMessages?: import("./types").AdvisorMessagePayload[]
  ): SortStep => {
    const barStates: BarState[] = new Array(n).fill("default");
    // Mark already-sorted tail
    for (let k = n - 1; k >= sortedFrom; k--) {
      barStates[k] = "sorted";
    }
    // Apply per-step overrides
    for (const [idx, state] of Object.entries(overrides)) {
      barStates[Number(idx)] = state;
    }
    return { array: [...arr], barStates, description, advisorMessages };
  };

  let sortedFrom = n; // index from which everything to the right is sorted

  for (let i = 0; i < n - 1; i++) {
    if (cancelToken.cancelled) return steps;
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      // Step 1 — highlight the two bars being compared
      steps.push(
        snapshot(
          { [j]: "comparing", [j + 1]: "comparing" },
          `Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`,
          [{ type: "compare", text: `Comparing adjacent elements ${arr[j]} and ${arr[j + 1]}.` }]
        ),
      );

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        // Step 2 — show the swap result
        steps.push(
          snapshot(
            { [j]: "swapped", [j + 1]: "swapped" },
            `Swapped ${arr[j + 1]} ↔ ${arr[j]}`,
            [{ type: "swap", text: `${arr[j + 1]} was greater than ${arr[j]}, so they were swapped.` }]
          ),
        );
      } else {
        steps.push(
          snapshot(
            { [j]: "comparing", [j + 1]: "comparing" },
            `No swap needed for ${arr[j]} and ${arr[j + 1]}`,
            [{ type: "info", text: `No swap needed because ${arr[j]} is already less than or equal to ${arr[j + 1]}.` }]
          ),
        );
      }
    }

    // The last element of this pass is now in its final position
    sortedFrom = n - 1 - i;
    steps.push(
      snapshot(
        { [sortedFrom]: "sorted" },
        `Element ${arr[sortedFrom]} is now in its sorted position`,
        [{ type: "milestone", text: `The largest remaining element (${arr[sortedFrom]}) has bubbled up to its final sorted position at the end of the array.` }]
      ),
    );

    // Early exit optimisation
    if (!swapped) {
      // Mark all remaining bars as sorted
      const finalStates: Record<number, BarState> = {};
      for (let k = 0; k < sortedFrom; k++) {
        finalStates[k] = "sorted";
      }
      steps.push(snapshot(finalStates, "No swaps needed — array is sorted!"));
      break;
    }
  }

  // Final step — everything sorted
  const allSorted: Record<number, BarState> = {};
  for (let k = 0; k < n; k++) allSorted[k] = "sorted";
  steps.push(snapshot(allSorted, "✓ Sorting complete!"));

  return steps;
}
