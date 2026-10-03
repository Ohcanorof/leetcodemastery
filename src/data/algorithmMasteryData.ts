import { DecisionMatrix, StdLibGuide } from './interviewMasteryData';
import { CLASSICAL_ALGORITHM_MASTERY_DATABASE } from './classicalMasteryData';

const CORE_ALGORITHM_MASTERY_DATABASE: Record<
  string,
  {
    decisionMatrix: DecisionMatrix;
    stdlibGuide: StdLibGuide;
  }
> = {
  'binary-search': {
    decisionMatrix: {
      whenToUse: [
        'Array is already sorted, or can be sorted in O(N log N) without violating constraints.',
        'Target search space is monotonic: condition(x) is False, False, ..., True, True.',
        '"Binary Search on Answer": Finding min/max value that satisfies a feasibility check (e.g. Koko Eating Bananas, Capacity to Ship Packages).',
        'Looking for the first or last occurrence of a duplicate element (lower_bound / upper_bound).',
      ],
      whenNotToUse: [
        'Data is unsorted and cannot be sorted (use linear scan or hash map).',
        'Data structure is a Linked List (cannot jump to middle in O(1)).',
        'Search space has no monotonic invariant (local minima/maxima with random jumps).',
      ],
      fatalTraps: [
        {
          trap: 'Integer overflow on `mid = (low + high) / 2`.',
          whyItHappens: 'In Java/C++, adding two 32-bit signed integers near 2^31 overflows into negative numbers.',
          howToFix: 'Always write `mid = low + (high - low) / 2` or `(low + high) >>> 1`.',
        },
        {
          trap: 'Infinite loop due to pointer not advancing on 2-element intervals.',
          whyItHappens: 'Writing `low = mid` with integer truncation when `high - low == 1`.',
          howToFix: 'If using inclusive intervals `low <= high`, always advance with `low = mid + 1` or `high = mid - 1`. If `low = mid` is needed, use `mid = low + (high - low + 1) / 2`.',
        },
        {
          trap: 'Returning -1 instead of `low` when search target is not found in bound queries.',
          whyItHappens: 'For insertion index (Search Insert Position), candidates return -1 instead of the insertion pointer `low`.',
          howToFix: 'When loop `low <= high` terminates, `low` points to the smallest index where `nums[low] >= target` (exact insertion point).',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'import bisect',
        declaration: '# bisect_left returns first index where item >= target\n# bisect_right returns first index where item > target',
        commonOps: [
          'idx = bisect.bisect_left(arr, target)   # lower_bound',
          'idx = bisect.bisect_right(arr, target)  # upper_bound',
          'bisect.insort(arr, target)              # Insert maintaining sort',
        ],
        gotchaWarning: '`bisect` does NOT check if the element exists! It returns the insertion position. You must check `if idx < len(arr) and arr[idx] == target:`.',
      },
      java: {
        importStmt: 'import java.util.Arrays;\nimport java.util.Collections;',
        declaration: 'int idx = Arrays.binarySearch(arr, target);',
        commonOps: [
          'int idx = Arrays.binarySearch(arr, target); // Returns index or (-(insertion point) - 1)',
          'int insertionPoint = idx >= 0 ? idx : -idx - 1;',
        ],
        gotchaWarning: 'If target is missing, Java returns negative `(-(insertion point) - 1)`. To get the insertion point, compute `-idx - 1`.',
      },
      cpp: {
        importStmt: '#include <algorithm>',
        declaration: '# Operates on sorted iterators',
        commonOps: [
          'auto it = std::lower_bound(arr.begin(), arr.end(), target); // >= target',
          'auto it = std::upper_bound(arr.begin(), arr.end(), target); // > target',
          'bool exists = std::binary_search(arr.begin(), arr.end(), target);',
          'int idx = std::distance(arr.begin(), it);',
        ],
        gotchaWarning: '`std::lower_bound` returns an iterator. If target is greater than all elements, it returns `arr.end()`. Dereferencing without checking causes segmentation fault!',
      },
      typescript: {
        importStmt: '// Custom binary search helper function',
        declaration: 'function binarySearch(arr: number[], target: number): number { ... }',
        commonOps: [
          'let low = 0, high = arr.length - 1;',
          'while (low <= high) { const mid = low + ((high - low) >> 1); ... }',
        ],
        gotchaWarning: 'JavaScript has NO built-in binary search in `Array.prototype`! Writing a clean 6-line helper is expected in interviews.',
      },
      go: {
        importStmt: 'import "sort"',
        declaration: 'idx := sort.Search(len(arr), func(i int) bool { return arr[i] >= target })',
        commonOps: [
          '// sort.Search finds smallest index i where func(i) is true',
          'if idx < len(arr) && arr[idx] == target { /* found */ }',
        ],
        gotchaWarning: '`sort.Search` takes a closure condition. It returns `len(arr)` if condition is false for all elements.',
      },
    },
  },

  'two-pointers': {
    decisionMatrix: {
      whenToUse: [
        'Sorted array search for pairs or triplets with sum/difference constraints.',
        'In-place array modification without extra memory (e.g. Move Zeroes, Remove Duplicates).',
        'Palindromes and string symmetry verification.',
        'Cycle detection in linked lists or state transitions (Floyd’s fast/slow).',
      ],
      whenNotToUse: [
        'Array is unsorted and sorting is prohibited (use Hash Map for O(N) space).',
        'Need to examine all arbitrary non-contiguous subsets (use Backtracking/DP).',
        'Multiple interdependent indices (> 3) where nested sweeps exceed acceptable time limits.',
      ],
      fatalTraps: [
        {
          trap: 'Skipping duplicate values in 3Sum improperly.',
          whyItHappens: 'Incrementing pointers without while loops to bypass identical adjacent values.',
          howToFix: 'After finding a match in 3Sum: `while (left < right && nums[left] === nums[left+1]) left++; while (left < right && nums[right] === nums[right-1]) right--; left++; right--;`.',
        },
        {
          trap: 'Fast pointer crashing on null in Floyd’s algorithm.',
          whyItHappens: 'Checking `while (fast != null)` without also checking `fast.next != null`.',
          howToFix: 'Always guard with `while (fast != null && fast.next != null)`.',
        },
        {
          trap: 'Using `<` instead of `<=` on reader/writer pointer compaction.',
          whyItHappens: 'Off-by-one error when processing the final element in an array.',
          howToFix: 'Reader pointer must loop through `for (let read = 0; read < nums.length; read++)`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Standard indexing idiom',
        declaration: 'left, right = 0, len(nums) - 1',
        commonOps: [
          'while left < right:\n    curr_sum = nums[left] + nums[right]\n    if curr_sum == target: return [left, right]\n    elif curr_sum < target: left += 1\n    else: right -= 1',
        ],
        gotchaWarning: 'Remember Python strings are immutable! When modifying strings with two pointers, convert to list first: `chars = list(s)`, mutate, then `"".join(chars)`.',
      },
      java: {
        importStmt: '# Standard array indices',
        declaration: 'int left = 0, right = nums.length - 1;',
        commonOps: [
          'while (left < right) {\n    int sum = nums[left] + nums[right];\n    if (sum == target) return new int[]{left, right};\n    else if (sum < target) left++;\n    else right--;\n}',
        ],
        gotchaWarning: 'Be careful of integer overflow when summing `nums[left] + nums[right]`. If values can be 10^9, cast to `(long) nums[left] + nums[right]`.',
      },
      cpp: {
        importStmt: '#include <vector>',
        declaration: 'int left = 0, right = nums.size() - 1;',
        commonOps: [
          'while (left < right) {\n    long long sum = (long long)nums[left] + nums[right];\n    if (sum == target) return {left, right};\n    else if (sum < target) left++;\n    else right--;\n}',
        ],
        gotchaWarning: 'In C++, `nums.size()` returns an unsigned `size_t`. If `nums` is empty, `nums.size() - 1` wraps to a huge positive integer! Cast to `int` or check `nums.empty()`.',
      },
      typescript: {
        importStmt: '// Direct array indices',
        declaration: 'let left = 0, right = nums.length - 1;',
        commonOps: [
          'while (left < right) {\n    const sum = nums[left] + nums[right];\n    if (sum === target) return [left, right];\n    sum < target ? left++ : right--;\n}',
        ],
        gotchaWarning: 'Strings in JavaScript are immutable; swap operations `s[left] = s[right]` silently fail in non-strict mode without error. Split into an array first.',
      },
      go: {
        importStmt: '// Slices and indices',
        declaration: 'left, right := 0, len(nums)-1',
        commonOps: [
          'for left < right {\n    sum := nums[left] + nums[right]\n    if sum == target { return []int{left, right} }\n    if sum < target { left++ } else { right-- }\n}',
        ],
        gotchaWarning: 'When swapping slice elements in Go, use simultaneous assignment: `nums[left], nums[right] = nums[right], nums[left]`.',
      },
    },
  },

  'sliding-window': {
    decisionMatrix: {
      whenToUse: [
        'Finding longest, shortest, or target contiguous subarray/substring.',
        'Problem mentions "at most K distinct elements", "sum equals K with positive numbers", or "window of size K".',
        'Running calculations (moving averages, max product, character frequency match).',
      ],
      whenNotToUse: [
        'Subarrays contain negative numbers and problem requires sum == K (use Prefix Sum + Hash Map instead!).',
        'Subsequences are required instead of contiguous subarrays (use DP/Two Pointers).',
        'Window boundaries jump unpredictably rather than advancing monotonically.',
      ],
      fatalTraps: [
        {
          trap: 'Using sliding window on subarray sum problems with negative numbers.',
          whyItHappens: 'Sliding window requires monotonic window sum behavior (expanding increases sum, shrinking decreases sum). Negative numbers destroy monotonicity!',
          howToFix: 'For subarray sum with negative numbers (e.g. Subarray Sum Equals K #560), MUST use Prefix Sum + Hash Map.',
        },
        {
          trap: 'Off-by-one window length calculation (`right - left` vs `right - left + 1`).',
          whyItHappens: 'Zero-indexed intervals [left, right] inclusive contain `right - left + 1` elements.',
          howToFix: 'Always use `right - left + 1` for length of inclusive interval [left, right].',
        },
        {
          trap: 'Forgetting to decrement frequency count to zero and deleting the key.',
          whyItHappens: 'Leaving `map.get(char) === 0` in the map inflates `map.size`, breaking "at most K distinct" checks.',
          howToFix: 'Always `if (count === 0) map.delete(char)`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from collections import defaultdict',
        declaration: 'window = defaultdict(int)\nleft = 0',
        commonOps: [
          'for right, val in enumerate(nums):\n    window[val] += 1\n    while invalid_condition:\n        window[nums[left]] -= 1\n        if window[nums[left]] == 0: del window[nums[left]]\n        left += 1',
        ],
        gotchaWarning: 'Be sure to delete keys when count hits 0 (`del window[key]`); otherwise `len(window)` counts keys with 0 frequency!',
      },
      java: {
        importStmt: 'import java.util.HashMap;\nimport java.util.Map;',
        declaration: 'Map<Character, Integer> counts = new HashMap<>();\nint left = 0;',
        commonOps: [
          'for (int right = 0; right < s.length(); right++) {\n    char c = s.charAt(right);\n    counts.put(c, counts.getOrDefault(c, 0) + 1);\n    while (counts.size() > k) {\n        char leftChar = s.charAt(left);\n        counts.put(leftChar, counts.get(leftChar) - 1);\n        if (counts.get(leftChar) == 0) counts.remove(leftChar);\n        left++;\n    }\n}',
        ],
        gotchaWarning: 'If characters are ASCII only, an integer array `int[] counts = new int[128]` is 5x faster than `HashMap<Character, Integer>` and consumes zero heap allocations.',
      },
      cpp: {
        importStmt: '#include <unordered_map>',
        declaration: 'std::unordered_map<char, int> counts;\nint left = 0;',
        commonOps: [
          'for (int right = 0; right < s.size(); right++) {\n    counts[s[right]]++;\n    while (counts.size() > k) {\n        if (--counts[s[left]] == 0) counts.erase(s[left]);\n        left++;\n    }\n}',
        ],
        gotchaWarning: 'Notice `counts.erase(s[left])` when frequency reaches 0. In C++, leaving a key with value 0 still counts towards `counts.size()`.',
      },
      typescript: {
        importStmt: '// Map or typed array',
        declaration: 'const counts = new Map<string, number>();\nlet left = 0;',
        commonOps: [
          'for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    counts.set(ch, (counts.get(ch) ?? 0) + 1);\n    while (counts.size > k) {\n        const lch = s[left];\n        counts.set(lch, counts.get(lch)! - 1);\n        if (counts.get(lch) === 0) counts.delete(lch);\n        left++;\n    }\n}',
        ],
        gotchaWarning: '`counts.delete(key)` is mandatory when frequency reaches 0 if checking `counts.size`.',
      },
      go: {
        importStmt: '// Map or byte array',
        declaration: 'counts := make(map[byte]int)\nleft := 0',
        commonOps: [
          'for right := 0; right < len(s); right++ {\n    counts[s[right]]++\n    for len(counts) > k {\n        counts[s[left]]--\n        if counts[s[left]] == 0 { delete(counts, s[left]) }\n        left++\n    }\n}',
        ],
        gotchaWarning: 'Use `delete(counts, s[left])` when counter reaches zero to maintain correct `len(counts)`.',
      },
    },
  },

  bfs: {
    decisionMatrix: {
      whenToUse: [
        'Finding the shortest path on unweighted graphs or uniform-cost grids.',
        'Level-order tree traversal (printing nodes row by row).',
        'Multi-source spread / infection simulation (Rotting Oranges, 01 Matrix).',
        'Finding all nodes within distance K of a target.',
      ],
      whenNotToUse: [
        'Edges have varying weights (use Dijkstra or Bellman-Ford).',
        'Graph is a tree and problem asks for path sum or leaves (DFS uses less memory: O(H) vs O(W)).',
        'Looking for all possible paths or permutations (use Backtracking).',
      ],
      fatalTraps: [
        {
          trap: 'Marking node as visited upon dequeue instead of enqueue.',
          whyItHappens: 'Marking visited on pop allows multiple neighbors to enqueue the same node before it is popped, causing O(2^V) memory explosion!',
          howToFix: 'Always mark `visited.add(neighbor)` immediately when PUSHING into the queue.',
        },
        {
          trap: 'Using dynamic `q.length` in level-order loops.',
          whyItHappens: 'Writing `for (let i = 0; i < q.length; i++)` while pushing new child nodes into `q` causes infinite loops.',
          howToFix: 'Freeze the level size first: `const levelSize = q.length; for (let i = 0; i < levelSize; i++)`.',
        },
        {
          trap: 'Using `shift()` on JavaScript arrays.',
          whyItHappens: 'In JS, `arr.shift()` shifts all remaining elements in memory, degrading BFS from O(V + E) to O(V^2).',
          howToFix: 'Use a `head` pointer on the array `const curr = q[head++]` or a double-ended queue.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from collections import deque',
        declaration: 'queue = deque([start_node])\nvisited = {start_node}',
        commonOps: [
          'while queue:\n    for _ in range(len(queue)): # Freeze level\n        curr = queue.popleft()\n        for neighbor in adj[curr]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)',
        ],
        gotchaWarning: 'Always use `queue.popleft()`! `queue.pop(0)` on standard lists is an O(N) memory shift.',
      },
      java: {
        importStmt: 'import java.util.ArrayDeque;\nimport java.util.Queue;\nimport java.util.Set;\nimport java.util.HashSet;',
        declaration: 'Queue<Integer> q = new ArrayDeque<>();\nSet<Integer> visited = new HashSet<>();',
        commonOps: [
          'q.offer(start);\nvisited.add(start);\nwhile (!q.isEmpty()) {\n    int levelSize = q.size();\n    for (int i = 0; i < levelSize; i++) {\n        int curr = q.poll();\n        for (int next : adj[curr]) {\n            if (visited.add(next)) q.offer(next);\n        }\n    }\n}',
        ],
        gotchaWarning: 'Notice `visited.add(next)`: in Java, `Set.add()` returns `true` if the element was newly added, letting you check and insert in a single line!',
      },
      cpp: {
        importStmt: '#include <queue>\n#include <vector>',
        declaration: 'std::queue<int> q;\nstd::vector<bool> visited(n, false);',
        commonOps: [
          'q.push(start);\nvisited[start] = true;\nwhile (!q.empty()) {\n    int levelSize = q.size();\n    for (int i = 0; i < levelSize; ++i) {\n        int curr = q.front(); q.pop();\n        for (int next : adj[curr]) {\n            if (!visited[next]) {\n                visited[next] = true;\n                q.push(next);\n            }\n        }\n    }\n}',
        ],
        gotchaWarning: '`q.pop()` in C++ returns `void`. Always extract value with `curr = q.front()` before calling `q.pop()`.',
      },
      typescript: {
        importStmt: '// Flat array with head pointer for O(1) dequeue',
        declaration: 'const queue: number[] = [start];\nlet head = 0;\nconst visited = new Set<number>([start]);',
        commonOps: [
          'while (head < queue.length) {\n    const levelSize = queue.length - head;\n    for (let i = 0; i < levelSize; i++) {\n        const curr = queue[head++];\n        for (const nxt of adj[curr]) {\n            if (!visited.has(nxt)) {\n                visited.add(nxt);\n                queue.push(nxt);\n            }\n        }\n    }\n}',
        ],
        gotchaWarning: 'Never use `queue.shift()` inside a large BFS loop; use a `head` integer pointer.',
      },
      go: {
        importStmt: '// Slices and head pointer',
        declaration: 'queue := []int{start}\nvisited := make(map[int]bool)\nvisited[start] = true',
        commonOps: [
          'head := 0\nfor head < len(queue) {\n    curr := queue[head]; head++\n    for _, nxt := range adj[curr] {\n        if !visited[nxt] {\n            visited[nxt] = true\n            queue = append(queue, nxt)\n        }\n    }\n}',
        ],
        gotchaWarning: 'Periodically trim the queue slice `queue = queue[head:]` if processing millions of nodes to allow garbage collection.',
      },
    },
  },

  'dfs-backtracking': {
    decisionMatrix: {
      whenToUse: [
        'Tree traversals (in-order, pre-order, post-order) where memory must stay O(H).',
        'Generating combinations, permutations, subsets, or path partitions.',
        'Graph cycle detection and connected components (Flood Fill).',
        'Constraint satisfaction (N-Queens, Sudoku).',
      ],
      whenNotToUse: [
        'Finding the shortest path on unweighted graphs (BFS is faster and avoids wandering down infinite deep paths).',
        'Recursion depth exceeds call stack limits (10,000+ deep trees; convert to iterative with explicit stack).',
      ],
      fatalTraps: [
        {
          trap: 'Pushing the mutable working list into results without copying.',
          whyItHappens: '`result.push(current)` saves a reference; subsequent `.pop()` calls mutate all saved snapshots to `[]`.',
          howToFix: 'Always clone: in Python `result.append(list(current))`; in TS `result.push([...current])`; in Java `result.add(new ArrayList<>(current))`.',
        },
        {
          trap: 'Forgetting to UN-CHOOSE (backtrack state mutation).',
          whyItHappens: 'Adding to set or array, recursing, but failing to remove upon return.',
          howToFix: 'Strict pattern: `current.push(x); backtrack(); current.pop();`.',
        },
        {
          trap: 'Generating duplicate combinations when input contains duplicates.',
          whyItHappens: 'Branching on duplicate elements without sorting and skipping.',
          howToFix: 'Sort input first! Then: `if (i > start && nums[i] === nums[i - 1]) continue;`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Recursion with list snapshots',
        declaration: 'result = []\ncurrent = []',
        commonOps: [
          'def backtrack(start):\n    result.append(list(current)) # Snapshot clone!\n    for i in range(start, len(nums)):\n        current.append(nums[i])   # Choose\n        backtrack(i + 1)          # Explore\n        current.pop()             # Un-choose',
        ],
        gotchaWarning: 'Default Python recursion limit is 1,000. For deep graphs, use `sys.setrecursionlimit(200000)`.',
      },
      java: {
        importStmt: 'import java.util.ArrayList;\nimport java.util.List;',
        declaration: 'List<List<Integer>> result = new ArrayList<>();\nList<Integer> current = new ArrayList<>();',
        commonOps: [
          'void backtrack(int start, int[] nums) {\n    result.add(new ArrayList<>(current)); // Snapshot copy!\n    for (int i = start; i < nums.length; i++) {\n        current.add(nums[i]);\n        backtrack(i + 1, nums);\n        current.remove(current.size() - 1);\n    }\n}',
        ],
        gotchaWarning: 'Do NOT write `result.add(current)`. Always wrap in `new ArrayList<>(current)`.',
      },
      cpp: {
        importStmt: '#include <vector>',
        declaration: 'std::vector<std::vector<int>> result;\nstd::vector<int> current;',
        commonOps: [
          'void backtrack(int start, const std::vector<int>& nums) {\n    result.push_back(current); // Copies automatically in C++\n    for (int i = start; i < nums.size(); ++i) {\n        current.push_back(nums[i]);\n        backtrack(i + 1, nums);\n        current.pop_back();\n    }\n}',
        ],
        gotchaWarning: 'In C++, passing `nums` by value copies the array on every recursion level (O(N * 2^N) memory!). Always pass `const std::vector<int>& nums` by reference.',
      },
      typescript: {
        importStmt: '// Snapshot with spread operator',
        declaration: 'const result: number[][] = [];\nconst current: number[] = [];',
        commonOps: [
          'function backtrack(start: number) {\n    result.push([...current]); // Snapshot clone\n    for (let i = start; i < nums.length; i++) {\n        current.push(nums[i]);\n        backtrack(i + 1);\n        current.pop();\n    }\n}',
        ],
        gotchaWarning: 'Spread `[...current]` creates a shallow copy. If elements are nested arrays, use a deep copy.',
      },
      go: {
        importStmt: '// Copy slices in Go',
        declaration: 'result := make([][]int, 0)\ncurrent := make([]int, 0)',
        commonOps: [
          'snapshot := make([]int, len(current))\ncopy(snapshot, current)\nresult = append(result, snapshot)',
        ],
        gotchaWarning: 'In Go, `append(result, current)` retains the underlying array pointer. You MUST allocate a new slice and `copy()` before appending.',
      },
    },
  },

  sorting: {
    decisionMatrix: {
      whenToUse: [
        'Pre-processing step to group duplicate or identical elements together in O(N log N).',
        'Interval problems (aligning start or end boundaries).',
        'Enabling Binary Search or Two Pointers.',
        'Greedy choices that require largest or smallest values first.',
      ],
      whenNotToUse: [
        'Algorithm already runs in O(N) (sorting would degrade performance to O(N log N)).',
        'Input order must be strictly preserved without modification.',
        'Range of values is small bounded integers (use Counting Sort / Bucket Sort for O(N)).',
      ],
      fatalTraps: [
        {
          trap: 'JavaScript `.sort()` converting numbers to strings.',
          whyItHappens: '`[10, 2, 5].sort()` produces `[10, 2, 5]` because "10" < "2" alphabetically!',
          howToFix: 'Always provide a comparator: `arr.sort((a, b) => a - b)`.',
        },
        {
          trap: 'Comparator integer subtraction overflow in Java.',
          whyItHappens: 'Writing `(a, b) -> a - b` when `a = -2,000,000,000` and `b = 2,000,000,000` overflows to positive.',
          howToFix: 'Use `Integer.compare(a, b)` instead of raw subtraction.',
        },
        {
          trap: 'Assuming quicksort is stable.',
          whyItHappens: 'Standard in-place Quicksort is NOT stable (reorders equal keys).',
          howToFix: 'If stability is required (equal elements retain original relative order), use Mergesort or Timsort.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Built-in sorted() and list.sort()',
        declaration: 'arr.sort()                      # In-place Timsort O(N log N)\nnew_arr = sorted(arr, key=...)  # Returns new sorted list',
        commonOps: [
          'arr.sort(reverse=True)          # Descending',
          'intervals.sort(key=lambda x: (x[0], x[1])) # Custom tuple key',
        ],
        gotchaWarning: 'Python uses Timsort, which is stable and guarantees O(N log N) worst-case time with O(N) linear time on already-sorted data.',
      },
      java: {
        importStmt: 'import java.util.Arrays;\nimport java.util.Collections;',
        declaration: 'Arrays.sort(primitiveArr);\nArrays.sort(objectArr, (a, b) -> Integer.compare(a[0], b[0]));',
        commonOps: [
          'Arrays.sort(arr);',
          'Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));',
        ],
        gotchaWarning: 'To sort in descending order in Java, elements must be Objects (`Integer[]`, not `int[]`) to use `Collections.reverseOrder()`.',
      },
      cpp: {
        importStmt: '#include <algorithm>',
        declaration: 'std::sort(arr.begin(), arr.end());',
        commonOps: [
          'std::sort(arr.begin(), arr.end(), std::greater<int>()); // Descending',
          'std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) { return a[0] < b[0]; });',
        ],
        gotchaWarning: 'C++ `std::sort` requires Strict Weak Ordering: `comparator(a, a)` MUST return `false`. Using `<=` causes undefined behavior or segmentation fault!',
      },
      typescript: {
        importStmt: '// Array.prototype.sort',
        declaration: 'arr.sort((a, b) => a - b); // MANDATORY COMPARATOR',
        commonOps: [
          'arr.sort((a, b) => b - a); // Descending',
          'intervals.sort((a, b) => a[0] - b[0]); // Sort by start time',
        ],
        gotchaWarning: 'Never omit the callback: `arr.sort()` without arguments casts all elements to strings before sorting!',
      },
      go: {
        importStmt: 'import "sort"',
        declaration: 'sort.Ints(arr)',
        commonOps: [
          'sort.Ints(arr)',
          'sort.Slice(intervals, func(i, j int) bool { return intervals[i][0] < intervals[j][0] })',
        ],
        gotchaWarning: '`sort.Slice` uses reflection; for ultra-high throughput in competitive programming, implement `sort.Interface` (Len, Less, Swap).',
      },
    },
  },

  'dynamic-programming': {
    decisionMatrix: {
      whenToUse: [
        'Finding minimum/maximum cost, longest path, or total number of ways to reach a target.',
        'Decisions at step i depend on optimal outcomes of previous steps (e.g. step i-1 or step i-2).',
        'Brute-force recursion produces identical repeated subproblem calls (overlapping subproblems).',
        '0/1 Knapsack, Unbounded Knapsack, Longest Common Subsequence (LCS).',
      ],
      whenNotToUse: [
        'Greedy choice property holds (local choice is always globally optimal; greedy is faster and uses O(1) space).',
        'Subproblems do not overlap (e.g. Mergesort subproblems are completely independent; use Divide & Conquer).',
        'Problem asks for the actual list of all combinations (use Backtracking, as DP only computes optimal counts/costs).',
      ],
      fatalTraps: [
        {
          trap: 'Incorrect base case initialization.',
          whyItHappens: 'For minimum-cost DP, initializing table to 0 instead of Infinity; for count DP, forgetting `dp[0] = 1`.',
          howToFix: 'Carefully define the meaning of index 0. If minimizing, fill with `Infinity`; if counting combinations of 0 items, `dp[0] = 1`.',
        },
        {
          trap: 'Memory explosion on 2D DP matrices.',
          whyItHappens: 'Allocating `new int[N][M]` when N, M = 100,000.',
          howToFix: 'Space Optimization: if `dp[i]` only depends on `dp[i-1]`, keep only two 1D rows (`prevRow` and `currRow`) to reduce space from O(N * M) to O(M).',
        },
        {
          trap: 'Iteration direction loop order error in Knapsack.',
          whyItHappens: 'In 0/1 Knapsack, iterating weight from left-to-right uses the same item multiple times (unbounded knapsack).',
          howToFix: 'In 0/1 Knapsack (each item usable once), loop capacity backwards from `capacity` down to `weight`!',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from functools import lru_cache',
        declaration: '@lru_cache(maxsize=None)\ndef dp(i, j):\n    # Memoized recursive state\n    ...',
        commonOps: [
          '# 1D Tabulation\ndp = [float("inf")] * (amount + 1)\ndp[0] = 0',
          '# 2D Grid Tabulation\ndp = [[0] * cols for _ in range(rows)]',
        ],
        gotchaWarning: '`@lru_cache(None)` is extremely fast to write in interviews for Top-Down DP, but remember recursion depth limits for large N.',
      },
      java: {
        importStmt: 'import java.util.Arrays;',
        declaration: 'int[] dp = new int[amount + 1];\nArrays.fill(dp, Integer.MAX_VALUE / 2); // Avoid overflow on dp + 1',
        commonOps: [
          'int[][] dp = new int[n + 1][m + 1];',
          '// Space optimized row swap\nint[] prev = new int[m], curr = new int[m];',
        ],
        gotchaWarning: 'Be careful with `Integer.MAX_VALUE`: adding `1 + Integer.MAX_VALUE` overflows to negative! Use `Integer.MAX_VALUE / 2` or `1e9`.',
      },
      cpp: {
        importStmt: '#include <vector>\n#include <climits>',
        declaration: 'std::vector<int> dp(amount + 1, 1e9);\ndp[0] = 0;',
        commonOps: [
          'std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1, 0));',
        ],
        gotchaWarning: 'Pre-allocate 2D vectors directly `vector<vector<int>> dp(n, vector<int>(m, 0))` rather than pushing rows dynamically.',
      },
      typescript: {
        importStmt: '// Flat typed arrays',
        declaration: 'const dp = new Array(amount + 1).fill(Infinity);\ndp[0] = 0;',
        commonOps: [
          'const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));',
        ],
        gotchaWarning: 'Never write `new Array(rows).fill(new Array(cols))`! All rows will reference the exact same memory array.',
      },
      go: {
        importStmt: '// Slices of slices',
        declaration: 'dp := make([]int, amount+1)\nfor i := range dp { dp[i] = 1e9 }\ndp[0] = 0',
        commonOps: [
          'dp := make([][]int, rows)\nfor i := range dp { dp[i] = make([]int, cols) }',
        ],
        gotchaWarning: 'In Go, always initialize 2D slices in a loop to ensure each row has independent underlying memory.',
      },
    },
  },

  greedy: {
    decisionMatrix: {
      whenToUse: [
        'Local optimal choice leads to global optimal solution without reconsideration.',
        'Interval scheduling: Maximum non-overlapping intervals (sort by end time).',
        'Huffman coding and minimum cost merging (combine smallest elements first via min-heap).',
        'Jump Game / Gas Station: greedy reachability tracking.',
      ],
      whenNotToUse: [
        'Future choices can invalidate current decisions (e.g. 0/1 Knapsack where picking largest weight/value ratio fails; use DP).',
        'Coin Change with arbitrary denominations (e.g. coins [1, 3, 4] for amount 6: greedy gives 4+1+1=3 coins, but optimal is 3+3=2 coins; use DP!).',
      ],
      fatalTraps: [
        {
          trap: 'Assuming Greedy works when Dynamic Programming is required.',
          whyItHappens: 'Greedy choice seems intuitive, but counterexamples exist (e.g. Coin Change with arbitrary denominations).',
          howToFix: 'Always try to find a small counterexample before committing to Greedy in an interview! If you can find one counterexample, switch to DP.',
        },
        {
          trap: 'Sorting intervals by START time instead of END time in scheduling.',
          whyItHappens: 'Intuition says start earliest, but an interval starting at 1 and ending at 100 blocks all other intervals.',
          howToFix: 'Sort by END time to finish tasks earliest and maximize free space for subsequent tasks.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Sorting + greedy loop',
        declaration: 'intervals.sort(key=lambda x: x[1]) # Sort by end time',
        commonOps: [
          'max_reach = 0\nfor i, jump in enumerate(nums):\n    if i > max_reach: return False\n    max_reach = max(max_reach, i + jump)',
        ],
        gotchaWarning: 'Always verify if the problem requires finding the maximum number of intervals vs merging intervals (merging sorts by START time; non-overlapping sorts by END time).',
      },
      java: {
        importStmt: 'import java.util.Arrays;',
        declaration: 'Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));',
        commonOps: [
          'int lastEnd = intervals[0][1];\nfor (int i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] >= lastEnd) {\n        count++;\n        lastEnd = intervals[i][1];\n    }\n}',
        ],
        gotchaWarning: 'Use `Integer.compare(a[1], b[1])` to avoid overflow on extreme integer subtraction.',
      },
      cpp: {
        importStmt: '#include <algorithm>',
        declaration: 'std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) { return a[1] < b[1]; });',
        commonOps: [
          'int lastEnd = intervals[0][1];',
        ],
        gotchaWarning: 'Be sure to handle empty inputs `if (intervals.empty()) return 0;` before indexing `intervals[0]`.',
      },
      typescript: {
        importStmt: '// Array.prototype.sort',
        declaration: 'intervals.sort((a, b) => a[1] - b[1]);',
        commonOps: [
          'let lastEnd = intervals[0][1];\nfor (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] >= lastEnd) {\n        count++;\n        lastEnd = intervals[i][1];\n    }\n}',
        ],
        gotchaWarning: 'Remember `.sort()` mutates the original array in place in JavaScript.',
      },
      go: {
        importStmt: 'import "sort"',
        declaration: 'sort.Slice(intervals, func(i, j int) bool { return intervals[i][1] < intervals[j][1] })',
        commonOps: [
          'lastEnd := intervals[0][1]',
        ],
        gotchaWarning: 'Check `len(intervals) == 0` first to avoid panic on index 0.',
      },
    },
  },

  'bit-manipulation': {
    decisionMatrix: {
      whenToUse: [
        'Finding single unique numbers where all other elements appear twice (XOR cancellation).',
        'State representation for subsets of size N <= 30 (Bitmask DP).',
        'Counting set bits (Hamming Weight) or power of two verification.',
        'Swapping numbers or flags in O(1) space with zero memory allocation.',
      ],
      whenNotToUse: [
        'Number of elements exceeds 64 (bitmask overflows 64-bit integer registers; use a Set instead).',
        'Floating-point arithmetic or arbitrary precision decimals.',
        'Complex non-binary string parsing.',
      ],
      fatalTraps: [
        {
          trap: 'Operator precedence bugs with bitwise operators.',
          whyItHappens: 'Bitwise operators (`&`, `|`, `^`) have LOWER precedence than equality (`==`) and addition (`+`)!',
          howToFix: 'ALWAYS enclose bitwise operations in parentheses: `if ((n & 1) == 0)` NOT `if (n & 1 == 0)`.',
        },
        {
          trap: 'Signed 32-bit integer right shift vs unsigned shift.',
          whyItHappens: '`>>` performs arithmetic sign-extension (preserves negative sign bit), creating infinite loops when shifting negative numbers.',
          howToFix: 'In Java/JS, use `>>>` (logical unsigned shift) instead of `>>` when shifting bit patterns.',
        },
        {
          trap: 'Bit shifts greater than 31 in 32-bit integers.',
          whyItHappens: 'Writing `1 << 35` in C++ or JS rolls over modulo 32 (`1 << (35 % 32)`).',
          howToFix: 'Use 64-bit integers (`1LL << 35` in C++, `1n << 35n` in JS BigInt) if shifting >= 32 bits.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Native bitwise operators',
        declaration: '# & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), >> (right shift)',
        commonOps: [
          'n & (n - 1)          # Clears lowest set bit',
          'n & -n               # Isolates lowest set bit',
          'bin(n).count("1")    # Built-in set bit count',
          '1 << k               # 2^k power / k-th bit mask',
        ],
        gotchaWarning: 'Python integers have arbitrary precision (no 32-bit overflow). For negative numbers, bitwise inversion `~x` represents infinite two’s complement sign bits! Use `& 0xFFFFFFFF` to mask to 32 bits.',
      },
      java: {
        importStmt: 'import java.lang.Integer;',
        declaration: 'int mask = 1 << i;',
        commonOps: [
          'Integer.bitCount(n);        // O(1) hardware POPCNT',
          'Integer.numberOfLeadingZeros(n);',
          'n >>> 1;                    // Unsigned logical right shift',
          '(n & (1 << i)) != 0;       // Check if i-th bit is set',
        ],
        gotchaWarning: 'Remember: operator precedence! `if ((n & 1) == 0)` requires parentheses around `(n & 1)`.',
      },
      cpp: {
        importStmt: '#include <bitset>',
        declaration: 'int mask = 1 << i;',
        commonOps: [
          '__builtin_popcount(n);      // GCC compiler intrinsic hardware POPCNT',
          '__builtin_clz(n);           // Count leading zeros',
          'std::bitset<32> b(n);',
        ],
        gotchaWarning: 'For 64-bit integers, use `__builtin_popcountll(n)` and shift with `1ULL << i` to prevent 32-bit truncation.',
      },
      typescript: {
        importStmt: '// Native bitwise operators',
        declaration: 'const mask = 1 << i;',
        commonOps: [
          'const count = n.toString(2).split("1").length - 1;',
          'n >>> 1; // Unsigned shift',
          '(n & (1 << i)) !== 0;',
        ],
        gotchaWarning: 'JavaScript bitwise operators convert numbers to 32-bit signed integers! Bit shifting beyond 31 bits truncates. For > 31 bits, use `BigInt`.',
      },
      go: {
        importStmt: 'import "math/bits"',
        declaration: 'mask := 1 << i',
        commonOps: [
          'bits.OnesCount(uint(n))     // Hardware POPCNT',
          'bits.LeadingZeros(uint(n))',
          '(n & (1 << i)) != 0',
        ],
        gotchaWarning: 'In Go, bit shift count must be an unsigned integer: `1 << uint(i)`.',
      },
    },
  },

  'topological-sort': {
    decisionMatrix: {
      whenToUse: [
        'Finding valid sequence/schedule under prerequisite dependencies on a Directed Acyclic Graph (DAG).',
        'Detecting cycles in directed graphs (Kahn’s algorithm: processed count < V).',
        'Compilation order, build systems, and spreadsheet formula evaluation.',
      ],
      whenNotToUse: [
        'Graph is undirected (use Disjoint Set Union / BFS / DFS for undirected cycle detection).',
        'Graph has weights and shortest path is needed (use Dijkstra / Bellman-Ford).',
      ],
      fatalTraps: [
        {
          trap: 'Misorienting prerequisite edges.',
          whyItHappens: 'Prompt says: "[course, prereq] means you must take prereq before course". Candidates add edge `course -> prereq` instead of `prereq -> course`.',
          howToFix: 'Carefully verify: `prereq -> course`. In-degree belongs to `course` (`inDegree[course]++`).',
        },
        {
          trap: 'Failing to check for cycles when graph may not be a DAG.',
          whyItHappens: 'Returning the topological ordering without verifying `order.length === V`.',
          howToFix: 'If `order.length !== numCourses`, a directed cycle exists! Return empty array `[]`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from collections import deque, defaultdict',
        declaration: 'adj = defaultdict(list)\nin_degree = [0] * n',
        commonOps: [
          'queue = deque([i for i in range(n) if in_degree[i] == 0])\norder = []\nwhile queue:\n    curr = queue.popleft()\n    order.append(curr)\n    for nxt in adj[curr]:\n        in_degree[nxt] -= 1\n        if in_degree[nxt] == 0: queue.append(nxt)\nif len(order) != n: return [] # Cycle!',
        ],
        gotchaWarning: 'Always verify `len(order) == n` at the end to catch cycles.',
      },
      java: {
        importStmt: 'import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;',
        declaration: 'List<Integer>[] adj = new ArrayList[n];\nint[] inDegree = new int[n];',
        commonOps: [
          'Queue<Integer> q = new ArrayDeque<>();\nfor (int i = 0; i < n; i++) if (inDegree[i] == 0) q.offer(i);\nint[] order = new int[n];\nint idx = 0;\nwhile (!q.isEmpty()) {\n    int curr = q.poll();\n    order[idx++] = curr;\n    for (int nxt : adj[curr]) {\n        if (--inDegree[nxt] == 0) q.offer(nxt);\n    }\n}\nreturn idx == n ? order : new int[0];',
        ],
        gotchaWarning: 'If `idx < n`, return `new int[0]` because a cycle prevented all courses from being scheduled.',
      },
      cpp: {
        importStmt: '#include <vector>\n#include <queue>',
        declaration: 'std::vector<std::vector<int>> adj(n);\nstd::vector<int> inDegree(n, 0);',
        commonOps: [
          'std::queue<int> q;\nfor (int i = 0; i < n; ++i) if (inDegree[i] == 0) q.push(i);\nstd::vector<int> order;\nwhile (!q.empty()) {\n    int curr = q.front(); q.pop();\n    order.push_back(curr);\n    for (int nxt : adj[curr]) {\n        if (--inDegree[nxt] == 0) q.push(nxt);\n    }\n}\nreturn order.size() == n ? order : std::vector<int>();',
        ],
        gotchaWarning: 'Check `order.size() == n` to guarantee DAG acyclicity.',
      },
      typescript: {
        importStmt: '// Kahn’s algorithm queue',
        declaration: 'const inDegree = new Array(n).fill(0);\nconst adj: number[][] = Array.from({ length: n }, () => []);',
        commonOps: [
          'const queue: number[] = [];\nfor (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);\nconst order: number[] = [];\nlet head = 0;\nwhile (head < queue.length) {\n    const curr = queue[head++];\n    order.push(curr);\n    for (const nxt of adj[curr]) {\n        if (--inDegree[nxt] === 0) queue.push(nxt);\n    }\n}\nreturn order.length === n ? order : [];',
        ],
        gotchaWarning: 'Using a `head` integer pointer on `queue` avoids slow `shift()` calls.',
      },
      go: {
        importStmt: '// Slices and inDegree array',
        declaration: 'inDegree := make([]int, n)\nadj := make([][]int, n)',
        commonOps: [
          'queue := make([]int, 0)\nfor i := 0; i < n; i++ { if inDegree[i] == 0 { queue = append(queue, i) } }\norder := make([]int, 0, n)\nfor len(queue) > 0 {\n    curr := queue[0]; queue = queue[1:]\n    order = append(order, curr)\n    for _, nxt := range adj[curr] {\n        inDegree[nxt]--\n        if inDegree[nxt] == 0 { queue = append(queue, nxt) }\n    }\n}\nif len(order) != n { return []int{} }\nreturn order',
        ],
        gotchaWarning: 'Return empty slice `[]int{}` if `len(order) != n`.',
      },
    },
  },
};

export const ALGORITHM_MASTERY_DATABASE: Record<
  string,
  {
    decisionMatrix: DecisionMatrix;
    stdlibGuide: StdLibGuide;
  }
> = {
  ...CORE_ALGORITHM_MASTERY_DATABASE,
  ...CLASSICAL_ALGORITHM_MASTERY_DATABASE,
};

