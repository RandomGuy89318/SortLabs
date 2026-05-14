export type ArrayPattern =
  | "random"
  | "nearly-sorted"
  | "reverse-sorted"
  | "few-unique";

export function generateArray(size: number, pattern: ArrayPattern): number[] {
  const arr = new Array(size);
  if (pattern === "random") {
    for (let i = 0; i < size; i++) arr[i] = Math.floor(Math.random() * 95) + 5;
  } else if (pattern === "nearly-sorted") {
    for (let i = 0; i < size; i++) arr[i] = Math.floor((i / size) * 95) + 5;
    const swaps = Math.max(1, Math.floor(size * 0.1));
    for (let i = 0; i < swaps; i++) {
      const idx1 = Math.floor(Math.random() * size);
      const idx2 = Math.floor(Math.random() * size);
      [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    }
  } else if (pattern === "reverse-sorted") {
    for (let i = 0; i < size; i++) arr[i] = Math.floor(((size - 1 - i) / size) * 95) + 5;
  } else if (pattern === "few-unique") {
    const uniques = [15, 35, 55, 75, 95];
    for (let i = 0; i < size; i++) {
      arr[i] = uniques[Math.floor(Math.random() * uniques.length)];
    }
  }
  return arr;
}
