import { DecisionMatrix, StdLibGuide } from './interviewMasteryData';

export const CLASSICAL_ALGORITHM_MASTERY_DATABASE: Record<
  string,
  {
    decisionMatrix: DecisionMatrix;
    stdlibGuide: StdLibGuide;
  }
> = {
  'bubble-selection-sort': {
    decisionMatrix: {
      whenToUse: [
        'Storage medium has severe hardware write wear limits (e.g. Flash EEPROM memory where Selection Sort guarantees strictly at most N total writes).',
        'Input stream is expected to be already sorted, and you need an ultra-simple single-pass sanity check with zero heap allocation (early-break Bubble Sort).',
        'Educational classroom demonstrations of loop invariants and nested loop complexity.',
      ],
      whenNotToUse: [
        'General-purpose interview coding when N > 1,000 (O(N²) triggers instant TLE).',
        'Any production system where standard library sort is available.',
      ],
      fatalTraps: [
        {
          trap: 'Forgetting the early-exit `swapped` boolean flag in Bubble Sort.',
          whyItHappens: 'Without the flag, Bubble Sort always runs in O(N²) even on an already sorted list.',
          howToFix: 'Initialize `swapped = false` before the inner loop and break if no elements were swapped.',
        },
        {
          trap: 'Swapping elements inside the inner loop of Selection Sort instead of finding the minimum index.',
          whyItHappens: 'Swapping every time a smaller element is seen turns Selection Sort into an inefficient variant with O(N²) memory writes.',
          howToFix: 'Only track `minIdx = j` in the inner loop. Perform exactly ONE swap at the end of each outer loop iteration.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Built-in list sorting',
        declaration: '# Python uses Timsort internally (never raw Bubble/Selection sort)',
        commonOps: [
          'nums.sort()  # In-place Timsort O(N log N)',
          'sorted(nums) # Returns new sorted list',
        ],
        gotchaWarning: 'Never write a nested loop bubble sort in a Python interview unless specifically asked for demonstration.',
      },
      java: {
        importStmt: 'import java.util.Arrays;',
        declaration: 'Arrays.sort(nums); // Dual-Pivot QuickSort for primitives, Timsort for objects',
        commonOps: [
          'Arrays.sort(nums);',
          'Arrays.sort(nums, 0, len);',
        ],
        gotchaWarning: 'Java uses Dual-Pivot QuickSort for primitives (unstable) and Timsort for Objects (stable).',
      },
      cpp: {
        importStmt: '#include <algorithm>',
        declaration: 'std::sort(nums.begin(), nums.end()); // Introsort (QuickSort + HeapSort + InsertionSort)',
        commonOps: [
          'std::sort(nums.begin(), nums.end());',
          'std::stable_sort(nums.begin(), nums.end());',
        ],
        gotchaWarning: 'std::sort is NOT stable. Use std::stable_sort (MergeSort hybrid) if equal elements must preserve original order.',
      },
      typescript: {
        importStmt: '// Array.prototype.sort',
        declaration: 'nums.sort((a, b) => a - b); // Must pass comparator!',
        commonOps: [
          'nums.sort((a, b) => a - b); // Ascending numeric sort',
          'nums.sort((a, b) => b - a); // Descending numeric sort',
        ],
        gotchaWarning: 'In JavaScript, calling `nums.sort()` without a comparator sorts lexicographically as strings (e.g. 10 comes before 2)!',
      },
      go: {
        importStmt: 'import "slices"',
        declaration: 'slices.Sort(nums) // Go 1.21+ pdqsort (Pattern-Defeating QuickSort)',
        commonOps: [
          'slices.Sort(nums)',
          'slices.IsSorted(nums) // O(N) early check',
        ],
        gotchaWarning: 'Go 1.21+ uses pdqsort in `slices.Sort`, which incorporates insertion sort for small partitions.',
      },
    },
  },
  'insertion-sort': {
    decisionMatrix: {
      whenToUse: [
        'Small datasets (N <= 32–64) where instruction count and L1 cache hits outperform recursion overhead.',
        'Nearly sorted data (only a few elements out of place) where Insertion Sort runs in lightning O(N) time.',
        'Online streaming where items arrive one-by-one and the list must stay sorted continuously.',
      ],
      whenNotToUse: [
        'Unsorted arrays with N > 500.',
        'Large arrays in reverse order (maximum O(N²) shifts).',
      ],
      fatalTraps: [
        {
          trap: 'Using element swaps instead of value shifting in the inner while loop.',
          whyItHappens: 'Swapping writes 3 times per step (`temp = a; a = b; b = temp`). Shifting only writes once (`nums[j+1] = nums[j]`).',
          howToFix: 'Store the active value in `key`, shift preceding larger values right, and insert `key` once at `nums[j+1]`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'import bisect',
        declaration: '# Python bisect simulates online insertion into a sorted list',
        commonOps: [
          'bisect.insort(sorted_list, new_val) # Maintains sorted order in O(N) shifts',
        ],
        gotchaWarning: 'Inserting into a Python list is O(N) because elements must shift in memory.',
      },
      java: {
        importStmt: '// Embedded in java.util.DualPivotQuicksort',
        declaration: '// Java switches to Insertion Sort automatically for arrays < 47 elements',
        commonOps: [
          'Arrays.sort(nums); // Handled automatically under the hood',
        ],
        gotchaWarning: 'Never hand-roll insertion sort unless maintaining an online stream.',
      },
      cpp: {
        importStmt: '#include <algorithm>',
        declaration: '// std::__insertion_sort is used internally by std::sort for partitions <= 16',
        commonOps: [
          'std::rotate(nums.begin(), nums.begin() + 1, nums.end());',
        ],
        gotchaWarning: 'Modern C++ pdqsort automatically optimizes small branches using insertion sort.',
      },
      typescript: {
        importStmt: '// V8 internal',
        declaration: '// Chrome V8 uses insertion sort for small arrays in Array.prototype.sort',
        commonOps: [
          'nums.sort((a, b) => a - b);',
        ],
        gotchaWarning: 'Trust the V8 engine sort rather than manually implementing insertion sort in JavaScript.',
      },
      go: {
        importStmt: '// Internal to slices package',
        declaration: '// Go pdqsort switches to insertion sort when partition <= 24 elements',
        commonOps: [
          'slices.Sort(nums)',
        ],
        gotchaWarning: '`slices.Sort` in Go 1.21+ provides optimal hybrid performance.',
      },
    },
  },
  'merge-sort-classical': {
    decisionMatrix: {
      whenToUse: [
        'Sorting Linked Lists in O(N log N) time and O(1) auxiliary space (LeetCode #148).',
        'Counting Inversions in an array (LeetCode #493 Reverse Pairs, #315).',
        'External datasets that do not fit into physical RAM (multi-terabyte disk logs in Postgres/MapReduce).',
        'When algorithm stability is strictly required.',
      ],
      whenNotToUse: [
        'Tight memory environments where O(N) auxiliary scratch buffer space is unavailable.',
        'Small in-memory arrays where QuickSort cache locality is superior.',
      ],
      fatalTraps: [
        {
          trap: 'Allocating new slice/array buffers inside every recursive `merge()` call.',
          whyItHappens: 'Creating temporary arrays inside recursion causes severe heap fragmentation and GC pauses, slowing down execution by 5–10x.',
          howToFix: 'Preallocate ONE temporary array of size N before recursion and pass it down as a reusable scratch buffer.',
        },
        {
          trap: 'Using strict inequality `<` instead of `<=` during merge, destroying stability.',
          whyItHappens: 'If `nums[i] < nums[j]`, equal elements swap positions, violating stable sorting.',
          howToFix: 'Always write `if (nums[i] <= nums[j])` so the left element takes precedence on ties.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Python Timsort is a hybrid of MergeSort and InsertionSort',
        declaration: 'nums.sort() # Uses natural runs and merges in O(N log N)',
        commonOps: [
          'import heapq\nmerged = list(heapq.merge(list1, list2)) # Merges two sorted iterables in O(N)',
        ],
        gotchaWarning: 'Use `heapq.merge` to merge multiple sorted iterators without loading everything into memory at once.',
      },
      java: {
        importStmt: 'import java.util.Arrays;',
        declaration: 'Arrays.sort(objectArray); // Stable Timsort (MergeSort derivative) for Objects',
        commonOps: [
          'Arrays.sort(users, Comparator.comparing(User::getName)); // Guaranteed stable',
        ],
        gotchaWarning: 'Java uses Timsort for `Object[]` to guarantee stability, but Dual-Pivot QuickSort for primitive `int[]`.',
      },
      cpp: {
        importStmt: '#include <algorithm>',
        declaration: 'std::stable_sort(nums.begin(), nums.end()); // Guarantees MergeSort stability in O(N log N)',
        commonOps: [
          'std::stable_sort(nums.begin(), nums.end());',
          'std::inplace_merge(nums.begin(), mid, nums.end()); // In-place merge of 2 sorted ranges',
        ],
        gotchaWarning: 'std::stable_sort allocates temporary memory if available; falls back to O(N log² N) if memory is exhausted.',
      },
      typescript: {
        importStmt: '// JavaScript Array.prototype.sort',
        declaration: 'nums.sort((a, b) => a - b); // V8 sort is guaranteed stable since ECMAScript 2019',
        commonOps: [
          'items.sort((a, b) => a.priority - b.priority); // Relative order preserved',
        ],
        gotchaWarning: 'ECMAScript specification requires all Array.prototype.sort implementations to be stable.',
      },
      go: {
        importStmt: 'import "slices"',
        declaration: 'slices.SortStableFunc(items, cmpFunc) // Guaranteed stable sort',
        commonOps: [
          'slices.SortStableFunc(users, func(a, b User) int { return cmp.Compare(a.Age, b.Age) })',
        ],
        gotchaWarning: 'Use `slices.SortStableFunc` when key equality must preserve original ordering.',
      },
    },
  },
  'quicksort-hoare': {
    decisionMatrix: {
      whenToUse: [
        'In-place sorting where memory is constrained to O(log N) stack frames.',
        'Order statistics: Finding Kth largest/smallest element in expected O(N) using QuickSelect (LeetCode #215).',
        'Partitioning around discrete keys (Dutch National Flag 3-way partition in Sort Colors #75).',
      ],
      whenNotToUse: [
        'When algorithm stability is strictly required.',
        'Adversarial inputs where pivot selection could be manipulated into O(N²) worst case.',
      ],
      fatalTraps: [
        {
          trap: 'Choosing the first or last element as pivot on already-sorted inputs.',
          whyItHappens: 'Causes worst-case O(N²) recursion and stack overflow.',
          howToFix: 'Use randomized pivot selection or median-of-three (low, mid, high).',
        },
        {
          trap: 'Infinite loop in Hoare partitioning with duplicates.',
          whyItHappens: 'Stopping pointers strictly when `nums[i] < pivot` vs `<= pivot`.',
          howToFix: 'In Hoare partition, both pointers must stop when `nums[i] >= pivot` and `nums[j] <= pivot`, ensuring elements equal to pivot are partitioned symmetrically.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Python standard library',
        declaration: 'import random',
        commonOps: [
          'nums.sort() # Timsort is preferred over hand-rolled QuickSort',
        ],
        gotchaWarning: 'Python has a recursion limit of 1000 frames. Pure QuickSort can easily trigger `RecursionError` on large lists.',
      },
      java: {
        importStmt: 'import java.util.Arrays;',
        declaration: 'Arrays.sort(primitiveArray); // Dual-Pivot QuickSort by Vladimir Yaroslavskiy',
        commonOps: [
          'Arrays.sort(nums); // Extremely fast for primitive types',
        ],
        gotchaWarning: 'Java Dual-Pivot QuickSort uses two pivots to partition the array into three parts, achieving faster execution than classic QuickSort.',
      },
      cpp: {
        importStmt: '#include <algorithm>',
        declaration: 'std::sort(nums.begin(), nums.end()); // Introsort (QuickSort + HeapSort fallback)',
        commonOps: [
          'std::nth_element(nums.begin(), nums.begin() + k, nums.end()); // QuickSelect in O(N)!',
        ],
        gotchaWarning: '`std::nth_element` in C++ provides the standard library implementation of QuickSelect for Kth order statistics in strictly O(N) average time!',
      },
      typescript: {
        importStmt: '// V8 Introsort/Timsort',
        declaration: 'nums.sort((a, b) => a - b);',
        commonOps: [
          'nums.sort((a, b) => a - b);',
        ],
        gotchaWarning: 'For Kth largest in JavaScript, hand-roll QuickSelect or use a Min-Heap to avoid sorting the entire array.',
      },
      go: {
        importStmt: 'import "slices"',
        declaration: 'slices.Sort(nums) // Pattern-Defeating QuickSort (pdqsort)',
        commonOps: [
          'slices.Sort(nums)',
        ],
        gotchaWarning: 'pdqsort recognizes patterns like already-sorted, reverse-sorted, or repeated elements and sorts them in linear O(N) time.',
      },
    },
  },
  'counting-radix-sort': {
    decisionMatrix: {
      whenToUse: [
        'Integer keys with bounded range K (e.g. numbers from 0 to 1,000,000) where O(N + K) beats O(N log N).',
        'Fixed-length string or integer keys sorted via LSD Radix Sort (e.g. 32-bit integers in 4 passes of 8 bits).',
        'Maximum Gap problem (#164) where O(N) time is explicitly demanded.',
        'GPU parallel sorting where digit slicing maps to hardware SIMD registers.',
      ],
      whenNotToUse: [
        'Floating-point numbers with arbitrary precision or huge unbounded integers (e.g. range 10¹⁸).',
        'Arbitrary objects without discrete keys.',
      ],
      fatalTraps: [
        {
          trap: 'Iterating forward in the placement pass of Radix Sort.',
          whyItHappens: 'Forward iteration breaks algorithm stability, destroying the sorted order achieved in previous digit passes.',
          howToFix: 'Always iterate backwards from `N-1` down to `0` when placing elements into the output array.',
        },
        {
          trap: 'Negative integer handling in Radix / Counting sort.',
          whyItHappens: 'Negative values produce invalid negative array indices in the count array.',
          howToFix: 'Offset all numbers by `min_val` so smallest value maps to index 0, or sort negatives and positives separately.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from collections import Counter',
        declaration: '# Counter can simulate counting sort for frequency buckets',
        commonOps: [
          'counts = Counter(nums)\n# Reconstruct sorted array from sorted keys',
        ],
        gotchaWarning: 'Counting sort is often tested on LeetCode under the disguise of bucket sort (#347 Top K Frequent Elements).',
      },
      java: {
        importStmt: '// Primitive array counting',
        declaration: 'int[] count = new int[MAX_VAL + 1];',
        commonOps: [
          'for (int x : nums) count[x]++;\nint idx = 0;\nfor (int i = 0; i < count.length; i++) while (count[i]-- > 0) nums[idx++] = i;',
        ],
        gotchaWarning: 'Be aware of OutOfMemoryError if the range (max - min) exceeds 10⁷.',
      },
      cpp: {
        importStmt: '#include <vector>\n#include <algorithm>',
        declaration: '// Custom radix sort for 32-bit unsigned integers',
        commonOps: [
          '// 4 passes of 8 bits each (base 256) yields maximum CPU instruction throughput',
        ],
        gotchaWarning: 'NVIDIA CUDA CUB library provides `cub::DeviceRadixSort` for state-of-the-art GPU sorting.',
      },
      typescript: {
        importStmt: '// TypedArrays for fast counting',
        declaration: 'const count = new Int32Array(maxVal + 1);',
        commonOps: [
          'for (const x of nums) count[x]++;',
        ],
        gotchaWarning: 'TypedArrays (Int32Array, Uint8Array) prevent JavaScript object boxing overhead during counting.',
      },
      go: {
        importStmt: '// Slices for frequency buckets',
        declaration: 'count := make([]int, maxVal+1)',
        commonOps: [
          'for _, x := range nums { count[x]++ }',
        ],
        gotchaWarning: 'Make sure maxVal is bounded to avoid excessive allocation in make().',
      },
    },
  },
  'dijkstra-shortest-path': {
    decisionMatrix: {
      whenToUse: [
        'Single-source shortest path on directed or undirected graphs with non-negative edge weights.',
        'Network delay time or signal propagation across weighted latency networks (LeetCode #743).',
        'State space search with variable transition costs (LeetCode #1631 Path With Minimum Effort).',
      ],
      whenNotToUse: [
        'Unweighted graphs (use simple BFS in O(V + E) without heap overhead).',
        'Graphs with negative edge weights (use Bellman-Ford).',
        'All-pairs shortest paths on dense graphs (use Floyd-Warshall).',
      ],
      fatalTraps: [
        {
          trap: 'Failing to skip obsolete stale entries popped from the priority queue.',
          whyItHappens: 'When a shorter path to node U is found, a new pair `(dist, U)` is pushed to the heap, leaving the older longer pair in the heap. If not skipped, processing duplicate edges degrades runtime to O(E log V) or worse.',
          howToFix: 'Always include `if (d > dist[u]) continue;` immediately after popping from the heap.',
        },
        {
          trap: 'Applying Dijkstra to graphs with negative edges.',
          whyItHappens: 'Dijkstra assumes a settled node’s distance can never decrease. Negative edges break this invariant, producing incorrect shortest paths.',
          howToFix: 'Use Bellman-Ford or SPFA if negative weights exist.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'import heapq',
        declaration: '# Min-heap storing tuples: (distance, node_id)',
        commonOps: [
          'pq = [(0, start_node)]\nd, u = heapq.heappop(pq)\nheapq.heappush(pq, (new_dist, v))',
        ],
        gotchaWarning: 'Python’s `heapq` is a min-heap by default. Put distance as the FIRST element of the tuple so it sorts by distance.',
      },
      java: {
        importStmt: 'import java.util.PriorityQueue;\nimport java.util.Arrays;',
        declaration: 'PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));',
        commonOps: [
          'pq.offer(new int[]{dist, node});\nint[] curr = pq.poll();',
        ],
        gotchaWarning: 'Use `Integer.compare(a[0], b[0])` instead of `a[0] - b[0]` to prevent 32-bit integer subtraction overflow.',
      },
      cpp: {
        importStmt: '#include <queue>\n#include <vector>',
        declaration: 'std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;',
        commonOps: [
          'pq.push({dist, node});\nauto [d, u] = pq.top(); pq.pop();',
        ],
        gotchaWarning: 'C++ `std::priority_queue` is a MAX-heap by default! You MUST pass `std::greater<>` to make it a min-heap.',
      },
      typescript: {
        importStmt: '// Min-Heap Priority Queue',
        declaration: '// JavaScript has no built-in PriorityQueue in the standard library',
        commonOps: [
          '// Sort array or implement binary heap with push/bubbleUp and pop/sinkDown',
        ],
        gotchaWarning: 'For interviews in JavaScript, clarify whether you can assume a PriorityQueue helper or must write a binary heap.',
      },
      go: {
        importStmt: 'import "container/heap"',
        declaration: '// Implement heap.Interface with Len, Less, Swap, Push, Pop',
        commonOps: [
          'heap.Init(pq)\nheap.Push(pq, item)\nitem := heap.Pop(pq).(Item)',
        ],
        gotchaWarning: 'Remember that `heap.Pop()` returns `any`, requiring type assertion `.(Item)`.',
      },
    },
  },
  'bellman-ford': {
    decisionMatrix: {
      whenToUse: [
        'Graphs containing negative edge weights where Dijkstra fails.',
        'Negative cycle detection: Identifying foreign exchange currency arbitrage opportunities.',
        'Shortest path with at most K edges / hops (LeetCode #787 Cheapest Flights Within K Stops).',
      ],
      whenNotToUse: [
        'Large graphs with all-positive weights (Dijkstra is O((V+E) log V) vs Bellman-Ford O(V * E)).',
      ],
      fatalTraps: [
        {
          trap: 'Relaxing edges in-place during K-stops shortest path problems.',
          whyItHappens: 'If you update `dist` in-place within the same iteration, an update can cascade across multiple edges in a single step, simulating > 1 hop.',
          howToFix: 'Clone the distance array (`prevDist = [...dist]`) before each step and read exclusively from `prevDist`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Bellman-Ford flat edge list',
        declaration: 'edges = [(u, v, weight), ...]',
        commonOps: [
          'for _ in range(n - 1):\n    for u, v, w in edges:\n        if dist[u] + w < dist[v]: dist[v] = dist[u] + w',
        ],
        gotchaWarning: 'Check `if dist[u] != float("inf")` before adding `w` to prevent adding weights to infinity.',
      },
      java: {
        importStmt: 'import java.util.Arrays;',
        declaration: 'int[] dist = new int[n]; Arrays.fill(dist, Integer.MAX_VALUE); dist[src] = 0;',
        commonOps: [
          'if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) dist[v] = dist[u] + w;',
        ],
        gotchaWarning: 'Adding a positive weight to `Integer.MAX_VALUE` will overflow to negative numbers! Always guard with `dist[u] != Integer.MAX_VALUE`.',
      },
      cpp: {
        importStmt: '#include <vector>\n#include <climits>',
        declaration: 'std::vector<int> dist(n, INT_MAX); dist[src] = 0;',
        commonOps: [
          'if (dist[u] != INT_MAX && dist[u] + w < dist[v]) dist[v] = dist[u] + w;',
        ],
        gotchaWarning: 'Beware integer overflow when adding weight to `INT_MAX`.',
      },
      typescript: {
        importStmt: '// Flat array iteration',
        declaration: 'const dist = new Array(n).fill(Infinity); dist[src] = 0;',
        commonOps: [
          'if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;',
        ],
        gotchaWarning: 'Infinity + number is still Infinity in JS, but checking prevents unnecessary operations.',
      },
      go: {
        importStmt: 'import "math"',
        declaration: 'dist := make([]int, n); for i := range dist { dist[i] = math.MaxInt32 } dist[src] = 0',
        commonOps: [
          'if dist[u] != math.MaxInt32 && dist[u]+w < dist[v] { dist[v] = dist[u] + w }',
        ],
        gotchaWarning: 'Guard against integer overflow when adding weights to math.MaxInt32.',
      },
    },
  },
  'string-search-kmp': {
    decisionMatrix: {
      whenToUse: [
        'Finding occurrences of a pattern in a continuous text stream without backtracking the text pointer.',
        'Problems involving string periodicity or palindrome prefixes (LeetCode #214 Shortest Palindrome).',
        'Linear O(N + M) substring search where naive O(N * M) worst-case would time out.',
      ],
      whenNotToUse: [
        'General interviews where language built-in `str.indexOf()` or `in` is sufficient and permitted.',
        'Multiple pattern search simultaneously (use Aho-Corasick or Trie instead).',
      ],
      fatalTraps: [
        {
          trap: 'Off-by-one errors when advancing the LPS table pointer on mismatch.',
          whyItHappens: 'Setting `len = lps[len]` instead of `len = lps[len - 1]`.',
          howToFix: 'When mismatch occurs and `len > 0`, fall back to `len = lps[len - 1]`. Only advance `i` when `len == 0`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Built-in string matching',
        declaration: 'idx = haystack.find(needle) # C-level optimized Boyer-Moore-Horspool hybrid',
        commonOps: [
          'idx = haystack.find(needle) # Returns -1 if not found',
          'if needle in haystack: ...',
        ],
        gotchaWarning: 'Python’s built-in `str.find` is implemented in C and runs faster than any pure Python KMP loop.',
      },
      java: {
        importStmt: '// Java String.indexOf',
        declaration: 'int idx = haystack.indexOf(needle);',
        commonOps: [
          'int idx = haystack.indexOf(needle);',
          'boolean contains = haystack.contains(needle);',
        ],
        gotchaWarning: 'Java 9+ uses vectorized SIMD intrinsics for `indexOf`, beating manual loops by multiples.',
      },
      cpp: {
        importStmt: '#include <string>',
        declaration: 'size_t pos = haystack.find(needle);',
        commonOps: [
          'if (pos != std::string::npos) { /* Match found */ }',
        ],
        gotchaWarning: '`std::string::find` returns `std::string::npos` (not -1) when the substring is missing.',
      },
      typescript: {
        importStmt: '// String.prototype.indexOf',
        declaration: 'const idx = haystack.indexOf(needle);',
        commonOps: [
          'const idx = haystack.indexOf(needle);',
          'const exists = haystack.includes(needle);',
        ],
        gotchaWarning: 'Use `indexOf` for index lookup and `includes` for boolean existence checks.',
      },
      go: {
        importStmt: 'import "strings"',
        declaration: 'idx := strings.Index(haystack, needle)',
        commonOps: [
          'idx := strings.Index(haystack, needle)',
          'contains := strings.Contains(haystack, needle)',
        ],
        gotchaWarning: '`strings.Index` in Go utilizes assembly-optimized Boyer-Moore-Horspool with vectorization.',
      },
    },
  },
};
