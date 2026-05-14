export function getAlgorithmExplanation(algorithm: string): string {
  switch (algorithm.toLowerCase()) {
    case "bubble":
      return "Bubble Sort repeatedly compares adjacent elements and swaps them whenever they are out of order. After each pass, the largest unsorted element moves to the end of the array, similar to a bubble rising to the surface. It has a time complexity of O(n²) in average and worst cases, O(n) in the best case when optimized, and uses O(1) extra space. Bubble Sort is stable and easy to understand, but it is inefficient for large datasets. It is best used for educational purposes and very small arrays.";
    case "selection":
      return "Selection Sort works by repeatedly finding the minimum element from the unsorted portion of the array and placing it at the beginning. It maintains two subarrays: the sorted part and the unsorted part. It has a time complexity of O(n²) in all cases, making it inefficient on large lists, and uses O(1) extra space. Selection Sort is not stable by default. Its primary advantage is that it never makes more than O(n) swaps, which can be useful when memory write operations are costly.";
    case "insertion":
      return "Insertion Sort builds the final sorted array one element at a time. It iterates through the input elements, taking one at a time and inserting it into its correct position within the previously sorted portion. It has a time complexity of O(n²) in average and worst cases, but an excellent O(n) in the best case (when the array is already mostly sorted). It uses O(1) extra space and is a stable sort. It is highly efficient for small datasets and for arrays that are almost sorted.";
    case "merge":
      return "Merge Sort uses a divide-and-conquer strategy. It recursively splits the array into smaller halves until each subarray contains a single element, then merges those subarrays back together in sorted order. It guarantees O(n log n) time complexity, uses O(n) extra space, and is stable. Merge Sort is highly efficient and predictable, making it suitable for large datasets and linked lists, though it requires additional memory.";
    case "quick":
      return "Quick Sort selects a 'pivot' element, partitions the remaining values into elements smaller and larger than the pivot, and recursively sorts the partitions. It has O(n log n) average time complexity but O(n²) in the worst case if poor pivots are chosen. It uses O(log n) stack space on average and is not stable. Quick Sort is often one of the fastest practical sorting algorithms due to excellent cache performance and in-place partitioning.";
    case "heap":
      return "Heap Sort works by visualizing the array as a binary tree and building a max-heap data structure from it. The largest element (the root) is then swapped with the last element of the unsorted section, and the heap property is restored. It guarantees O(n log n) time complexity in all cases and uses O(1) extra space. However, it is not a stable sort and is generally slower in practice than Quick Sort due to poor cache locality.";
    default:
      return "I'm not sure about that algorithm. Try selecting one from the dropdown to see its explanation!";
  }
}
