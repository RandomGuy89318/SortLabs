# SortLabs

SortLabs is an interactive, multi-section web platform designed to help you visualize, learn, and benchmark sorting algorithms. Built with React, TypeScript, and Vite, it offers an advanced educational experience far beyond simple animations.

## Features

### 🧠 Learn Section
Watch sorting algorithms in real-time step-by-step. The built-in **Advisor System** analyzes the active algorithm and dynamically explains comparisons, swaps, and overall behavior in a chat-like interface. You can easily toggle between "Learning Mode" (detailed explanations) and "Simple Mode" (milestone highlights only) to control the flow of information.

### 📊 Compare Section
Pit up to four algorithms against each other at the same time! SortLabs will generate an identical data set across multiple visualizers and concurrently execute them. Watch the real-time **Metrics Panels** to track live comparisons and array writes/swaps, and learn exactly why an $O(n \log n)$ algorithm crushes an $O(n^2)$ algorithm.

### 💻 Code Viewer
Dive into the underlying implementation. The Code Viewer presents the precise TypeScript logic and language-agnostic pseudocode used to build SortLabs. You can also view comprehensive **Time & Space Complexity** profiles and ask the Advisor to break down the algorithm line-by-line.

## Supported Algorithms

1. **Bubble Sort** — $O(n^2)$
2. **Selection Sort** — $O(n^2)$
3. **Insertion Sort** — $O(n^2)$
4. **Merge Sort** — $O(n \log n)$
5. **Quick Sort** — $O(n \log n)$
6. **Heap Sort** — $O(n \log n)$
7. **Counting Sort** — $O(n+k)$ *(Non-Comparison)*
8. **Radix Sort** — $O(nk)$ *(Non-Comparison)*

## Tech Stack

- **React** (Component Architecture)
- **TypeScript** (Strict Type Checking)
- **Tailwind CSS** (Utility-first "Developer OS" Neon Aesthetic)
- **Vite** (Build Tool & Dev Server)
- **Zustand** (State Management for the Advisor Engine)

## Running Locally

To run the project on your local machine:

```bash
# Clone the repository
git clone https://github.com/RandomGuy89318/SortLabs.git
cd SortLabs

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Visit `http://localhost:5173` (or the port specified by Vite) to view the app!

## License
Distributed under the MIT License. See `LICENSE` for more information.
