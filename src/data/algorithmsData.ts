import {
  ComplexityInfo,
  RealWorldExample,
  LeetCodeBenchmark,
  QuizQuestion,
} from './dataStructuresData';
import { CLASSICAL_ALGORITHMS_DATA } from './classicalAlgorithmsData';

export type AlgorithmCategory =
  | 'Search & Prune'
  | 'Pointers & Window'
  | 'Graph & Tree'
  | 'Optimization'
  | 'Bitwise'
  | 'Classical Sorting'
  | 'Divide & Conquer'
  | 'Linear-Time Sort'
  | 'Shortest Path & MST'
  | 'String Algorithms';

export type AlgorithmTier = 'interview-core' | 'college-classical';

export interface AcademicBridgeInfo {
  whyCollegeTaughtIt: string;
  whyRareInInterviewsRaw: string;
  interviewDisguise: string;
  realWorldSystemUse: string;
}

export interface AlgorithmDetail {
  id: string;
  name: string;
  shortName: string;
  category: AlgorithmCategory;
  tier?: AlgorithmTier;
  academicBridge?: AcademicBridgeInfo;
  tagline: string;
  description: string;
  primaryDataStructures: string[];
  memoryModel: {
    layout: string;
    cacheLocality: string;
    pointerOverhead: string;
    explanation: string;
  };
  complexity: ComplexityInfo[];
  realWorldApplications: RealWorldExample[];
  leetcodeBenchmarks: LeetCodeBenchmark[];
  scratchImplementation: {
    language: string;
    code: string;
    keyTakeaway: string;
  };
  youtubeQuery: string;
  quiz: QuizQuestion[];
}

