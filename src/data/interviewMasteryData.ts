export interface DecisionMatrix {
  whenToUse: string[];
  whenNotToUse: string[];
  fatalTraps: {
    trap: string;
    whyItHappens: string;
    howToFix: string;
  }[];
}

export interface StdLibSnippet {
  importStmt: string;
  declaration: string;
  commonOps: string[];
  gotchaWarning: string;
}

export interface StdLibGuide {
  python: StdLibSnippet;
  java: StdLibSnippet;
  cpp: StdLibSnippet;
  typescript: StdLibSnippet;
  go: StdLibSnippet;
}

export const INTERVIEW_MASTERY_DATABASE: Record<
  string,
  {
    decisionMatrix: DecisionMatrix;
    stdlibGuide: StdLibGuide;
  }
> = {
  arrays: {
    decisionMatrix: {
      whenToUse: [
        'Need instant O(1) random index access (e.g., A[i]).',
        'Data size is known ahead of time or append-heavy (amortized O(1)).',
        'Working with Two Pointers (Left/Right or Fast/Slow) or Binary Search on sorted data.',
        'Prefix Sums and Difference Arrays for constant-time range sum queries.',
      ],
      whenNotToUse: [
        'Frequent insertions or deletions at the start or middle of the collection (O(N) shifts).',
        'Heavy non-contiguous key lookup (use a Hash Map instead).',
        'Unknown, dynamically growing collections where memory reallocations are unacceptable.',
      ],
      fatalTraps: [
        {
          trap: 'Off-by-one errors on boundaries (<= vs <, length vs length - 1).',
          whyItHappens: 'Forgetting whether intervals are half-open [left, right) or closed [left, right].',
          howToFix: 'Standardize: in Two Pointers, use left < right if pointers cannot overlap; left <= right in Binary Search where single element check is needed.',
        },
        {
          trap: 'Using array.shift() / unshift() or pop(0) inside an algorithm.',
          whyItHappens: 'Assuming inserting/removing at index 0 is cheap.',
          howToFix: 'In Python `pop(0)` is O(N); in JS `shift()` is O(N). If you need FIFO queue behavior, use `collections.deque` or a pointer offset.',
        },
        {
          trap: 'Integer Overflow on Midpoint Calculation.',
          whyItHappens: 'Writing `mid = (low + high) / 2` can overflow 32-bit signed integers in Java/C++ when low + high > 2^31 - 1.',
          howToFix: 'Always write `mid = low + (high - low) / 2` or `(low + high) >>> 1`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Built-in list',
        declaration: 'arr = [0] * n  # Pre-allocated fixed size list\narr = []        # Dynamic list',
        commonOps: [
          'arr.append(x)     # O(1) amortized',
          'arr.pop()         # O(1) from tail',
          'arr.pop(0)        # WARNING: O(N) shift! Avoid in loops',
          'arr[i]            # O(1) access',
        ],
        gotchaWarning: 'Python lists are dynamic arrays. Never use `list.pop(0)` or `list.insert(0, val)` in an O(N) loop—use `collections.deque` instead.',
      },
      java: {
        importStmt: 'import java.util.ArrayList;\nimport java.util.Arrays;',
        declaration: 'int[] arr = new int[n];                // Primitive fixed array\nList<Integer> list = new ArrayList<>(); // Dynamic',
        commonOps: [
          'list.add(val);             // O(1) amortized',
          'list.get(i);               // O(1) access',
          'Arrays.sort(arr);          // O(N log N) Dual-Pivot Quicksort',
          'Arrays.binarySearch(arr, k);',
        ],
        gotchaWarning: '`Arrays.sort(primitive[])` uses Dual-Pivot Quicksort (O(N^2) worst case on adversarial inputs). `Arrays.sort(Object[])` uses Timsort (O(N log N) guaranteed).',
      },
      cpp: {
        importStmt: '#include <vector>\n#include <algorithm>',
        declaration: 'std::vector<int> arr(n, 0); // Pre-sized with default value\nstd::vector<int> arr;        // Dynamic capacity',
        commonOps: [
          'arr.push_back(val);        // O(1) amortized',
          'arr.pop_back();            // O(1)',
          'arr[i];                    // O(1) without bounds check',
          'arr.at(i);                 // O(1) with bounds check exception',
        ],
        gotchaWarning: 'Vector reallocation invalidates all existing iterators and raw pointers pointing into the vector elements.',
      },
      typescript: {
        importStmt: '// Built-in Array',
        declaration: 'const arr: number[] = new Array(n).fill(0);\nconst list: number[] = [];',
        commonOps: [
          'arr.push(val);             // O(1) amortized append',
          'arr.pop();                 // O(1) pop tail',
          'arr.shift();               // WARNING: O(N) delete head!',
          'arr[i];                    // O(1) access',
        ],
        gotchaWarning: '`arr.sort()` in JS converts numbers to strings by default! Always provide a numeric comparator: `arr.sort((a, b) => a - b)`.',
      },
      go: {
        importStmt: 'import "sort"',
        declaration: 'arr := make([]int, n)       // Sized with zeros\nlist := make([]int, 0, cap) // Sized with preallocated capacity',
        commonOps: [
          'list = append(list, val)   // O(1) amortized',
          'val := list[len(list)-1]   // Peek last element',
          'list = list[:len(list)-1]  // Pop tail',
          'sort.Ints(arr)             // In-place sort',
        ],
        gotchaWarning: 'Slices share underlying array memory. Slicing `sub := arr[1:3]` does not copy; mutating `sub` mutates `arr`!',
      },
    },
  },

  'linked-lists': {
    decisionMatrix: {
      whenToUse: [
        'Strict O(1) insertion and deletion at head/tail without memory shifts.',
        'LRU Cache implementation (combined with Hash Map).',
        'Implementing Queues or Deques without continuous array reallocations.',
        'When memory is fragmented and a huge contiguous block of RAM cannot be allocated.',
      ],
      whenNotToUse: [
        'Random index access is required (accessing index i is O(N)).',
        'Binary search is needed (cannot do O(1) midpoint jumps).',
        'Iterating through massive amounts of data where CPU L1/L2 cache locality matters.',
      ],
      fatalTraps: [
        {
          trap: 'Losing the reference to the rest of the list when rewiring pointers.',
          whyItHappens: 'Writing `curr.next = prev` before saving `const nextNode = curr.next`.',
          howToFix: 'Always save `next = curr.next` as the very first line of any node rewiring loop.',
        },
        {
          trap: 'Null pointer exceptions on 0 or 1-node lists.',
          whyItHappens: 'Accessing `head.next.val` when head is null or head.next is null.',
          howToFix: 'Always create a Sentinel (Dummy) Node: `dummy = ListNode(0); dummy.next = head; return dummy.next`.',
        },
        {
          trap: 'Infinite loops in cyclic linked lists.',
          whyItHappens: 'Traversing with `while (curr != null)` when a back-edge exists.',
          howToFix: "Use Floyd's Tortoise & Hare algorithm (`slow = slow.next; fast = fast.next.next`) with `fast && fast.next` checks.",
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Typically defined by interview platform:\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next',
        declaration: 'dummy = ListNode(0)\ndummy.next = head',
        commonOps: [
          'curr = dummy.next          # Start traversal',
          'nxt = curr.next             # Save reference before rewiring',
          'curr.next = prev            # Reverse pointer',
        ],
        gotchaWarning: 'Python has no standard linked list class in its standard library; `collections.deque` is implemented in C as a doubly linked block list.',
      },
      java: {
        importStmt: 'import java.util.LinkedList;',
        declaration: 'LinkedList<Integer> list = new LinkedList<>();',
        commonOps: [
          'list.addFirst(val);        // O(1) prepend',
          'list.addLast(val);         // O(1) append',
          'list.removeFirst();        // O(1) remove head',
          'list.removeLast();         // O(1) remove tail',
        ],
        gotchaWarning: 'Java `LinkedList` incurs huge memory overhead (~24 bytes per node for pointers and object header). Prefer `ArrayDeque` for queues/stacks.',
      },
      cpp: {
        importStmt: '#include <list> // Doubly-linked\n#include <forward_list> // Singly-linked',
        declaration: 'std::list<int> dll;\nstd::forward_list<int> sll;',
        commonOps: [
          'dll.push_front(val);       // O(1)',
          'dll.push_back(val);        // O(1)',
          'dll.pop_front();           // O(1)',
          'dll.erase(iterator);       // O(1) given iterator',
        ],
        gotchaWarning: 'In C++ interviews, manually allocated `ListNode*` must be managed carefully. Forgetting to clean up nodes causes memory leaks, though interview judges ignore leaks.',
      },
      typescript: {
        importStmt: 'interface ListNode {\n  val: number;\n  next: ListNode | null;\n}',
        declaration: 'const dummy: ListNode = { val: 0, next: head };',
        commonOps: [
          'let curr: ListNode | null = head;',
          'let prev: ListNode | null = null;',
          'while (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }',
        ],
        gotchaWarning: 'In TypeScript, be careful with `null` vs `undefined`. Most platforms define `next: ListNode | null`. Avoid non-null assertion `!` unless checked.',
      },
      go: {
        importStmt: 'import "container/list"',
        declaration: 'l := list.New() // Built-in doubly linked list',
        commonOps: [
          'e := l.PushFront(val)      // O(1) prepend',
          'l.PushBack(val)            // O(1) append',
          'l.Remove(e)                // O(1) remove known element',
        ],
        gotchaWarning: '`container/list` in Go stores `any` (interface{}); retrieving values requires runtime type assertion: `e.Value.(int)`.',
      },
    },
  },

  'hash-tables': {
    decisionMatrix: {
      whenToUse: [
        'Complement lookups (e.g., target - num in Two Sum) in O(1) time.',
        'Frequency counting (anagrams, mode, element occurrences).',
        'Memoization / Caching in dynamic programming.',
        'Deduplication and visited set tracking in graphs / trees.',
      ],
      whenNotToUse: [
        'Data must remain sorted by key (use Balanced BST / TreeMap).',
        'Finding nearest smaller/greater keys or range queries [low, high] (Hash Map has no ordering).',
        'Memory is tightly constrained (load factor requires empty bucket overhead).',
      ],
      fatalTraps: [
        {
          trap: 'Modifying an object key after inserting it into the hash map.',
          whyItHappens: 'Changing key properties alters its hash code; subsequent `.get(key)` checks the wrong bucket and returns null!',
          howToFix: 'Only use immutable primitives (strings, numbers) or freeze composite keys into serialized strings (e.g. `JSON.stringify([r, c])`).',
        },
        {
          trap: 'Default/Missing key errors causing runtime crashes.',
          whyItHappens: 'Reading `map[key] + 1` when key does not exist yet.',
          howToFix: 'In Python use `defaultdict(int)` or `map.get(k, 0)`; in Java use `map.getOrDefault(k, 0)`; in TS use `(map.get(k) ?? 0) + 1`.',
        },
        {
          trap: 'Hash collision denial-of-service / quadratic slowdown.',
          whyItHappens: 'Custom or poorly chosen hash functions where all keys map to the same bucket.',
          howToFix: 'Rely on standard library string/number hashing; in Java 8+, long chains convert to Red-Black trees to keep worst-case at O(log N).',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from collections import defaultdict, Counter',
        declaration: 'counts = Counter(nums)          # Frequency counter\nadj = defaultdict(list)        # Auto-populating dict',
        commonOps: [
          'd[key] = val                  # O(1) insert/update',
          'val = d.get(key, default)     # Safe get with fallback',
          'if key in d:                  # O(1) membership check',
          'del d[key]                    # O(1) delete',
        ],
        gotchaWarning: 'Standard Python dictionaries preserve insertion order (since Python 3.7). However, do not rely on sort order—it is insertion order, not sorted key order.',
      },
      java: {
        importStmt: 'import java.util.HashMap;\nimport java.util.Map;',
        declaration: 'Map<String, Integer> map = new HashMap<>();',
        commonOps: [
          'map.put(key, val);                    // O(1) put',
          'map.getOrDefault(key, 0);             // O(1) safe get',
          'map.put(k, map.getOrDefault(k, 0)+1); // Frequency increment',
          'map.containsKey(key);                 // O(1) check',
        ],
        gotchaWarning: 'Array keys do not hash by content! Two arrays with identical elements `new int[]{1, 2}` have DIFFERENT hash codes. Use `List` or serialized string as keys.',
      },
      cpp: {
        importStmt: '#include <unordered_map>\n#include <unordered_set>',
        declaration: 'std::unordered_map<std::string, int> map;',
        commonOps: [
          'map[key] = val;             // O(1) insert (creates default if missing!)',
          'if (map.count(key)) { ... } // O(1) check',
          'map.find(key) != map.end(); // O(1) check via iterator',
        ],
        gotchaWarning: 'Using `map[key]` automatically inserts a default-constructed value if the key does not exist! Use `.count(key)` or `.find(key)` if you only want to inspect.',
      },
      typescript: {
        importStmt: '// Built-in Map and Set',
        declaration: 'const map = new Map<string, number>();\nconst set = new Set<number>();',
        commonOps: [
          'map.set(key, val);                   // O(1) set',
          'map.get(key);                        // O(1) get',
          'map.has(key);                        // O(1) check',
          'map.set(k, (map.get(k) ?? 0) + 1);   // Frequency count',
        ],
        gotchaWarning: 'Object literals `{}` only support strings/symbols as keys. Plain numbers are coerced to strings. For arbitrary object or number keys, always use ES6 `Map`.',
      },
      go: {
        importStmt: '// Built-in map',
        declaration: 'm := make(map[string]int)',
        commonOps: [
          'm[key] = val                         // O(1) insert/update',
          'val, exists := m[key]                // Two-value safe check',
          'delete(m, key)                       // O(1) delete',
        ],
        gotchaWarning: 'Reading a missing key in Go returns the zero-value (0, "", false) without error. Always use the `val, ok := m[key]` pattern to verify presence!',
      },
    },
  },

  stacks: {
    decisionMatrix: {
      whenToUse: [
        'Matching balanced parentheses, nested tags, or expression parsing.',
        'Backtracking and recursion simulation.',
        'Monotonic Stack: Finding the Next Greater Element or Next Smaller Element in O(N).',
        'Finding the largest rectangle in a histogram or maximum trapping water spans.',
      ],
      whenNotToUse: [
        'First-In, First-Out queue ordering is needed (use a Queue/Deque).',
        'Random access to elements in the middle of the collection (stacks only expose top).',
        'Searching for arbitrary elements (requires popping the entire stack).',
      ],
      fatalTraps: [
        {
          trap: 'Popping from an empty stack (Stack Underflow).',
          whyItHappens: 'Calling `stack.pop()` without first checking `if (stack.length > 0)`.',
          howToFix: 'Always guard with `while (!stack.isEmpty() && ...)` before touching `.peek()` or `.pop()`.',
        },
        {
          trap: 'In Monotonic Stack: Storing values instead of indices.',
          whyItHappens: 'Candidates store raw numbers, then cannot calculate widths, spans, or distances between elements.',
          howToFix: 'Store the array INDEX on the stack. You can always get the value via `nums[stack.top()]`, plus you know the exact position.',
        },
        {
          trap: 'Choosing the wrong inequality in Monotonic Stack (> vs >=).',
          whyItHappens: 'Confusion over how duplicates should be handled.',
          howToFix: 'If duplicate equal elements should NOT pop each other, use strict `nums[i] > nums[stack.top()]`. Test with `[2, 2, 2]` edge cases.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Standard list is used as stack',
        declaration: 'stack = []',
        commonOps: [
          'stack.append(val)      # Push O(1)',
          'top_val = stack.pop()  # Pop O(1)',
          'top_val = stack[-1]    # Peek O(1)',
          'if stack: ...          # Non-empty check',
        ],
        gotchaWarning: '`stack[-1]` raises `IndexError` on empty lists. Always check `if stack:` before peeking.',
      },
      java: {
        importStmt: 'import java.util.ArrayDeque;\nimport java.util.Deque;',
        declaration: 'Deque<Integer> stack = new ArrayDeque<>();',
        commonOps: [
          'stack.push(val);       // Push O(1)',
          'stack.pop();           // Pop O(1)',
          'stack.peek();          // Peek O(1) (returns null if empty)',
          'stack.isEmpty();',
        ],
        gotchaWarning: 'NEVER use the legacy `java.util.Stack` class! It inherits from `Vector` and is synchronized, incurring thread-locking performance penalties. Use `ArrayDeque`.',
      },
      cpp: {
        importStmt: '#include <stack>',
        declaration: 'std::stack<int> st;',
        commonOps: [
          'st.push(val);          // Push O(1)',
          'st.pop();              // Pop (void return!)',
          'st.top();              // Peek O(1)',
          'st.empty();',
        ],
        gotchaWarning: '`st.pop()` in C++ returns `void`! To retrieve and remove the top element, you must call `int v = st.top(); st.pop();` separately.',
      },
      typescript: {
        importStmt: '// Built-in Array',
        declaration: 'const stack: number[] = [];',
        commonOps: [
          'stack.push(val);       // Push O(1)',
          'const top = stack.pop(); // Pop O(1)',
          'const top = stack[stack.length - 1]; // Peek',
        ],
        gotchaWarning: '`stack.pop()` returns `undefined` if empty. In TypeScript with `noUncheckedIndexedAccess`, `stack[stack.length - 1]` has type `T | undefined`.',
      },
      go: {
        importStmt: '// Built-in slice as stack',
        declaration: 'stack := make([]int, 0)',
        commonOps: [
          'stack = append(stack, val)          // Push O(1)',
          'val := stack[len(stack)-1]          // Peek O(1)',
          'stack = stack[:len(stack)-1]        // Pop O(1)',
        ],
        gotchaWarning: 'Popping an empty slice in Go causes a runtime panic. Always check `if len(stack) > 0` before slicing.',
      },
    },
  },

  'queues-deques': {
    decisionMatrix: {
      whenToUse: [
        'Breadth-First Search (BFS) level-order traversal on trees and graphs.',
        'Sliding Window Maximum / Minimum in O(N) using Monotonic Deque.',
        'Rate limiting, request buffers, and round-robin task processing.',
        'Double-ended queues when push/pop are needed at both front and back.',
      ],
      whenNotToUse: [
        'LIFO processing is needed (use a Stack).',
        'Extracting priority or highest-value items first (use a Priority Queue / Heap).',
        'Random index access in the middle.',
      ],
      fatalTraps: [
        {
          trap: 'Using JavaScript `arr.shift()` or Python `list.pop(0)` for BFS.',
          whyItHappens: 'Syntactically convenient, but shifts all N elements in RAM on every pop!',
          howToFix: 'In Python, use `from collections import deque` (`q.popleft()`). In JS, maintain a head pointer index `let head = 0; curr = q[head++]`.',
        },
        {
          trap: 'Mixing up queue level sizes in BFS.',
          whyItHappens: 'Writing `for (int i = 0; i < q.size(); i++)` inside the loop where new children are being pushed, causing dynamic size changes.',
          howToFix: 'Freeze the level size in a separate variable before the loop: `const levelSize = q.length; for (let i = 0; i < levelSize; i++)`.',
        },
        {
          trap: 'Forgetting to mark nodes as visited upon ENQUEUEING in BFS.',
          whyItHappens: 'Marking nodes visited upon dequeueing allows other neighbors to enqueue the same node multiple times, causing exponential memory explosion.',
          howToFix: 'Always mark `visited.add(node)` immediately when PUSHING into the queue.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from collections import deque',
        declaration: 'q = deque()',
        commonOps: [
          'q.append(val)          # Push right O(1)',
          'q.appendleft(val)      # Push left O(1)',
          'val = q.popleft()      # Pop left O(1) [FIFO Dequeue]',
          'val = q.pop()          # Pop right O(1)',
        ],
        gotchaWarning: '`collections.deque` supports `maxlen=K` which automatically evicts opposite-end elements when capacity is exceeded—ideal for fixed-size sliding windows!',
      },
      java: {
        importStmt: 'import java.util.ArrayDeque;\nimport java.util.Queue;\nimport java.util.Deque;',
        declaration: 'Queue<Integer> q = new ArrayDeque<>();\nDeque<Integer> dq = new ArrayDeque<>();',
        commonOps: [
          'q.offer(val);          // Enqueue O(1) (safe)',
          'q.poll();              // Dequeue O(1) (returns null if empty)',
          'q.peek();              // Inspect head O(1)',
          'dq.pollLast();         // Deque pop tail O(1)',
        ],
        gotchaWarning: 'Prefer `.offer()` and `.poll()` over `.add()` and `.remove()`. The latter throw runtime exceptions when the queue is full or empty.',
      },
      cpp: {
        importStmt: '#include <queue>\n#include <deque>',
        declaration: 'std::queue<int> q;\nstd::deque<int> dq;',
        commonOps: [
          'q.push(val);           // Enqueue O(1)',
          'q.pop();               // Dequeue O(1) (void return)',
          'q.front();             // Peek head O(1)',
          'dq.push_front(val);    // Deque prepend O(1)',
        ],
        gotchaWarning: '`std::queue` does not provide iterators. If you need to inspect elements without popping, use `std::deque`.',
      },
      typescript: {
        importStmt: '// Tip: Fast BFS using index pointer on flat array',
        declaration: 'const q: number[] = [];\nlet head = 0;',
        commonOps: [
          'q.push(val);                   // Enqueue O(1)',
          'const curr = q[head++];        // O(1) Dequeue (no memory shifts!)',
          'const hasItems = head < q.length;',
        ],
        gotchaWarning: 'JS array `shift()` is O(N). For LeetCode BFS where total nodes <= 100,000, pushing to an array and incrementing a `head` integer pointer is O(1) and passes every strict judge.',
      },
      go: {
        importStmt: '// Slices or custom ring buffer',
        declaration: 'q := make([]int, 0)\nhead := 0',
        commonOps: [
          'q = append(q, val)            // Enqueue O(1)',
          'curr := q[head]; head++       // Dequeue O(1)',
          'if head > 1000 { q = q[head:]; head = 0 } // Periodic GC trim',
        ],
        gotchaWarning: 'Repeatedly sub-slicing `q = q[1:]` does not free discarded memory. Re-slice periodically to release garbage-collected memory.',
      },
    },
  },

  'trees-bst': {
    decisionMatrix: {
      whenToUse: [
        'Hierarchical parent-child relationships (file systems, HTML DOM).',
        'BST: Maintaining a sorted collection with O(log N) dynamic insert, delete, and search.',
        'Range queries: Finding all elements in interval [minVal, maxVal] efficiently.',
        'Lowest Common Ancestor (LCA) queries in taxonomies.',
      ],
      whenNotToUse: [
        'Data requires constant O(1) lookups (use a Hash Map).',
        'Unbalanced input data where insertions arrive sorted (BST degenerates into an O(N) linked list unless using self-balancing Red-Black / AVL trees).',
      ],
      fatalTraps: [
        {
          trap: 'Validating BST by only comparing node with its immediate children.',
          whyItHappens: 'Checking `node.left.val < node.val` allows an invalid node deep in the left subtree to be greater than the root!',
          howToFix: 'Pass down global min and max bounds: `isValid(node, min, max)` and verify `min < node.val < max` across the entire tree.',
        },
        {
          trap: 'Modifying BST nodes directly without returning updated pointers.',
          whyItHappens: 'In recursive BST deletion, failing to write `root.left = deleteNode(root.left, key)` loses subtree reattachments.',
          howToFix: 'Structure recursive tree operations to return the new subtree root: `node.left = recurse(node.left)`.',
        },
        {
          trap: 'Stack Overflow on deep, skewed trees during DFS.',
          whyItHappens: 'A skewed tree of 100,000 nodes uses 100,000 call stack frames, exceeding the default recursion limit.',
          howToFix: 'In Python call `sys.setrecursionlimit(200000)` or convert DFS to an iterative stack traversal.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Standard TreeNode definition',
        declaration: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right',
        commonOps: [
          'def dfs(node):\n    if not node: return\n    dfs(node.left)\n    print(node.val) # Inorder = sorted in BST\n    dfs(node.right)',
        ],
        gotchaWarning: 'Python has no built-in balanced BST in its standard library. For LeetCode problems needing dynamic sorted order, use `bisect` over a sorted list or `sortedcontainers.SortedList` if allowed.',
      },
      java: {
        importStmt: 'import java.util.TreeMap;\nimport java.util.TreeSet;',
        declaration: 'TreeSet<Integer> bst = new TreeSet<>(); // Red-Black Self-Balancing BST',
        commonOps: [
          'bst.add(val);               // O(log N) insert',
          'bst.ceiling(x);             // O(log N) smallest key >= x',
          'bst.floor(x);               // O(log N) largest key <= x',
          'bst.subSet(low, high);      // O(log N) range view',
        ],
        gotchaWarning: 'Java `TreeSet` and `TreeMap` are backed by Red-Black Trees. They guarantee strict O(log N) performance for insertions, deletions, and ceiling/floor queries.',
      },
      cpp: {
        importStmt: '#include <set>\n#include <map>',
        declaration: 'std::set<int> bst; // Self-balancing Red-Black Tree',
        commonOps: [
          'bst.insert(val);            // O(log N)',
          'auto it = bst.lower_bound(x); // Smallest item >= x',
          'auto it = bst.upper_bound(x); // Smallest item > x',
          'bst.erase(val);             // O(log N)',
        ],
        gotchaWarning: '`std::map` and `std::set` in C++ are balanced BSTs (O(log N)). Do not confuse with `std::unordered_map` / `std::unordered_set` (hash tables, O(1)).',
      },
      typescript: {
        importStmt: 'class TreeNode {\n  val: number;\n  left: TreeNode | null = null;\n  right: TreeNode | null = null;\n  constructor(val: number) { this.val = val; }\n}',
        declaration: 'const root = new TreeNode(10);',
        commonOps: [
          'function inorder(node: TreeNode | null) {\n  if (!node) return;\n  inorder(node.left);\n  console.log(node.val);\n  inorder(node.right);\n}',
        ],
        gotchaWarning: 'Neither JavaScript nor TypeScript has a built-in balanced BST class. In interviews requiring running median or dynamic sorted ranges, candidates usually implement a lightweight treap, segment tree, or use Two Heaps.',
      },
      go: {
        importStmt: 'type TreeNode struct {\n    Val int\n    Left *TreeNode\n    Right *TreeNode\n}',
        declaration: 'root := &TreeNode{Val: 10}',
        commonOps: [
          'func inorder(n *TreeNode) {\n    if n == nil { return }\n    inorder(n.Left)\n    println(n.Val)\n    inorder(n.Right)\n}',
        ],
        gotchaWarning: 'Go has no built-in tree library. Trees in Go interviews are built using pointer structs.',
      },
    },
  },

  heaps: {
    decisionMatrix: {
      whenToUse: [
        'Finding the "Kth Largest" or "Kth Smallest" elements in a stream or collection in O(N log K).',
        'Merging K sorted lists or arrays simultaneously in O(N log K).',
        'Dijkstra Shortest Path and Prim Minimum Spanning Tree algorithms.',
        'Continuous dynamic median tracking (Two Heaps: Max-Heap on left, Min-Heap on right).',
      ],
      whenNotToUse: [
        'Need to search for arbitrary values (searching in a heap is O(N) because children have no left-to-right order).',
        'Need to output the entire array in sorted order once (standard quicksort/timsort O(N log N) is faster due to contiguous cache lines).',
      ],
      fatalTraps: [
        {
          trap: 'Using a MAX-heap when looking for the Kth LARGEST element.',
          whyItHappens: 'Intuition says "largest = max heap", but a max-heap requires storing all N elements (O(N) memory).',
          howToFix: 'Use a MIN-heap of size K! Small elements get evicted when size > K, leaving the top K largest in the heap. The top is the Kth largest!',
        },
        {
          trap: 'Language Default Direction Confusion (Min-Heap vs. Max-Heap).',
          whyItHappens: 'Python `heapq` is Min-Heap by default. C++ `priority_queue` is Max-Heap by default!',
          howToFix: 'Memorize defaults: Python/Java = Min-Heap. C++ = Max-Heap. In Python, store `-val` to simulate Max-Heap. In C++, pass `std::greater<int>` for Min-Heap.',
        },
        {
          trap: 'Modifying elements inside the heap directly.',
          whyItHappens: 'Changing an object value does not trigger automatic bubbling down/up, breaking the heap invariant.',
          howToFix: 'Never mutate elements in place. Either remove and re-insert, or push new entries and discard stale entries on pop (lazy deletion).',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'import heapq',
        declaration: 'min_heap = []\nheapq.heapify(existing_list) # O(N) linear build!',
        commonOps: [
          'heapq.heappush(min_heap, val)       # O(log N) push',
          'min_val = heapq.heappop(min_heap)   # O(log N) extract min',
          'min_val = min_heap[0]               # O(1) peek root',
          'heapq.heappush(max_heap, -val)      # Max-Heap pattern!',
        ],
        gotchaWarning: 'CRITICAL: Python `heapq` is strictly a MIN-heap! To implement a Max-Heap, multiply numbers by -1: `heapq.heappush(h, -x)` and retrieve with `-heapq.heappop(h)`.',
      },
      java: {
        importStmt: 'import java.util.PriorityQueue;\nimport java.util.Collections;',
        declaration: 'PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());',
        commonOps: [
          'minHeap.offer(val);                 // O(log N) push',
          'int min = minHeap.poll();           // O(log N) extract min',
          'int min = minHeap.peek();           // O(1) peek root',
          'PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]); // Custom comparator',
        ],
        gotchaWarning: 'Be careful with comparator subtraction `(a, b) -> a - b`: integer underflow/overflow can occur if numbers have opposite signs! Use `Integer.compare(a, b)`.',
      },
      cpp: {
        importStmt: '#include <queue>\n#include <vector>',
        declaration: 'std::priority_queue<int> maxHeap; // DEFAULT IS MAX-HEAP!\nstd::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;',
        commonOps: [
          'maxHeap.push(val);                  // O(log N)',
          'int topVal = maxHeap.top();         // O(1) peek',
          'maxHeap.pop();                      // O(log N) (void return!)',
        ],
        gotchaWarning: 'CRITICAL: C++ `std::priority_queue` is a MAX-HEAP by default! To make it a Min-Heap, you must pass 3 template arguments: `priority_queue<int, vector<int>, greater<int>>`.',
      },
      typescript: {
        importStmt: '// JavaScript / TypeScript has NO built-in Heap class!',
        declaration: '// In interviews: use a simple sorted insertion or lightweight 15-line MinHeap',
        commonOps: [
          '// Common workaround: For small K, keep a sorted array via binary insertion (O(K))',
          '// For large scale: Implement MinHeap with bubbleUp & bubbleDown (see Scratch Code tab)',
        ],
        gotchaWarning: 'Be transparent with your interviewer: "Since JS has no built-in PriorityQueue, I can write a quick binary heap or assume a standard PriorityQueue interface." Most interviewers let you assume the interface.',
      },
      go: {
        importStmt: 'import "container/heap"',
        declaration: '// Requires implementing heap.Interface (Len, Less, Swap, Push, Pop)',
        commonOps: [
          'h := &IntHeap{2, 1, 5}\nheap.Init(h)             // O(N) build',
          'heap.Push(h, 3)          // O(log N)',
          'minVal := heap.Pop(h)    // O(log N)',
        ],
        gotchaWarning: 'Go requires implementing 5 methods (`Len`, `Less`, `Swap`, `Push`, `Pop`) to satisfy `heap.Interface`. To make a Max-Heap in Go, invert the return of `Less(i, j)`.',
      },
    },
  },

  graphs: {
    decisionMatrix: {
      whenToUse: [
        'Finding the shortest path on unweighted graphs (BFS guarantees fewest hops).',
        'Finding the shortest path on non-negative weighted graphs (Dijkstra algorithm).',
        'Dependency resolution and task ordering (Topological Sort / Kahn’s algorithm on DAGs).',
        'Connected components and cycle detection (DFS / Union-Find).',
      ],
      whenNotToUse: [
        'Graph is a simple tree hierarchy without cycles (use standard TreeNode recursion).',
        'Data is 1D linear (use Two Pointers or Sliding Window).',
      ],
      fatalTraps: [
        {
          trap: 'Representing sparse graphs as an Adjacency Matrix (V x V).',
          whyItHappens: 'Writing `int[][] matrix = new int[V][V]`. If V = 100,000, this creates 10 billion elements and crashes with OutOfMemory!',
          howToFix: 'Always use an Adjacency List: `Map<Integer, List<Integer>>` or `vector<vector<int>>`. Space is O(V + E).',
        },
        {
          trap: 'Forgetting to check for cycles during DFS traversal.',
          whyItHappens: 'Calling recursive `dfs(neighbor)` without tracking a `visited` set or 3-state coloring (`0=unvisited, 1=visiting, 2=visited`).',
          howToFix: 'Use a 3-state array or visited set to detect back-edges and terminate recursion immediately.',
        },
        {
          trap: 'Dijkstra with negative edge weights.',
          whyItHappens: 'Dijkstra assumes that once a node is popped from the min-heap, its shortest distance is finalized.',
          howToFix: 'Dijkstra fails on negative edge weights! Use Bellman-Ford or Floyd-Warshall if negative weights exist.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: 'from collections import defaultdict, deque',
        declaration: 'adj = defaultdict(list)\nfor u, v in edges:\n    adj[u].append(v)',
        commonOps: [
          '# BFS Shortest Path\nq = deque([(start_node, 0)])\nvisited = {start_node}\nwhile q:\n    curr, dist = q.popleft()',
        ],
        gotchaWarning: 'Avoid building graphs with nested loops over all pairs ($O(V^2)$). Iterate directly over the given edge list ($O(E)$).',
      },
      java: {
        importStmt: 'import java.util.ArrayList;\nimport java.util.List;',
        declaration: 'List<Integer>[] adj = new ArrayList[n];\nfor (int i = 0; i < n; i++) adj[i] = new ArrayList<>();',
        commonOps: [
          'adj[u].add(v);              // Directed edge u -> v',
          'boolean[] visited = new boolean[n];',
        ],
        gotchaWarning: 'Generic array creation `new ArrayList<Integer>[n]` causes unchecked compiler warnings in Java. Casting `(List<Integer>[]) new ArrayList[n]` is the standard interview idiom.',
      },
      cpp: {
        importStmt: '#include <vector>',
        declaration: 'std::vector<std::vector<int>> adj(n);',
        commonOps: [
          'adj[u].push_back(v);        // Directed edge u -> v',
          'std::vector<bool> visited(n, false);',
        ],
        gotchaWarning: '`std::vector<bool>` is a specialized space-optimized bit-vector in C++. Iterating with `auto& x` fails because references to individual bits cannot be bound.',
      },
      typescript: {
        importStmt: '// Array of arrays or Map',
        declaration: 'const adj: number[][] = Array.from({ length: n }, () => []);\nfor (const [u, v] of edges) adj[u].push(v);',
        commonOps: [
          'const visited = new Set<number>();\nvisited.add(startNode);',
        ],
        gotchaWarning: 'When node IDs are non-integers (e.g. city names), use `Map<string, string[]>` instead of flat index arrays.',
      },
      go: {
        importStmt: '// Slices of slices',
        declaration: 'adj := make([][]int, n)\nfor _, e := range edges {\n    adj[e[0]] = append(adj[e[0]], e[1])\n}',
        commonOps: [
          'visited := make([]bool, n)',
        ],
        gotchaWarning: 'Always verify edge orientations in the prompt: prerequisites `[course, prereq]` means `prereq -> course`, NOT `course -> prereq`!',
      },
    },
  },

  tries: {
    decisionMatrix: {
      whenToUse: [
        'Prefix matching (`startsWith(prefix)`) across a large dictionary of words.',
        'Autocomplete systems and search suggestion engines.',
        'Word Search on a grid (allows pruning grid backtracking paths early).',
        'Bitwise Maximum XOR queries (using a Binary Trie with 0 and 1 branches).',
      ],
      whenNotToUse: [
        'Only checking exact equality of words without prefix lookups (a simple Hash Set is faster and uses less memory).',
        'Dictionary contains arbitrary unicode characters with massive sparse alphabets (memory overhead multiplies).',
      ],
      fatalTraps: [
        {
          trap: 'Forgetting the `isEndOfWord` boolean flag.',
          whyItHappens: 'If "apple" is in the trie, searching for "app" returns true unless you verify `curr.isEndOfWord == true`.',
          howToFix: 'Prefix searches check character path existence; exact word searches MUST also verify `node.isEndOfWord === true`.',
        },
        {
          trap: 'Memory explosion on 26-pointer child arrays.',
          whyItHappens: 'Allocating `new TrieNode[26]` for every single node when words are sparse.',
          howToFix: 'Use a `Map<char, TrieNode>` for dynamic branching, or use fixed arrays only when alphabet size is strictly fixed (e.g. 26 lowercase English letters).',
        },
        {
          trap: 'In Word Search II: Not pruning leaf nodes after finding a word.',
          whyItHappens: 'Finding a word once and leaving it in the Trie causes the grid search to repeatedly find duplicates and hit Time Limit Exceeded (TLE).',
          howToFix: 'Once a word is matched, set `node.word = null` or remove matched leaf nodes from the Trie.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Standard nested dictionary Trie pattern',
        declaration: 'trie = {}\ndef insert(word):\n    curr = trie\n    for ch in word:\n        curr = curr.setdefault(ch, {})\n    curr["#"] = True # "#" denotes end of word',
        commonOps: [
          'def startsWith(prefix):\n    curr = trie\n    for ch in prefix:\n        if ch not in curr: return False\n        curr = curr[ch]\n    return True',
        ],
        gotchaWarning: 'In Python, using nested dictionaries `{}` is significantly faster to write in interviews than a custom `TrieNode` class, and runs 2x faster.',
      },
      java: {
        importStmt: 'class TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEnd = false;\n}',
        declaration: 'TrieNode root = new TrieNode();',
        commonOps: [
          'int idx = ch - \'a\';\nif (curr.children[idx] == null) curr.children[idx] = new TrieNode();\ncurr = curr.children[idx];',
        ],
        gotchaWarning: 'Always index lowercase letters via `ch - \'a\'`. Be careful if the problem description allows uppercase or punctuation characters!',
      },
      cpp: {
        importStmt: 'struct TrieNode {\n    TrieNode* children[26] = {nullptr};\n    bool isEnd = false;\n};',
        declaration: 'TrieNode* root = new TrieNode();',
        commonOps: [
          'int idx = ch - \'a\';\nif (!curr->children[idx]) curr->children[idx] = new TrieNode();\ncurr = curr->children[idx];',
        ],
        gotchaWarning: 'In C++, initialize the array with `{nullptr}`. Uninitialized raw pointer arrays contain garbage memory addresses and will segfault!',
      },
      typescript: {
        importStmt: 'class TrieNode {\n  children = new Map<string, TrieNode>();\n  isEnd = false;\n}',
        declaration: 'const root = new TrieNode();',
        commonOps: [
          'if (!curr.children.has(ch)) curr.children.set(ch, new TrieNode());\ncurr = curr.children.get(ch)!;',
        ],
        gotchaWarning: 'Using `Map<string, TrieNode>` in TS avoids `charCodeAt(0) - 97` offset arithmetic and cleanly handles arbitrary characters.',
      },
      go: {
        importStmt: 'type TrieNode struct {\n    children [26]*TrieNode\n    isEnd bool\n}',
        declaration: 'root := &TrieNode{}',
        commonOps: [
          'idx := ch - \'a\'\nif curr.children[idx] == nil { curr.children[idx] = &TrieNode{} }\ncurr = curr.children[idx]',
        ],
        gotchaWarning: 'Go runes are 32-bit integers. Subtracting `ch - \'a\'` is valid for ASCII lowercase letters.',
      },
    },
  },

  'union-find': {
    decisionMatrix: {
      whenToUse: [
        'Dynamic connectivity: Adding edges dynamically and querying if two nodes are in the same set in O(1).',
        'Kruskal’s Minimum Spanning Tree (MST) algorithm.',
        'Cycle detection in undirected graphs.',
        'Grouping connected components, merging accounts, or island cluster labeling.',
      ],
      whenNotToUse: [
        'Directed graphs with cycle detection (Union-Find only models undirected equivalence; use Kahn’s or DFS for directed graphs).',
        'Need to find the actual shortest path distance between two nodes (Union-Find only tells you IF they are connected, not the distance).',
      ],
      fatalTraps: [
        {
          trap: 'Omitting Path Compression in the `find` method.',
          whyItHappens: 'Writing a simple `while (parent[x] != x) x = parent[x]; return x`.',
          howToFix: 'Without path compression, trees degenerate into linked lists of height N, degrading performance from O(1) to O(N)! Always write `parent[x] = find(parent[x])`.',
        },
        {
          trap: 'Trying to use Union-Find on a Directed Graph.',
          whyItHappens: 'Union-Find is symmetric: `union(u, v)` connects u to v and v to u. It cannot model directed one-way dependencies.',
          howToFix: 'For directed graph cycle detection, use Topological Sort (in-degrees) or DFS 3-state coloring.',
        },
        {
          trap: 'Forgetting to decrement component count upon successful union.',
          whyItHappens: 'In problems like "Number of Connected Components", failing to do `count--` inside `union()`.',
          howToFix: 'Only decrement count if `rootX != rootY`: `if (rootX === rootY) return false; parent[rootX] = rootY; count--; return true;`.',
        },
      ],
    },
    stdlibGuide: {
      python: {
        importStmt: '# Standard 12-line UnionFind class',
        declaration: 'parent = list(range(n))\ndef find(i):\n    if parent[i] != i:\n        parent[i] = find(parent[i]) # Path compression\n    return parent[i]',
        commonOps: [
          'def union(i, j):\n    root_i, root_j = find(i), find(j)\n    if root_i != root_j:\n        parent[root_i] = root_j\n        return True\n    return False # Cycle detected!',
        ],
        gotchaWarning: 'Python default recursion depth is 1000. Path compression will hit recursion limit on huge chains if Union by Rank is omitted. In deep graphs, use iterative find or set recursion limit.',
      },
      java: {
        importStmt: 'class UnionFind {\n    int[] parent;\n    int count;\n    UnionFind(int n) {\n        count = n;\n        parent = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n    }\n}',
        declaration: 'UnionFind uf = new UnionFind(n);',
        commonOps: [
          'int find(int x) {\n    if (parent[x] != x) parent[x] = find(parent[x]);\n    return parent[x];\n}',
          'boolean union(int x, int y) {\n    int rx = find(x), ry = find(y);\n    if (rx == ry) return false;\n    parent[rx] = ry;\n    count--;\n    return true;\n}',
        ],
        gotchaWarning: 'Notice `count--`: initializing count to N and decrementing on each successful union gives you the number of connected components for free!',
      },
      cpp: {
        importStmt: '#include <vector>\n#include <numeric>',
        declaration: 'std::vector<int> parent(n);\nstd::iota(parent.begin(), parent.end(), 0);',
        commonOps: [
          'int find(int x) {\n    return parent[x] == x ? x : parent[x] = find(parent[x]);\n}',
          'bool unite(int x, int y) {\n    int rx = find(x), ry = find(y);\n    if (rx == ry) return false;\n    parent[rx] = ry;\n    return true;\n}',
        ],
        gotchaWarning: 'The ternary one-liner `return parent[x] == x ? x : parent[x] = find(parent[x]);` is the fastest, cleanest way to write path compression in C++ interviews.',
      },
      typescript: {
        importStmt: '// Flat Array Union-Find',
        declaration: 'const parent: number[] = Array.from({ length: n }, (_, i) => i);',
        commonOps: [
          'function find(x: number): number {\n  if (parent[x] !== x) parent[x] = find(parent[x]);\n  return parent[x];\n}',
          'function union(x: number, y: number): boolean {\n  const rx = find(x), ry = find(y);\n  if (rx === ry) return false;\n  parent[rx] = ry;\n  return true;\n}',
        ],
        gotchaWarning: 'When items are strings (e.g. "Accounts Merge"), use a `Map<string, string>` instead of an integer array for the parent map.',
      },
      go: {
        importStmt: '// Go Union-Find slice',
        declaration: 'parent := make([]int, n)\nfor i := range parent { parent[i] = i }',
        commonOps: [
          'var find func(int) int\nfind = func(x int) int {\n    if parent[x] != x {\n        parent[x] = find(parent[x])\n    }\n    return parent[x]\n}',
        ],
        gotchaWarning: 'In Go, recursive closures require declaring the function variable before assigning its definition to allow self-recursion.',
      },
    },
  },
};
