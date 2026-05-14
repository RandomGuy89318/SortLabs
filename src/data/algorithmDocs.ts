export type AlgorithmDoc = {
  id: string;
  name: string;
  pseudocode: string[];
  explanation: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  stable: boolean;
  inPlace: boolean;
  code: string;
};

export const ALGORITHM_DOCS: Record<string, AlgorithmDoc> = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    pseudocode: [
      "for i = 0 to array.length - 1",
      "  swapped = false",
      "  for j = 0 to array.length - 1 - i",
      "    if array[j] > array[j+1]",
      "      swap(array[j], array[j+1])",
      "      swapped = true",
      "  if not swapped",
      "    break"
    ],
    explanation: "Bubble Sort repeatedly compares adjacent elements and swaps them whenever they are out of order. After each pass, the largest unsorted element moves to the end of the array, similar to a bubble rising to the surface. It is simple but inefficient for large datasets.",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)"
    },
    stable: true,
    inPlace: true,
    code: `export function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // Early exit if the array is already sorted
    if (!swapped) break;
  }
  return arr;
}`
  },
  selection: {
    id: "selection",
    name: "Selection Sort",
    pseudocode: [
      "for i = 0 to array.length - 1",
      "  minIndex = i",
      "  for j = i + 1 to array.length",
      "    if array[j] < array[minIndex]",
      "      minIndex = j",
      "  if minIndex != i",
      "    swap(array[i], array[minIndex])"
    ],
    explanation: "Selection Sort works by repeatedly finding the minimum element from the unsorted portion of the array and placing it at the beginning. It maintains two subarrays: the sorted part and the unsorted part.",
    complexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)"
    },
    stable: false,
    inPlace: true,
    code: `export function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`
  },
  insertion: {
    id: "insertion",
    name: "Insertion Sort",
    pseudocode: [
      "for i = 1 to array.length",
      "  current = array[i]",
      "  j = i",
      "  while j > 0 and array[j - 1] > current",
      "    array[j] = array[j - 1]",
      "    j--",
      "  array[j] = current"
    ],
    explanation: "Insertion Sort builds the final sorted array one element at a time. It iterates through the input elements, taking one at a time and inserting it into its correct position within the previously sorted portion.",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)"
    },
    stable: true,
    inPlace: true,
    code: `export function insertionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const current = arr[i];
    let j = i;
    
    while (j > 0 && arr[j - 1] > current) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = current;
  }
  return arr;
}`
  },
  merge: {
    id: "merge",
    name: "Merge Sort",
    pseudocode: [
      "function mergeSort(array):",
      "  if array.length <= 1 return array",
      "  mid = array.length / 2",
      "  left = mergeSort(array[0 to mid])",
      "  right = mergeSort(array[mid to end])",
      "  return merge(left, right)"
    ],
    explanation: "Merge Sort uses a divide-and-conquer strategy. It recursively splits the array into smaller halves until each subarray contains a single element, then merges those subarrays back together in sorted order.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)"
    },
    stable: true,
    inPlace: false,
    code: `export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  let result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    pseudocode: [
      "function quickSort(array, low, high):",
      "  if low < high",
      "    pivotIndex = partition(array, low, high)",
      "    quickSort(array, low, pivotIndex - 1)",
      "    quickSort(array, pivotIndex + 1, high)"
    ],
    explanation: "Quick Sort selects a 'pivot' element, partitions the remaining values into elements smaller and larger than the pivot, and recursively sorts the partitions. It has excellent cache performance.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)"
    },
    stable: false,
    inPlace: true,
    code: `export function quickSort(
  arr: number[],
  low = 0,
  high = arr.length - 1
): number[] {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  },
  heap: {
    id: "heap",
    name: "Heap Sort",
    pseudocode: [
      "function heapSort(array):",
      "  buildMaxHeap(array)",
      "  for i = array.length - 1 down to 1",
      "    swap(array[0], array[i])",
      "    heapify(array, 0, i)"
    ],
    explanation: "Heap Sort works by visualizing the array as a binary tree and building a max-heap data structure from it. The largest element (root) is then swapped with the last element of the unsorted section.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1)"
    },
    stable: false,
    inPlace: true,
    code: `export function heapSort(arr: number[]): number[] {
  const n = arr.length;
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr: number[], n: number, i: number) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`
  },
  counting: {
    id: "counting",
    name: "Counting Sort",
    pseudocode: [
      "function countingSort(array, max):",
      "  count = array of zeros with length max + 1",
      "  for each item in array:",
      "    count[item] += 1",
      "  for i = 1 to max:",
      "    count[i] += count[i - 1]",
      "  output = array of zeros with length array.length",
      "  for each item in array reversed:",
      "    output[count[item] - 1] = item",
      "    count[item] -= 1",
      "  return output"
    ],
    explanation: "Counting Sort is an integer sorting algorithm that operates by counting the number of objects that possess distinct key values. It calculates the prefix sums of the counts to determine the positions of each key value in the output sequence. It is incredibly fast but only suitable for collections where the variation in keys is not significantly greater than the number of items.",
    complexity: {
      best: "O(n + k)",
      average: "O(n + k)",
      worst: "O(n + k)",
      space: "O(n + k)"
    },
    stable: true,
    inPlace: false,
    code: `export function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return arr;
  
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  const output = new Array(arr.length);
  
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
  
  return arr;
}`
  },
  radix: {
    id: "radix",
    name: "Radix Sort",
    pseudocode: [
      "function radixSort(array):",
      "  max = getMaximumValue(array)",
      "  for exp = 1 to max/exp > 0; exp *= 10:",
      "    countingSortByDigit(array, exp)"
    ],
    explanation: "Radix Sort is a non-comparative sorting algorithm that groups keys by the individual digits which share the same significant position and value. It processes each digit using a stable sub-sort (typically Counting Sort), starting from the least significant digit (LSD) up to the most significant.",
    complexity: {
      best: "O(nk)",
      average: "O(nk)",
      worst: "O(nk)",
      space: "O(n + k)"
    },
    stable: true,
    inPlace: false,
    code: `export function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return arr;
  
  const max = Math.max(...arr);
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  
  return arr;
}

function countingSortByDigit(arr: number[], exp: number) {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);
  
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`
  }
};