const CORE_INTERVIEW_ALGORITHMS_DATA: AlgorithmDetail[] = [
  {
    id: 'binary-search',
    name: 'Binary Search & Divide and Conquer',
    shortName: 'Binary Search',
    category: 'Search & Prune',
    tagline: 'Halves search space in O(log N) by inspecting midpoint monotonic invariants.',
    description:
      'Binary Search works on monotonic (sorted or stepped) search spaces. By comparing the target with the middle element, it eliminates half of all remaining candidates in constant time. Beyond simple array lookups, advanced interview problems use "Binary Search on the Answer" (e.g., finding the minimum capacity or speed required to satisfy a condition within a bounded range).',
    primaryDataStructures: ['Arrays', 'Monotonic Functions'],
    memoryModel: {
      layout: 'Operates over contiguous arrays or mathematical integer ranges [low, high].',
      cacheLocality: 'Moderate (each step jumps by half the remaining interval).',
      pointerOverhead: 'None (primitive integer bounds: low, mid, high).',
      explanation:
        'Iterative Binary Search uses strictly O(1) auxiliary space with two integer registers. Recursive variants consume O(log N) stack frames.',
    },
    complexity: [
      { operation: 'Search in Sorted Array', average: 'O(log N)', worst: 'O(log N)', notes: 'Halves remaining search space every iteration.' },
      { operation: 'Binary Search on the Answer', average: 'O(log(Range) * CheckCost)', worst: 'O(log(Max - Min) * N)', notes: 'Determines feasibility in monotonic search space.' },
      { operation: 'Space Complexity (Iterative)', average: 'O(1)', worst: 'O(1)', notes: 'Only tracks low, high, and mid pointers.' },
      { operation: 'Space Complexity (Recursive)', average: 'O(log N)', worst: 'O(log N)', notes: 'Call stack depth equals tree height.' },
    ],
    realWorldApplications: [
      {
        title: 'Git Bisect (Debugging Regression)',
        domain: 'Developer Tools',
        description: 'Git uses binary search across the commit history to isolate the exact commit that introduced a regression bug in O(log N) builds.',
      },
      {
        title: 'B-Tree Node Page Search in Databases',
        domain: 'Databases (PostgreSQL, MySQL)',
        description: 'Database engines binary search slotted array records inside 8KB/16KB disk pages in RAM before following child page pointers.',
      },
      {
        title: 'Network Subnet Range Lookups',
        domain: 'Computer Networks',
        description: 'Routers locate IP routing table prefix boundaries using binary search over sorted integer CIDR blocks.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'binary-search-std',
        title: 'Binary Search (#704)',
        difficulty: 'Easy',
        pattern: 'Monotonic Array Elimination',
        whyThisStructure: 'Direct midpoint comparison eliminates left or right half in O(log N).',
      },
      {
        id: 'search-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array (#33)',
        difficulty: 'Medium',
        pattern: 'Partitioned Monotonic Invariant',
        whyThisStructure: 'At least one half [low, mid] or [mid, high] is always normally sorted; verify if target falls in that sorted half.',
      },
      {
        id: 'koko-eating-bananas',
        title: 'Koko Eating Bananas (#875)',
        difficulty: 'Medium',
        pattern: 'Binary Search on Answer Space',
        whyThisStructure: 'Feasibility function is monotonic: if eating speed k works, all speeds > k also work. Search the speed space [1, max(piles)].',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `function binarySearch(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    // Avoid (low + high) / 2 integer overflow
    const mid = low + Math.floor((high - low) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      low = mid + 1; // Discard left half
    } else {
      high = mid - 1; // Discard right half
    }
  }

  return -1; // Target not found
}`,
      keyTakeaway:
        'Always compute mid as low + ((high - low) >> 1) to prevent 32-bit signed integer overflow, and use low <= high for inclusive intervals.',
    },
    youtubeQuery: 'binary search pattern explained visually leetcode',
    quiz: [
      {
        id: 'q1-bs',
        question: 'Why is `mid = (low + high) / 2` considered an interview bug in languages like Java or C++?',
        options: [
          'It fails when low is greater than high.',
          'If low + high exceeds 2^31 - 1, it overflows into a negative number, causing an ArrayIndexOutOfBoundsException.',
          'The division operator is deprecated in C++20.',
          'It causes floating-point rounding errors on integers.',
        ],
        correctIndex: 1,
        explanation:
          'When low and high are large (e.g. 1.5 billion each), their sum exceeds 2^31 - 1 and wraps to a negative number in 32-bit signed integers. Writing `low + (high - low) / 2` guarantees no overflow.',
      },
      {
        id: 'q2-bs',
        question: 'When can "Binary Search on the Answer" be used instead of searching through an input array?',
        options: [
          'Whenever the input array is unsorted.',
          'Whenever the answer belongs to a bounded range [min, max] and the validation condition is monotonic (if valid for X, valid for all X > k).',
          'Only when the problem specifically asks for median.',
          'Only on graph adjacency matrices.',
        ],
        correctIndex: 1,
        explanation:
          'Binary search on answer applies whenever you can define a boolean function `isValid(k)` that transitions monotonically from false to true (or true to false) across the candidate value range.',
      },
    ],
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers & Fast/Slow (Floyd’s)',
    shortName: 'Two Pointers',
    category: 'Pointers & Window',
    tagline: 'Linear convergence or cycle tracking using synchronized directional pointers.',
    description:
      'The Two Pointers pattern coordinates two indices across a sequence. It manifests in three primary variations: Opposite-Direction (converging from left and right inward on sorted data), Same-Direction (reader and writer pointers for in-place array compaction), and Fast/Slow Pointers (Floyd’s Tortoise & Hare for cycle detection and middle-node retrieval).',
    primaryDataStructures: ['Arrays', 'Strings', 'Linked Lists'],
    memoryModel: {
      layout: 'Operates in-place on sequential RAM or heap-linked node pointers.',
      cacheLocality: 'High on arrays; sequential step accesses.',
      pointerOverhead: 'Two integer indices or two node references.',
      explanation:
        'Consumes strictly O(1) auxiliary space because operations reorder or inspect existing memory without allocating additional arrays.',
    },
    complexity: [
      { operation: 'Converging Two Pointers Pass', average: 'O(N)', worst: 'O(N)', notes: 'Each step moves at least one pointer; total steps bounded by N.' },
      { operation: 'Fast & Slow Cycle Detection', average: 'O(N)', worst: 'O(N)', notes: 'Catches cycle in at most C steps once both enter loop.' },
      { operation: 'Auxiliary Space Complexity', average: 'O(1)', worst: 'O(1)', notes: 'In-place state inspection.' },
    ],
    realWorldApplications: [
      {
        title: 'Memory Compaction & In-Place Garbage Collection',
        domain: 'Runtimes (V8, JVM)',
        description: 'Compaction sweeps use read and write pointers to move live heap objects to the front of memory blocks, eliminating fragmentation.',
      },
      {
        title: 'TCP Sliding Window Flow Control',
        domain: 'Computer Networking',
        description: 'Sender and receiver window sequence numbers advance like two pointers to acknowledge bytes received without buffering entire streams.',
      },
      {
        title: 'Audio Equalizer Waveform Processing',
        domain: 'DSP & Audio Engineering',
        description: 'Symmetric audio filters and peak detectors use opposite-direction scans to balance phase shifts.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'two-sum-ii',
        title: 'Two Sum II - Input Array Is Sorted (#167)',
        difficulty: 'Medium',
        pattern: 'Converging Pointers',
        whyThisStructure: 'If sum < target, advance left pointer to increase; if sum > target, decrement right pointer to decrease in O(N) time and O(1) space.',
      },
      {
        id: '3sum',
        title: '3Sum (#15)',
        difficulty: 'Medium',
        pattern: 'Sorting + Two Pointers Sweep',
        whyThisStructure: 'Fixing the first element reduces the problem to Two Sum II, solvable in O(N) per fixed element for O(N^2) total.',
      },
      {
        id: 'linked-list-cycle-ii',
        title: 'Linked List Cycle II (#142)',
        difficulty: 'Medium',
        pattern: "Floyd's Tortoise and Hare Intersection",
        whyThisStructure: 'Mathematical proof shows that moving one pointer to head and advancing both by 1 meets precisely at the cycle entrance.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (sum < target) {
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }

  return [];
}`,
      keyTakeaway:
        'In sorted arrays, monotonic sum behavior guarantees that moving the left pointer only increases sum and moving the right pointer only decreases sum.',
    },
    youtubeQuery: 'two pointers pattern explained visually leetcode',
    quiz: [
      {
        id: 'q1-tp',
        question: 'Why can Two Pointers solve Two Sum II in O(N) time on sorted arrays, whereas an unsorted array requires O(N) space via Hash Map?',
        options: [
          'Sorted arrays consume less RAM than unsorted arrays.',
          'Sorting establishes a monotonic sum property: incrementing left strictly increases sum, and decrementing right strictly decreases sum, eliminating the need to record history.',
          'Because Two Pointers uses multi-threading under the hood.',
          'Unsorted arrays cannot be indexed in O(1).',
        ],
        correctIndex: 1,
        explanation:
          'Because the array is sorted, every pointer movement makes a deterministic decision. If sum < target, no smaller right element could ever work with the current left, safely pruning candidates without extra memory.',
      },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window (Fixed & Dynamic)',
    shortName: 'Sliding Window',
    category: 'Pointers & Window',
    tagline: 'Transforms O(N^2) continuous subarray scans into linear O(N) rolling state updates.',
    description:
      'The Sliding Window pattern evaluates contiguous subarrays or substrings by expanding a right boundary to include new elements and contracting a left boundary to evict stale elements. Fixed-size windows maintain a constant width K, while Dynamic-size windows expand until an invariant is broken (e.g. at most K distinct characters), then contract until validity is restored.',
    primaryDataStructures: ['Arrays', 'Strings', 'Hash Maps', 'Deques'],
    memoryModel: {
      layout: 'Subarray bounded by left and right indices over contiguous arrays or strings.',
      cacheLocality: 'High (sequential sequential scans).',
      pointerOverhead: 'Two integer indices plus window state counter/map.',
      explanation:
        'Total amortized work is strictly bounded by 2N steps: both left and right pointers increment at most N times over the entire execution.',
    },
    complexity: [
      { operation: 'Fixed Window Pass', average: 'O(N)', worst: 'O(N)', notes: 'Single pass updating rolling sum/hash.' },
      { operation: 'Dynamic Window Pass', average: 'O(N) amortized', worst: 'O(N)', notes: 'Left and right pointers each advance at most N times.' },
      { operation: 'Auxiliary Space', average: 'O(K) or O(1)', worst: 'O(Alphabet)', notes: 'Stores frequency counter of elements in current window.' },
    ],
    realWorldApplications: [
      {
        title: 'API Rate Limiting (Rolling Window Counter)',
        domain: 'Backend & Cloud Infrastructure',
        description: 'APIs count incoming requests in a 60-second sliding window, evicting expired timestamps to prevent traffic bursts.',
      },
      {
        title: 'Video Streaming Dynamic Bitrate (ABR)',
        domain: 'Media & Streaming (Netflix, YouTube)',
        description: 'Calculates rolling average download throughput over the last 5 chunks to adjust streaming resolution in real time.',
      },
      {
        title: 'Financial Moving Averages (SMA / EMA)',
        domain: 'Quantitative Finance & Trading',
        description: 'Calculates rolling 50-day and 200-day moving averages of stock prices in O(1) per tick by subtracting outgoing and adding incoming prices.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'longest-substring-without-repeating-sw',
        title: 'Longest Substring Without Repeating Characters (#3)',
        difficulty: 'Medium',
        pattern: 'Dynamic Expand & Contract',
        whyThisStructure: 'Expand right pointer; if duplicate seen, contract left pointer until duplicate is evicted; record max window length.',
      },
      {
        id: 'minimum-size-subarray-sum',
        title: 'Minimum Size Subarray Sum (#209)',
        difficulty: 'Medium',
        pattern: 'Monotonic Positive Sum Window',
        whyThisStructure: 'Add nums[right] to running sum; while sum >= target, record min length and subtract nums[left++] to find optimal minimal window.',
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring (#76)',
        difficulty: 'Hard',
        pattern: 'Frequency Map + Match Counter',
        whyThisStructure: 'Tracks satisfied character frequency matches; contracts left pointer to find the tightest substring containing all target characters in O(N).',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `function lengthOfLongestSubstring(s: string): number {
  const charMap = new Map<string, number>(); // Character -> Last seen index
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charMap.has(char) && charMap.get(char)! >= left) {
      // Jump left pointer past previous occurrence
      left = charMap.get(char)! + 1;
    }
    charMap.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
      keyTakeaway:
        'Instead of moving the left pointer step-by-step, store the last-seen index in a map to immediately jump the left pointer forward in O(1).',
    },
    youtubeQuery: 'sliding window algorithm pattern visual explanation leetcode',
    quiz: [
      {
        id: 'q1-sw',
        question: 'Why is a nested while loop inside a sliding window for-loop still strictly O(N) total time complexity?',
        options: [
          'Because the CPU optimizes while loops.',
          'The left pointer only moves forward and can increment at most N times over the entire execution of the program.',
          'Because window size is limited to 26 characters.',
          'Because the inner loop runs in parallel threads.',
        ],
        correctIndex: 1,
        explanation:
          'This is classic amortized analysis: the right pointer increments N times, and the left pointer increments at most N times. Total operations are N + N = 2N, which is strictly O(N).',
      },
    ],
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    shortName: 'BFS',
    category: 'Graph & Tree',
    tagline: 'Level-by-level layer traversal; guarantees the shortest path on unweighted graphs.',
    description:
      'Breadth-First Search traverses graphs or trees level by level using a FIFO Queue. Starting from root or source nodes, it explores all direct neighbors at distance d before moving to any neighbor at distance d+1. On unweighted graphs, the first time BFS reaches a target vertex, it is mathematically guaranteed to be the shortest path.',
    primaryDataStructures: ['Queues', 'Visited Sets', 'Adjacency Lists'],
    memoryModel: {
      layout: 'FIFO Queue storing vertex references or coordinates + Visited Hash Set or boolean array.',
      cacheLocality: 'Moderate.',
      pointerOverhead: 'Proportional to maximum width of the graph (up to V/2 in balanced trees).',
      explanation:
        'Space complexity is bounded by maximum queue width O(W), which can be O(V) in dense graphs or wide branching trees.',
    },
    complexity: [
      { operation: 'Graph BFS Traversal', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Visits every vertex once and checks every edge link.' },
      { operation: 'Grid BFS (R x C)', average: 'O(R * C)', worst: 'O(R * C)', notes: 'Each cell added to queue at most once.' },
      { operation: 'Space Complexity', average: 'O(V)', worst: 'O(V)', notes: 'Queue stores maximum boundary width + visited array.' },
    ],
    realWorldApplications: [
      {
        title: 'Social Network 6 Degrees of Separation',
        domain: 'Social Platforms (LinkedIn, Facebook)',
        description: 'BFS finds 1st, 2nd, and 3rd-degree connection paths between users by radiating outward level by level.',
      },
      {
        title: 'Network Packet Broadcast Routing',
        domain: 'Computer Networking',
        description: 'Flooding protocols propagate routing packets to all neighboring network switches in guaranteed minimum hop counts.',
      },
      {
        title: 'Garbage Collection Tracing (Cheney’s Algorithm)',
        domain: 'Runtimes & Memory Management',
        description: 'Two-space copying garbage collectors use BFS queues to traverse and evacuate reachable heap objects from root sets.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'binary-tree-level-order-bfs',
        title: 'Binary Tree Level Order Traversal (#102)',
        difficulty: 'Medium',
        pattern: 'Level-Sized BFS Queue',
        whyThisStructure: 'Freezing `levelSize = q.length` processes all nodes at depth d together in a single sub-array before depth d+1 begins.',
      },
      {
        id: 'word-ladder',
        title: 'Word Ladder (#127)',
        difficulty: 'Hard',
        pattern: 'Shortest Transformation Sequence',
        whyThisStructure: 'Unweighted transitions of 1 letter difference mean BFS finds the shortest transformation length in minimum hops.',
      },
      {
        id: '01-matrix',
        title: '01 Matrix (#542)',
        difficulty: 'Medium',
        pattern: 'Multi-Source BFS',
        whyThisStructure: 'Enqueue all 0s simultaneously at distance 0; radiate outward to populate minimum distances to 1s in a single O(R*C) pass.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Multi-Source BFS on Grid
function updateMatrix(mat: number[][]): number[][] {
  const rows = mat.length;
  const cols = mat[0].length;
  const dist = Array.from({ length: rows }, () => new Array(cols).fill(-1));
  const queue: [number, number][] = [];

  // Enqueue all source 0s
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (mat[r][c] === 0) {
        dist[r][c] = 0;
        queue.push([r, c]);
      }
    }
  }

  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let head = 0; // O(1) dequeue pointer

  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return dist;
}`,
      keyTakeaway:
        'Always mark nodes as visited immediately upon ENQUEUEING (not upon dequeueing) to prevent duplicate neighbor additions that explode memory.',
    },
    youtubeQuery: 'breadth first search bfs shortest path visual leetcode',
    quiz: [
      {
        id: 'q1-bfs',
        question: 'Why does BFS guarantee the shortest path on an unweighted graph, but fails on weighted graphs?',
        options: [
          'BFS cannot handle negative numbers.',
          'BFS explores edges in strictly increasing order of edge count (hops); the first time a node is reached, no shorter hop count exists. Weighted graphs require minimizing sum of weights, not hop counts (requires Dijkstra).',
          'Queues can only store integers.',
          'BFS automatically sorts weights.',
        ],
        correctIndex: 1,
        explanation:
          'BFS treats every edge as cost 1. Because it visits all nodes at distance d before distance d+1, the first time target is popped is guaranteed minimum hops. If edges have varying weights, a path with 2 heavy hops could be slower than 5 light hops.',
      },
    ],
  },
  {
    id: 'dfs-backtracking',
    name: 'Depth-First Search (DFS) & Backtracking',
    shortName: 'DFS & Backtracking',
    category: 'Graph & Tree',
    tagline: 'Exhaustive exploration along branches; undoes state changes to explore combinatorial search spaces.',
    description:
      'Depth-First Search traverses deeply down a path until reaching a dead end or base case, then backtracks to explore alternative branches. It is the engine of Tree traversals (Pre-order, In-order, Post-order), Connected Component flood fills, and Combinatorial Backtracking (Subsets, Permutations, N-Queens). Backtracking follows a strict 3-step discipline: Choose, Explore (recurse), and Un-choose (undo state mutation).',
    primaryDataStructures: ['Call Stack', 'Recursion', 'Visited Arrays'],
    memoryModel: {
      layout: 'Implicit Call Stack frames allocated on thread stack or explicit stack array.',
      cacheLocality: 'High on execution frame reuse; moderate on object graph.',
      pointerOverhead: 'Stack frame overhead proportional to recursion depth H.',
      explanation:
        'Memory consumption is bounded by maximum tree height or recursion depth H. For balanced trees O(log N); for exhaustive permutations O(N).',
    },
    complexity: [
      { operation: 'Tree / Graph DFS', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Visits every reachable node and edge once.' },
      { operation: 'Subsets Backtracking', average: 'O(2^N)', worst: 'O(2^N)', notes: 'Each element has 2 choices: include or exclude.' },
      { operation: 'Permutations Backtracking', average: 'O(N!)', worst: 'O(N!)', notes: 'Explores all N! possible orderings.' },
      { operation: 'Space Complexity', average: 'O(H)', worst: 'O(V)', notes: 'Call stack depth bounded by longest path.' },
    ],
    realWorldApplications: [
      {
        title: 'Circuit Board Autorouting & Maze Solvers',
        domain: 'EDA & Robotics',
        description: 'Explores wiring paths between pins, backtracking when traces collide with existing copper runs.',
      },
      {
        title: 'Sudoku & Constraint Satisfaction Solvers',
        domain: 'Artificial Intelligence',
        description: 'Tries numbers 1-9 in empty cells; backtracks immediately when a row/column/box rule is violated.',
      },
      {
        title: 'Compiler AST Semantic Analysis',
        domain: 'Compilers (TypeScript, Clang)',
        description: 'Post-order DFS walks syntax trees from leaf expressions up to parent statements to verify type safety.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'number-of-islands-dfs',
        title: 'Number of Islands (#200)',
        difficulty: 'Medium',
        pattern: 'Flood Fill DFS',
        whyThisStructure: 'When a land cell "1" is encountered, DFS sinks the entire connected island by mutating neighbors to "0" in O(R*C).',
      },
      {
        id: 'subsets',
        title: 'Subsets (#78)',
        difficulty: 'Medium',
        pattern: 'Combinatorial Backtracking',
        whyThisStructure: 'Generates power set by branching on including vs excluding each element; copies current candidate list at each node.',
      },
      {
        id: 'n-queens',
        title: 'N-Queens (#51)',
        difficulty: 'Hard',
        pattern: 'Constraint Backtracking with Set Pruning',
        whyThisStructure: 'Places queens row by row, pruning invalid columns and diagonals in O(1) using sets before recursing.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Classic Backtracking Template: Subsets
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const current: number[] = [];

  function backtrack(startIndex: number) {
    // 1. Record valid state
    result.push([...current]); // Snapshot copy

    // 2. Iterate through candidate choices
    for (let i = startIndex; i < nums.length; i++) {
      current.push(nums[i]);     // CHOOSE
      backtrack(i + 1);          // EXPLORE
      current.pop();             // UN-CHOOSE (Backtrack state mutation)
    }
  }

  backtrack(0);
  return result;
}`,
      keyTakeaway:
        'Always push a COPY of the state into your results (e.g. `[...current]`), because `current` is mutated in-place during subsequent backtracking steps.',
    },
    youtubeQuery: 'backtracking algorithm template visual explanation leetcode',
    quiz: [
      {
        id: 'q1-dfs',
        question: 'What is the classic beginner bug when pushing candidate arrays into result lists in backtracking (e.g., `result.push(current)`)?',
        options: [
          'The call stack throws an overflow error.',
          '`current` is passed by reference; as backtracking pops elements, every element in `result` mutates to an empty array `[]`.',
          'JavaScript arrays reject duplicate numbers.',
          'Backtracking stops early.',
        ],
        correctIndex: 1,
        explanation:
          'Because arrays are objects passed by reference, pushing `current` directly stores a reference to the mutable working buffer. When backtracking completes, `current` is emptied, leaving your output filled with empty arrays. Always snapshot with `[...current]` or `new ArrayList<>(current)`.',
      },
    ],
  },
  {
    id: 'sorting',
    name: 'Classic Sorting (Quick, Merge, Heap, Counting)',
    shortName: 'Sorting',
    category: 'Optimization',
    tagline: 'Orders elements to establish monotonic invariants and enable Binary Search.',
    description:
      'Sorting is the cornerstone pre-processing step in algorithmic design. Sorting transforms unordered data so that identical items become adjacent (enabling duplicate detection in O(N)), interval endpoints align (enabling greedy scheduling), and monotonic search properties emerge (enabling Two Pointers and Binary Search). Modern production languages use hybrid algorithms (Timsort in Python/Java, Introsort in C++).',
    primaryDataStructures: ['Arrays', 'Heaps'],
    memoryModel: {
      layout: 'In-place array swapping (Quicksort/Heapsort) or auxiliary buffer allocation (Mergesort).',
      cacheLocality: 'High (contiguous array sweeps).',
      pointerOverhead: 'Zero for in-place sorts; O(N) auxiliary buffer for Mergesort.',
      explanation:
        'Comparison-based sorting has a mathematical lower bound of O(N log N). Non-comparison sorts (Counting Sort, Radix Sort) achieve O(N + K) on bounded integers.',
    },
    complexity: [
      { operation: 'Quicksort (In-Place)', average: 'O(N log N)', worst: 'O(N^2)', notes: 'O(N^2) if pivot is poorly chosen; mitigated by randomized pivots.' },
      { operation: 'Mergesort (Stable)', average: 'O(N log N)', worst: 'O(N log N)', notes: 'Guaranteed O(N log N) worst-case; requires O(N) extra RAM.' },
      { operation: 'Heapsort (In-Place)', average: 'O(N log N)', worst: 'O(N log N)', notes: 'O(1) auxiliary space, but poor cache locality.' },
      { operation: 'Counting Sort (Non-Comparison)', average: 'O(N + K)', worst: 'O(N + K)', notes: 'Linear time when integer range K is small.' },
    ],
    realWorldApplications: [
      {
        title: 'Database Query Planners (ORDER BY & Sort-Merge Joins)',
        domain: 'Relational Databases',
        description: 'Postgres and MySQL sort tables on join keys to perform linear O(N + M) sort-merge joins across gigabytes of records.',
      },
      {
        title: 'Search Engine Rank Scoring',
        domain: 'Information Retrieval',
        description: 'Web search results are sorted by PageRank and relevance scores to return the top 10 items in sub-millisecond response times.',
      },
      {
        title: 'Computer Graphics Depth Buffering (Painter’s Algorithm)',
        domain: '3D Graphics & Game Engines',
        description: 'Polygons are sorted by distance from the camera to render background scenes before foreground geometry.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'merge-intervals-sort',
        title: 'Merge Intervals (#56)',
        difficulty: 'Medium',
        pattern: 'Sort by Start Boundary',
        whyThisStructure: 'Sorting intervals by start time ensures that overlapping intervals are immediately adjacent, turning 2D overlap into a single linear pass.',
      },
      {
        id: 'sort-colors',
        title: 'Sort Colors (#75) / Dutch National Flag',
        difficulty: 'Medium',
        pattern: '3-Way In-Place Partitioning',
        whyThisStructure: 'Three pointers partition array into [0s, 1s, 2s] in a single pass with O(1) space.',
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements (#347)',
        difficulty: 'Medium',
        pattern: 'Bucket Sort / Counting Sort',
        whyThisStructure: 'Frequencies cannot exceed N; creating an array of buckets where index = frequency yields optimal O(N) linear time without sorting.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// QuickSort with In-Place Partitioning
function quickSort(arr: number[], low = 0, high = arr.length - 1): void {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high]; // Lomuto partition scheme
  let i = low;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`,
      keyTakeaway:
        'Sorting is often the "hidden trick": when an interview problem looks impossible in O(N^2), ask yourself if sorting in O(N log N) simplifies the invariants.',
    },
    youtubeQuery: 'quicksort mergesort visual comparison explained leetcode',
    quiz: [
      {
        id: 'q1-sort',
        question: 'Why does Counting Sort / Bucket Sort run in O(N) time, beating the O(N log N) mathematical comparison limit?',
        options: [
          'Because it uses quantum assembly instructions.',
          'It is non-comparison-based: it hashes values directly to frequency index buckets, bypassing the decision tree comparison lower bound.',
          'Because it only works on strings.',
          'It ignores duplicate values.',
        ],
        correctIndex: 1,
        explanation:
          'The O(N log N) lower bound applies strictly to comparison-based sorting (where elements are ordered via `<` or `>`). Counting sort uses direct integer array indexing, bypassing the comparison decision tree.',
      },
    ],
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming (Memoization & Tabulation)',
    shortName: 'Dynamic Programming',
    category: 'Optimization',
    tagline: 'Breaks problems into overlapping subproblems; caches optimal sub-structure to eliminate redundant computation.',
    description:
      'Dynamic Programming (DP) solves complex problems by combining solutions to overlapping subproblems. It applies when a problem exhibits Optimal Substructure (an optimal solution contains optimal solutions to its subproblems) and Overlapping Subproblems (the same subproblems are computed repeatedly). It is approached via Top-Down with Memoization (recursion + cache) or Bottom-Up Tabulation (iterative table building).',
    primaryDataStructures: ['Arrays (1D/2D)', 'Hash Maps'],
    memoryModel: {
      layout: 'Flat 1D or 2D array table storing optimal subproblem results.',
      cacheLocality: 'High on row-major 2D array iterations; excellent L1 cache reuse.',
      pointerOverhead: 'None when stored in primitive integer/boolean matrices.',
      explanation:
        'Space Optimization Trick: If state dp[i] only depends on dp[i-1] (e.g. Fibonacci, House Robber), space can be compressed from O(N) to O(1) using two variables.',
    },
    complexity: [
      { operation: 'Top-Down DP with Memo', average: 'O(Distinct Subproblems * Cost per State)', worst: 'O(States * Transitions)', notes: 'Each state solved once and cached.' },
      { operation: 'Bottom-Up Tabulation', average: 'O(N) or O(N * M)', worst: 'O(N * M)', notes: 'Fills array iteratively without recursion stack.' },
      { operation: 'Space Complexity (Full Table)', average: 'O(N * M)', worst: 'O(N * M)', notes: 'Allocates table of state dimensions.' },
      { operation: 'Space Complexity (Optimized)', average: 'O(M) or O(1)', worst: 'O(M)', notes: 'Retains only the previous row/state in memory.' },
    ],
    realWorldApplications: [
      {
        title: 'Git Diff & String Edit Distance (Levenshtein Distance)',
        domain: 'Developer Tools & Compilers',
        description: 'Computes the minimum additions, deletions, and edits needed to transform file version A to version B in O(N * M).',
      },
      {
        title: 'DNA & Genomic Sequence Alignment (Needleman-Wunsch)',
        domain: 'Bioinformatics & Computational Biology',
        description: 'Aligns nucleotide sequences (A, C, G, T) to identify evolutionary mutations and genetic diseases.',
      },
      {
        title: 'Shortest Path in Directed Graphs (Bellman-Ford / Floyd-Warshall)',
        domain: 'Network Routing & Logistics',
        description: 'Computes all-pairs shortest paths across network routers using DP recurrence d[k][i][j].',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs (#70)',
        difficulty: 'Easy',
        pattern: '1D State Recurrence',
        whyThisStructure: 'State dp[i] = dp[i-1] + dp[i-2]. Demonstrates how caching transforms an O(2^N) tree into O(N) time and O(1) space.',
      },
      {
        id: 'coin-change',
        title: 'Coin Change (#322)',
        difficulty: 'Medium',
        pattern: 'Unbounded Knapsack / Min Cost',
        whyThisStructure: 'dp[amount] = min(dp[amount - coin] + 1). Computes minimum coins needed for all values from 1 to target.',
      },
      {
        id: 'longest-common-subsequence',
        title: 'Longest Common Subsequence (#1143)',
        difficulty: 'Medium',
        pattern: '2D Grid DP',
        whyThisStructure: 'If chars match, dp[i][j] = 1 + dp[i-1][j-1]; if mismatch, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Coin Change: Bottom-Up Tabulation
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case: 0 coins needed to make amount 0

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      keyTakeaway:
        'The 5-Step DP Framework: 1. Define State Meaning -> 2. Derive Recurrence Relation -> 3. Identify Base Cases -> 4. Choose Traversal Direction -> 5. Compress Space.',
    },
    youtubeQuery: 'dynamic programming patterns visual guide leetcode',
    quiz: [
      {
        id: 'q1-dp',
        question: 'What two fundamental characteristics MUST a problem have to be solvable via Dynamic Programming?',
        options: [
          'Linear constraints and negative numbers.',
          'Optimal Substructure (optimal global solution built from optimal subproblem solutions) and Overlapping Subproblems (same subproblems computed repeatedly).',
          'It must involve binary numbers and trees.',
          'Input array must be sorted in ascending order.',
        ],
        correctIndex: 1,
        explanation:
          'Without overlapping subproblems, divide and conquer (like mergesort) is sufficient. Without optimal substructure, greedy or exhaustive search is needed. Both are mandatory for DP.',
      },
    ],
  },
  {
    id: 'greedy',
    name: 'Greedy Algorithms & Interval Scheduling',
    shortName: 'Greedy',
    category: 'Optimization',
    tagline: 'Makes locally optimal choice at each step; optimal when greedy-choice property holds.',
    description:
      'A Greedy Algorithm constructs a solution step-by-step, always choosing the option that provides the most immediate, local benefit. Greedy algorithms are faster and simpler than Dynamic Programming, but only work when the Greedy-Choice Property holds: globally optimal solutions can be assembled from locally optimal choices without backtracking or reconsidering past decisions.',
    primaryDataStructures: ['Heaps / Priority Queues', 'Sorted Arrays'],
    memoryModel: {
      layout: 'Linear sweep over sorted arrays or greedy pop from a Priority Queue.',
      cacheLocality: 'High.',
      pointerOverhead: 'Zero; tracks greedy local accumulator variables.',
      explanation:
        'Often requires O(N log N) pre-sorting or heap maintenance, followed by an O(N) single-pass greedy evaluation consuming O(1) extra space.',
    },
    complexity: [
      { operation: 'Greedy Linear Sweep (After Sort)', average: 'O(N)', worst: 'O(N)', notes: 'Single pass making irrevocable choices.' },
      { operation: 'Total Time with Pre-sorting', average: 'O(N log N)', worst: 'O(N log N)', notes: 'Dominated by the initial sort.' },
      { operation: 'Auxiliary Space Complexity', average: 'O(1)', worst: 'O(1)', notes: 'Greedy accumulators without table allocations.' },
    ],
    realWorldApplications: [
      {
        title: 'Data Compression (Huffman Coding)',
        domain: 'Information Theory & File Formats (JPEG, MP3, Gzip)',
        description: 'Greedily merges the two lowest-frequency characters using a min-heap to generate optimal prefix-free variable-length codes.',
      },
      {
        title: 'Dijkstra & Prim Minimum Spanning Trees',
        domain: 'Network Optimization & GPS Routing',
        description: 'Greedily extracts the closest unvisited vertex from a min-heap, guaranteeing optimal shortest paths on non-negative weights.',
      },
      {
        title: 'CPU Job Scheduling (Shortest Job First)',
        domain: 'Operating Systems',
        description: 'OS schedulers greedily schedule the shortest pending task to minimize average waiting time across processes.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'jump-game',
        title: 'Jump Game (#55)',
        difficulty: 'Medium',
        pattern: 'Furthest Reachable Index',
        whyThisStructure: 'Greedily maintains max reachable index `maxReach = max(maxReach, i + nums[i])`. If `i > maxReach`, cannot advance.',
      },
      {
        id: 'non-overlapping-intervals',
        title: 'Non-overlapping Intervals (#435)',
        difficulty: 'Medium',
        pattern: 'Earliest End Time Greedy Choice',
        whyThisStructure: 'Sorting by END time and greedily choosing intervals that end earliest leaves maximum room for remaining intervals.',
      },
      {
        id: 'gas-station',
        title: 'Gas Station (#134)',
        difficulty: 'Medium',
        pattern: 'Accumulator Valley Reset',
        whyThisStructure: 'If total gas >= total cost, a solution is guaranteed to exist. Greedily start right after the lowest cumulative deficit point.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Non-overlapping Intervals: Earliest End Time Greedy
function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;

  // Greedily sort by END time
  intervals.sort((a, b) => a[1] - b[1]);

  let nonOverlapCount = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) {
      // Non-overlapping interval found!
      nonOverlapCount++;
      lastEnd = intervals[i][1];
    }
  }

  return intervals.length - nonOverlapCount;
}`,
      keyTakeaway:
        'In interval scheduling, sorting by END time (not start time) is the golden rule: picking the interval that finishes earliest frees up the resource fastest.',
    },
    youtubeQuery: 'greedy algorithms interval scheduling visual proof leetcode',
    quiz: [
      {
        id: 'q1-grd',
        question: 'Why does sorting intervals by END time (instead of START time) solve Interval Scheduling greedily?',
        options: [
          'End times are always positive integers.',
          'Picking the interval that finishes earliest frees up the resource as soon as possible, leaving maximum remaining time for subsequent intervals.',
          'Start times cannot be sorted in O(N log N).',
          'It guarantees intervals have length 1.',
        ],
        correctIndex: 1,
        explanation:
          'The greedy choice property states that committing to the job that finishes earliest leaves the maximal amount of time available for all remaining tasks, mathematically guaranteeing the maximum count of non-overlapping jobs.',
      },
    ],
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation & Bitmasking',
    shortName: 'Bit Manipulation',
    category: 'Bitwise',
    tagline: 'Operates directly on binary bit registers in single CPU clock cycles.',
    description:
      'Bit Manipulation uses hardware binary operators (AND `&`, OR `|`, XOR `^`, NOT `~`, Left Shift `<<`, Right Shift `>>`) to perform arithmetic and set operations at CPU clock-cycle speed. Crucial techniques include XOR cancellation (`x ^ x = 0`, `x ^ 0 = x`), Bitmasking (using an integer where the i-th bit represents presence in a subset of size <= 32), and Brian Kernighan’s algorithm to count set bits.',
    primaryDataStructures: ['Integers (Primitive 32/64-bit Registers)'],
    memoryModel: {
      layout: 'CPU registers (EAX/RAX registers on x86-64).',
      cacheLocality: 'Instant (register speed, 0 RAM latency).',
      pointerOverhead: 'Zero (pure 32-bit or 64-bit primitive numbers).',
      explanation:
        'Bitwise operations execute directly in the Arithmetic Logic Unit (ALU) in 1 clock cycle, using strictly O(1) space with zero heap allocation.',
    },
    complexity: [
      { operation: 'Bitwise AND / OR / XOR / Shift', average: 'O(1)', worst: 'O(1)', notes: 'Single CPU ALU instruction.' },
      { operation: 'Brian Kernighan’s Set Bit Count', average: 'O(k)', worst: 'O(32)', notes: 'Iterations equal number of set bits k.' },
      { operation: 'Space Complexity', average: 'O(1)', worst: 'O(1)', notes: 'Direct register allocation.' },
    ],
    realWorldApplications: [
      {
        title: 'Network Subnet Masks & IP Packet Headers',
        domain: 'Networking & Telecommunications',
        description: 'IP header checksums, protocol flags (SYN, ACK, FIN), and subnet calculations use bitwise masking for ultra-fast packet routing.',
      },
      {
        title: 'Permissions & Access Control (UNIX chmod 755)',
        domain: 'Operating Systems & Security',
        description: 'Read, Write, and Execute permissions are stored as 3 bits: 4 (100b), 2 (010b), 1 (001b). Masking checks access in 1 CPU cycle.',
      },
      {
        title: 'Chess Engines (Bitboards)',
        domain: 'Game Engines (Stockfish)',
        description: 'Stores the entire 64-square chessboard as a single 64-bit unsigned integer (uint64). Piece moves and attack vectors are calculated via bitwise shifts.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'single-number',
        title: 'Single Number (#136)',
        difficulty: 'Easy',
        pattern: 'XOR Cancellation',
        whyThisStructure: 'XORing all numbers cancels out every pair (`x ^ x = 0`), leaving only the single unique number in O(N) time and O(1) space.',
      },
      {
        id: 'number-of-1-bits',
        title: 'Number of 1 Bits (#191) / Hamming Weight',
        difficulty: 'Easy',
        pattern: "Brian Kernighan's Algorithm",
        whyThisStructure: '`n & (n - 1)` clears the lowest set bit in a single operation, running in steps equal to the number of 1-bits.',
      },
      {
        id: 'counting-bits',
        title: 'Counting Bits (#338)',
        difficulty: 'Easy',
        pattern: 'Bit DP Recurrence',
        whyThisStructure: 'dp[i] = dp[i >> 1] + (i & 1). Builds bit counts for all numbers from 0 to N in O(N) linear time.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Essential Bit Manipulation Formulas
function singleNumber(nums: number[]): number {
  let unique = 0;
  for (const num of nums) {
    unique ^= num; // x ^ x = 0, x ^ 0 = x
  }
  return unique;
}

// Brian Kernighan's Algorithm: Count set bits
function countSetBits(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1); // Clears the lowest set bit
    count++;
  }
  return count;
}`,
      keyTakeaway:
        'Key identities to memorize: `n & (n - 1)` clears the lowest set bit; `n & -n` isolates the lowest set bit; `x ^ x = 0`.',
    },
    youtubeQuery: 'bit manipulation tricks hacks visual leetcode',
    quiz: [
      {
        id: 'q1-bit',
        question: 'What does the bitwise expression `n & (n - 1)` accomplish?',
        options: [
          'Multiplies n by 2.',
          'Clears the lowest (least significant) set 1-bit in n.',
          'Inverts all bits.',
          'Checks if n is odd.',
        ],
        correctIndex: 1,
        explanation:
          'Subtracting 1 from n flips all bits up to and including the lowest set bit. Bitwise ANDing n with n - 1 clears that lowest set bit to 0 while leaving higher bits unchanged. If `n & (n - 1) == 0`, n is a power of 2!',
      },
    ],
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort & Kahn’s Algorithm',
    shortName: 'Topological Sort',
    category: 'Graph & Tree',
    tagline: 'Linear ordering of DAG vertices respecting all directional dependency constraints.',
    description:
      'Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u appears before vertex v in the ordering. If the graph contains a directed cycle, a valid topological ordering is mathematically impossible. Kahn’s algorithm uses in-degree counting with a FIFO queue to resolve dependencies and detect cycles in O(V + E) time.',
    primaryDataStructures: ['Adjacency Lists', 'Queues', 'In-Degree Arrays'],
    memoryModel: {
      layout: 'In-degree integer array of size V + Queue of ready vertices with in-degree 0.',
      cacheLocality: 'Moderate.',
      pointerOverhead: 'Adjacency list edge links O(V + E).',
      explanation:
        'Consumes O(V + E) memory to store the graph and O(V) memory for the in-degree array and queue.',
    },
    complexity: [
      { operation: 'Kahn’s Algorithm (BFS-based)', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Each vertex and edge processed once.' },
      { operation: 'DFS Post-Order Reversal', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Pushes to stack on backtrack; reverses stack.' },
      { operation: 'Space Complexity', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Adjacency list + in-degree array.' },
    ],
    realWorldApplications: [
      {
        title: 'Package Managers & Build Dependency Graphs (npm, Cargo, Make)',
        domain: 'DevOps & Tooling',
        description: 'Determines the compilation and installation order so libraries build before dependents. Detects circular dependency errors.',
      },
      {
        title: 'Spreadsheet Formula Evaluation (Excel, Google Sheets)',
        domain: 'Office Software',
        description: 'Cells with formulas (=A1+B1) form a DAG. Topological sort evaluates dependent cells in the exact order needed.',
      },
      {
        title: 'Database Schema Migration Rollouts',
        domain: 'Database Engineering',
        description: 'Foreign key constraints require tables to be created before child tables and dropped in reverse topological order.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'course-schedule-ts',
        title: 'Course Schedule (#207)',
        difficulty: 'Medium',
        pattern: 'Cycle Detection in DAG',
        whyThisStructure: 'If visited count < total courses, remaining courses are trapped in a cycle and cannot be completed.',
      },
      {
        id: 'course-schedule-ii',
        title: 'Course Schedule II (#210)',
        difficulty: 'Medium',
        pattern: 'Full Ordering Retrieval',
        whyThisStructure: 'Records the order in which vertices are dequeued; returns the valid course curriculum sequence in O(V + E).',
      },
      {
        id: 'alien-dictionary',
        title: 'Alien Dictionary (#269)',
        difficulty: 'Hard',
        pattern: 'Graph Construction + Topological Sort',
        whyThisStructure: 'Compares adjacent lexicographical words to deduce character ordering edges, then runs topological sort to determine alphabet order.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => [] as number[]);

  // prerequisites: [course, prereq] -> prereq must be taken before course
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }

  // Enqueue courses with zero dependencies
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  let head = 0;

  while (head < queue.length) {
    const curr = queue[head++];
    order.push(curr);

    for (const nextCourse of adj[curr]) {
      inDegree[nextCourse]--;
      if (inDegree[nextCourse] === 0) {
        queue.push(nextCourse);
      }
    }
  }

  // If order contains all courses, no cycle exists!
  return order.length === numCourses ? order : [];
}`,
      keyTakeaway:
        'In Kahn’s algorithm, if the length of the result array is less than V, a cycle exists. Never forget: `[course, prereq]` means `prereq -> course`.',
    },
    youtubeQuery: 'topological sort kahns algorithm cycle detection explained leetcode',
    quiz: [
      {
        id: 'q1-ts',
        question: 'In Kahn’s algorithm, what does it mean if the while loop terminates but the result array has fewer than V elements?',
        options: [
          'The graph has negative weights.',
          'The graph contains at least one directed cycle, preventing remaining nodes from ever reaching an in-degree of 0.',
          'Memory ran out.',
          'The starting node was incorrect.',
        ],
        correctIndex: 1,
        explanation:
          'Nodes involved in a directed cycle always retain an in-degree of at least 1 because they depend on each other. They can never enter the queue, proving a cycle exists.',
      },
    ],
  },
];

export const ALGORITHMS_DATA: AlgorithmDetail[] = [
  ...CORE_INTERVIEW_ALGORITHMS_DATA.map((algo) => ({
    ...algo,
    tier: (algo.tier || 'interview-core') as AlgorithmTier,
  })),
  ...CLASSICAL_ALGORITHMS_DATA,
];

