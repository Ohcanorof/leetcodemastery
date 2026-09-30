export interface ComplexityInfo {
  operation: string;
  average: string;
  worst: string;
  notes: string;
}

export interface RealWorldExample {
  title: string;
  domain: string;
  description: string;
}

export interface LeetCodeBenchmark {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pattern: string;
  whyThisStructure: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DataStructureDetail {
  id: string;
  name: string;
  shortName: string;
  category: 'Linear' | 'Hash-Based' | 'Hierarchical' | 'Graph & Set';
  tagline: string;
  description: string;
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

export const DATA_STRUCTURES_DATA: DataStructureDetail[] = [
  {
    id: 'arrays',
    name: 'Arrays & Dynamic Arrays',
    shortName: 'Arrays',
    category: 'Linear',
    tagline: 'Contiguous memory blocks enabling O(1) random memory access.',
    description:
      'The array is the most fundamental data structure in computing. In physical RAM, elements are placed in contiguous memory addresses. This enables instant O(1) indexing via the address formula: Address(i) = BaseAddress + i * ElementSize. Dynamic arrays (like JavaScript Arrays, Python Lists, C++ Vectors) abstract away fixed-size limits by automatically doubling internal capacity when full.',
    memoryModel: {
      layout: 'Contiguous sequential RAM blocks.',
      cacheLocality: 'High',
      pointerOverhead: 'None (primitive values stored consecutively).',
      explanation:
        'Because elements reside in sequential physical RAM addresses, the CPU hardware prefetcher loads entire cache lines into L1/L2 cache, making sequential scans dramatically faster than pointer-based data structures.',
    },
    complexity: [
      { operation: 'Index Access', average: 'O(1)', worst: 'O(1)', notes: 'Direct memory pointer arithmetic.' },
      { operation: 'Append / Push', average: 'O(1) amortized', worst: 'O(N)', notes: 'O(N) only during array resizing/reallocation.' },
      { operation: 'Insert / Delete at Index', average: 'O(N)', worst: 'O(N)', notes: 'Requires shifting all subsequent elements.' },
      { operation: 'Search (Unsorted)', average: 'O(N)', worst: 'O(N)', notes: 'Linear scan.' },
      { operation: 'Search (Sorted)', average: 'O(log N)', worst: 'O(log N)', notes: 'Binary Search.' },
    ],
    realWorldApplications: [
      {
        title: 'CPU Cache Lines & Hardware Buffers',
        domain: 'Computer Architecture',
        description: 'CPUs fetch 64-byte contiguous memory blocks. Contiguous arrays maximize L1/L2 cache hits for high-performance graphics, physics engines, and game loops.',
      },
      {
        title: 'Video & Audio Streaming Buffers',
        domain: 'Multimedia Systems',
        description: 'Raw pixel frames and audio PCM samples are stored as flat byte arrays for direct memory access (DMA) by sound cards and GPUs.',
      },
      {
        title: 'Relational Database Column Stores',
        domain: 'Data Warehousing',
        description: 'Analytical engines like ClickHouse, Snowflake, and BigQuery store column data in dense arrays to perform SIMD vectorized queries across billions of rows.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'two-sum',
        title: 'Two Sum (#1)',
        difficulty: 'Easy',
        pattern: 'Two Pointers (when sorted) / Hash Map complement',
        whyThisStructure: 'Direct O(1) index access lets you scan left-to-right in single-pass pipelines.',
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water (#42)',
        difficulty: 'Hard',
        pattern: 'Two Pointers & Prefix Max Arrays',
        whyThisStructure: 'Array boundaries allow left and right pointers to converge inward while maintaining prefix max invariants.',
      },
      {
        id: 'merge-intervals',
        title: 'Merge Intervals (#56)',
        difficulty: 'Medium',
        pattern: 'Sorting + Linear Sweep',
        whyThisStructure: 'Sorting an array of pairs by start time transforms a 2D overlap problem into a single linear sweep.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `class DynamicArray<T> {
  private data: (T | undefined)[];
  private capacity: number;
  private length: number;

  constructor(initialCapacity = 4) {
    this.capacity = initialCapacity;
    this.length = 0;
    this.data = new Array(this.capacity);
  }

  public get(index: number): T {
    if (index < 0 || index >= this.length) throw new RangeError("Index out of bounds");
    return this.data[index]!;
  }

  public push(value: T): void {
    if (this.length === this.capacity) {
      this.resize(this.capacity * 2); // Doubling ensures O(1) amortized insertion
    }
    this.data[this.length++] = value;
  }

  private resize(newCapacity: number): void {
    const next = new Array(newCapacity);
    for (let i = 0; i < this.length; i++) {
      next[i] = this.data[i];
    }
    this.data = next;
    this.capacity = newCapacity;
  }
}`,
      keyTakeaway:
        'Resizing by doubling ensures that over N pushes, only ~2N copies occur. This yields an amortized O(1) push cost per element.',
    },
    youtubeQuery: 'dynamic array amortized analysis visual explanation',
    quiz: [
      {
        id: 'q1-arr',
        question: 'Why is inserting at index 0 of an array O(N), but appending at the end O(1) amortized?',
        options: [
          'Because index 0 is protected by operating system memory safeguards.',
          'Inserting at index 0 requires shifting every existing element one index to the right in physical memory.',
          'Appending requires re-calculating the hash code of the entire array.',
          'Memory can only be written in reverse order on modern x86 architectures.',
        ],
        correctIndex: 1,
        explanation:
          'Because arrays are stored contiguously, inserting an element at index 0 requires shifting all existing N elements to index i+1 to clear the first physical memory slot.',
      },
      {
        id: 'q2-arr',
        question: 'What is the primary hardware advantage of an Array over a Linked List when iterating through 1,000,000 numbers?',
        options: [
          'Arrays consume zero RAM bytes.',
          'CPUs can exploit spatial cache locality and hardware prefetching on contiguous memory.',
          'Arrays do not need garbage collection in any language.',
          'Linked Lists always suffer from stack overflow exceptions during iteration.',
        ],
        correctIndex: 1,
        explanation:
          'Because array elements are stored back-to-back in RAM, the CPU fetches entire cache lines (typically 64 bytes) at once, avoiding random pointer chasing that causes cache misses.',
      },
      {
        id: 'q3-arr',
        question: 'In a dynamic array with doubling resize strategy, what is the amortized cost per append operation?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
        correctIndex: 2,
        explanation:
          'Even though an occasional resize takes O(N), it happens exponentially less frequently (at powers of 2). Total copies for N elements is 1 + 2 + 4 + ... + N ≈ 2N, giving 2N/N = O(1) amortized time.',
      },
    ],
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists (Singly & Doubly)',
    shortName: 'Linked Lists',
    category: 'Linear',
    tagline: 'Dispersed heap nodes chained together via memory pointers.',
    description:
      'A Linked List is a linear collection where elements are individual nodes allocated anywhere in the heap. Each node contains a value and a pointer (or reference) to the next node (singly linked), or both next and previous nodes (doubly linked). Unlike arrays, linked lists can insert or remove nodes at the head or tail in strict O(1) time without shifting or resizing memory.',
    memoryModel: {
      layout: 'Scattered heap allocations connected by 64-bit pointers.',
      cacheLocality: 'Poor',
      pointerOverhead: '1 pointer per node (Singly: 8 bytes on 64-bit) or 2 pointers (Doubly: 16 bytes).',
      explanation:
        'Because nodes are allocated on the heap at arbitrary times, they rarely sit consecutively in physical RAM. Traversal requires "pointer-chasing", causing frequent CPU cache misses.',
    },
    complexity: [
      { operation: 'Prepend / Insert at Head', average: 'O(1)', worst: 'O(1)', notes: 'Just reassign head pointer.' },
      { operation: 'Append (with tail pointer)', average: 'O(1)', worst: 'O(1)', notes: 'Just reassign tail pointer.' },
      { operation: 'Access / Search by Index', average: 'O(N)', worst: 'O(N)', notes: 'Must traverse from head node by node.' },
      { operation: 'Delete Known Node (Doubly)', average: 'O(1)', worst: 'O(1)', notes: 'node.prev.next = node.next; node.next.prev = node.prev.' },
      { operation: 'Space Overhead', average: 'O(N)', worst: 'O(N)', notes: 'Each node carries 8-16 bytes of pointer metadata.' },
    ],
    realWorldApplications: [
      {
        title: 'LRU (Least Recently Used) Cache Eviction',
        domain: 'System Design & Operating Systems',
        description: 'Combined with a Hash Map, a Doubly Linked List enables moving recently accessed items to the front and evicting stale items from the tail in constant O(1) time.',
      },
      {
        title: 'Memory Allocators (Free Lists)',
        domain: 'OS Kernel & C Runtimes',
        description: 'Malloc/free implementations link unallocated heap blocks together in a free-list so the kernel can find and stitch memory blocks together.',
      },
      {
        title: 'Music Playlists & Undo/Redo Stacks',
        domain: 'Application Software',
        description: 'Doubly linked nodes enable instantaneous previous/next track traversal and insertion without shifting arrays.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List (#206)',
        difficulty: 'Easy',
        pattern: 'Three Pointers (prev, curr, next)',
        whyThisStructure: 'Reversing pointer directions in place achieves O(N) time with strictly O(1) auxiliary space.',
      },
      {
        id: 'linked-list-cycle',
        title: 'Linked List Cycle (#141)',
        difficulty: 'Easy',
        pattern: "Floyd's Tortoise and Hare (Slow/Fast Pointers)",
        whyThisStructure: 'Because nodes are linked in a directed chain, a fast pointer moving 2 steps and slow moving 1 step are guaranteed to intersect if a loop exists.',
      },
      {
        id: 'lru-cache',
        title: 'LRU Cache (#146)',
        difficulty: 'Medium',
        pattern: 'Hash Map + Doubly Linked List',
        whyThisStructure: 'The Doubly Linked List allows O(1) removal of any node from anywhere in the list once located by the Hash Map.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  prev: ListNode<T> | null = null;
  constructor(val: T) {
    this.value = val;
  }
}

class DoublyLinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;

  public prepend(val: T): ListNode<T> {
    const node = new ListNode(val);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    return node;
  }

  public removeNode(node: ListNode<T>): void {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;

    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;
  }
}`,
      keyTakeaway:
        'Always draw out pointer reassignments on paper: update the surrounding neighbors before severing the target node pointers to avoid losing references.',
    },
    youtubeQuery: 'doubly linked list LRU cache visual explanation',
    quiz: [
      {
        id: 'q1-ll',
        question: 'Why does a Doubly Linked List permit O(1) node deletion, whereas a Singly Linked List takes O(N) even if you have a reference to the target node?',
        options: [
          'A Singly Linked List has no node values.',
          'To delete a node in a Singly Linked List, you must find its preceding node (prev.next = target.next), which requires scanning from head.',
          'Doubly Linked Lists use binary search trees internally.',
          'CPUs prohibit deleting nodes with only one pointer.',
        ],
        correctIndex: 1,
        explanation:
          'In a singly linked list, you cannot traverse backward to update the previous node\'s next pointer without scanning from the head. Doubly linked nodes carry a direct "prev" pointer, making removal instant O(1).',
      },
      {
        id: 'q2-ll',
        question: "In Floyd's Cycle Detection Algorithm (Slow & Fast Pointers), why is the time complexity bounded by O(N)?",
        options: [
          'Because the fast pointer never wraps around.',
          'The relative distance between fast and slow decreases by exactly 1 step in each iteration once both enter the cycle.',
          'Because the list is automatically sorted before checking.',
          'Because cycles can only contain 2 nodes at most.',
        ],
        correctIndex: 1,
        explanation:
          'When both pointers enter the cycle of length C, the distance between them is at most C. Because fast moves 2 steps and slow moves 1 step, the gap closes by 1 step every turn, guaranteeing an intersection within C iterations.',
      },
    ],
  },
  {
    id: 'hash-tables',
    name: 'Hash Tables & Hash Maps',
    shortName: 'Hash Maps',
    category: 'Hash-Based',
    tagline: 'Transforms arbitrary keys into bucket indices via a hash function for O(1) average lookup.',
    description:
      'A Hash Table maps keys to values using a mathematical hash function: Index = Hash(Key) % Capacity. It provides expected O(1) insertion, deletion, and lookup. When two keys hash to the same bucket index (a collision), the table resolves it using Chaining (linked lists or balanced trees in each bucket) or Open Addressing (probing next available slots).',
    memoryModel: {
      layout: 'Array of bucket pointers pointing to linked chains or flat open-addressed slots.',
      cacheLocality: 'Moderate to Poor (chaining incurs heap dereferencing; open addressing improves locality).',
      pointerOverhead: 'Requires bucket array allocation + collision chain nodes.',
      explanation:
        'To maintain O(1) performance, hash tables maintain a Load Factor (items / capacity, typically 0.75). When exceeded, the table allocates a new array double the size and re-hashes all entries.',
    },
    complexity: [
      { operation: 'Key Lookup / Get', average: 'O(1)', worst: 'O(N)', notes: 'Worst case O(N) when all keys collide into one bucket (mitigated by Red-Black trees in Java 8+ to O(log N)).' },
      { operation: 'Key Insert / Put', average: 'O(1)', worst: 'O(N)', notes: 'Amortized O(1); O(N) only during rehash resizing.' },
      { operation: 'Key Delete', average: 'O(1)', worst: 'O(N)', notes: 'Direct bucket lookup + chain unlink.' },
      { operation: 'Space Complexity', average: 'O(N)', worst: 'O(N)', notes: 'Includes empty bucket slots to keep load factor low.' },
    ],
    realWorldApplications: [
      {
        title: 'Redis & Memcached Key-Value Stores',
        domain: 'Distributed Caching',
        description: 'Powers sub-millisecond data caching across web fleets by hashing string keys directly to memory addresses.',
      },
      {
        title: 'Database Hash Indexes',
        domain: 'Databases (PostgreSQL, MySQL)',
        description: 'Used for exact equality matches (WHERE id = 42), bypassing B-Tree traversal for constant-time lookups.',
      },
      {
        title: 'JavaScript Object Property Lookups & V8 Hidden Classes',
        domain: 'Compiler Runtimes',
        description: 'V8 uses hash tables under the hood for dynamic object properties and global scope lookups.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'two-sum-hm',
        title: 'Two Sum (#1)',
        difficulty: 'Easy',
        pattern: 'Complement Lookup (Single Pass)',
        whyThisStructure: 'Replaces an O(N^2) double loop with O(1) instant queries for (target - num).',
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams (#49)',
        difficulty: 'Medium',
        pattern: 'Canonical Key Hashing',
        whyThisStructure: 'Sorting the word or counting letter frequencies produces a canonical string key used to group words in O(1) bucket inserts.',
      },
      {
        id: 'subarray-sum-equals-k',
        title: 'Subarray Sum Equals K (#560)',
        difficulty: 'Medium',
        pattern: 'Prefix Sum + Hash Map Frequency',
        whyThisStructure: 'Stores prefix sum frequencies so that (currentSum - k) can be queried in O(1) time without nested subarray summation.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `class SimpleHashMap<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private capacity: number;
  private size: number = 0;

  constructor(capacity = 16) {
    this.capacity = capacity;
    this.buckets = Array.from({ length: capacity }, () => []);
  }

  private hash(key: K): number {
    const str = String(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash % this.capacity;
  }

  public set(key: K, value: V): void {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    for (let entry of bucket) {
      if (entry[0] === key) {
        entry[1] = value;
        return;
      }
    }
    bucket.push([key, value]);
    this.size++;
  }

  public get(key: K): V | undefined {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    for (let entry of bucket) {
      if (entry[0] === key) return entry[1];
    }
    return undefined;
  }
}`,
      keyTakeaway:
        'A good hash function distributes keys uniformly across all buckets, minimizing collision chain lengths to average length < 2.',
    },
    youtubeQuery: 'how hash maps work under the hood collision resolution chaining visual',
    quiz: [
      {
        id: 'q1-hm',
        question: 'What is a "Collision" in a Hash Table and how is it most commonly resolved?',
        options: [
          'When two computers access the same RAM address; resolved by rebooting.',
          'When two different keys generate the same bucket index; resolved via separate chaining (linked list / tree) or open addressing.',
          'When an array runs out of memory; resolved by garbage collection.',
          'When numbers are negative; resolved by taking absolute values.',
        ],
        correctIndex: 1,
        explanation:
          'Because the key space is infinite and table capacity is finite, the pigeonhole principle guarantees collisions. Chaining stores colliding entries in a list/tree attached to that bucket.',
      },
      {
        id: 'q2-hm',
        question: 'Why do modern production Hash Maps (like Java 8 HashMap) convert bucket chains from Linked Lists to Red-Black Trees when chain size exceeds 8?',
        options: [
          'To save RAM bytes on small buckets.',
          'To prevent worst-case O(N) hash collision Denial-of-Service (DoS) attacks by guaranteeing O(log N) lookup.',
          'Because linked lists are deprecated in modern Java.',
          'To enable multithreaded writes without mutexes.',
        ],
        correctIndex: 1,
        explanation:
          'Attackers can craft inputs that intentionally collide into the same bucket, turning O(1) operations into slow O(N) scans. Converting long chains into balanced trees bounds the worst-case lookup to O(log N).',
      },
    ],
  },
  {
    id: 'stacks',
    name: 'Stacks & Monotonic Stacks',
    shortName: 'Stacks',
    category: 'Linear',
    tagline: 'LIFO (Last-In, First-Out) discipline; Monotonic Stacks maintain ordered invariants for O(N) next-greater element.',
    description:
      'A Stack enforces Last-In, First-Out (LIFO) access: elements are pushed onto the top and popped from the top. A Monotonic Stack is an advanced variant where elements are strictly kept in increasing or decreasing order by popping elements that violate the monotonic invariant upon insertion. This unlocks O(N) solutions for next-greater/smaller element problems.',
    memoryModel: {
      layout: 'Typically implemented over a dynamic array (vector) with top pointer.',
      cacheLocality: 'High',
      pointerOverhead: 'None when backed by an array.',
      explanation:
        'Operations occur exclusively at the tail of the array, meaning cache lines at the active stack frame stay warm in CPU L1 cache.',
    },
    complexity: [
      { operation: 'Push', average: 'O(1)', worst: 'O(1)', notes: 'Insert at top.' },
      { operation: 'Pop', average: 'O(1)', worst: 'O(1)', notes: 'Remove from top.' },
      { operation: 'Peek / Top', average: 'O(1)', worst: 'O(1)', notes: 'Inspect top element.' },
      { operation: 'Monotonic Stack Pass (over array of size N)', average: 'O(N)', worst: 'O(N)', notes: 'Each element is pushed once and popped at most once.' },
    ],
    realWorldApplications: [
      {
        title: 'CPU Call Stack & Recursion',
        domain: 'Computer Architecture & OS',
        description: 'Every function call pushes a stack frame (return address, local variables); returning pops the frame.',
      },
      {
        title: 'Browser History & Text Editor Undo / Redo',
        domain: 'Desktop & Web Applications',
        description: 'Two stacks (Undo stack and Redo stack) model reversible user state changes with O(1) state transitions.',
      },
      {
        title: 'Compiler Syntax Parsing & AST Evaluation',
        domain: 'Compilers (Babel, GCC)',
        description: 'Used by Shift-Reduce and Dijkstra Shunting-Yard algorithms to parse arithmetic expressions and balanced parentheses.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses (#20)',
        difficulty: 'Easy',
        pattern: 'LIFO Matching',
        whyThisStructure: 'The most recently opened bracket must be the first one closed, fitting LIFO mechanics perfectly.',
      },
      {
        id: 'daily-temperatures',
        title: 'Daily Temperatures (#739)',
        difficulty: 'Medium',
        pattern: 'Monotonic Decreasing Stack',
        whyThisStructure: 'Stack holds indices of unresolved cold days; when a warmer day arrives, it pops colder days, recording the difference in O(N) time.',
      },
      {
        id: 'largest-rectangle-histogram',
        title: 'Largest Rectangle in Histogram (#84)',
        difficulty: 'Hard',
        pattern: 'Monotonic Increasing Stack',
        whyThisStructure: 'Maintains ascending bar heights; popping a bar identifies both its left and right limiting boundaries in O(N).',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Monotonic Decreasing Stack for Next Greater Element
function nextGreaterElements(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = []; // Stores INDICES, keeping nums[index] descending

  for (let i = 0; i < nums.length; i++) {
    // While current element is greater than stack top, we found their next greater!
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const smallerIdx = stack.pop()!;
      result[smallerIdx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}`,
      keyTakeaway:
        'Store INDICES on the stack rather than raw values, so you can measure spans, distances, and update the output array directly.',
    },
    youtubeQuery: 'monotonic stack pattern explained visually leetcode',
    quiz: [
      {
        id: 'q1-stk',
        question: 'Why is the total time complexity of running a Monotonic Stack across an array of length N strictly O(N), even though there is a nested while loop?',
        options: [
          'Because arrays are limited to 1000 items in interviews.',
          'Each element is pushed onto the stack exactly once and popped at most once over the entire execution (amortized 2 operations per item).',
          'Because the while loop only runs if the CPU has multiple cores.',
          'The compiler unrolls the loop into O(1) assembly instructions.',
        ],
        correctIndex: 1,
        explanation:
          'This is classic amortized analysis: across the whole loop, there are N total pushes and at most N total pops. Sum of work is 2N = O(N).',
      },
      {
        id: 'q2-stk',
        question: 'When parsing balanced parentheses "( [ { } ] )", what indicates an immediate syntax violation?',
        options: [
          'If the string length is even.',
          'Popping from an empty stack when encountering a closing bracket, or closing bracket not matching the popped opening bracket.',
          'Having more than 3 distinct bracket characters.',
          'Traversing from right to left.',
        ],
        correctIndex: 1,
        explanation:
          'If you see a closing bracket when the stack is empty, there was no matching opener. If the top of the stack does not match the closing type, the nesting order was violated.',
      },
    ],
  },
  {
    id: 'queues-deques',
    name: 'Queues & Deques (Double-Ended)',
    shortName: 'Queues & Deques',
    category: 'Linear',
    tagline: 'FIFO (First-In, First-Out) discipline & Deques with O(1) operations at both boundaries.',
    description:
      'A Queue enforces First-In, First-Out (FIFO) processing: items are enqueued at the back and dequeued from the front. It is the engine of Breadth-First Search (BFS). A Deque (Double-Ended Queue) generalizes this by allowing O(1) push and pop at both head and tail. Deques are the secret weapon for the Sliding Window Maximum problem.',
    memoryModel: {
      layout: 'Circular ring buffer or doubly linked list.',
      cacheLocality: 'Moderate to High (ring buffers retain contiguous array cache benefits).',
      pointerOverhead: 'Low in ring buffers; 16 bytes/node in linked lists.',
      explanation:
        'A circular ring buffer avoids shifting elements on dequeue by using head and tail pointer offsets wrapped with modulo: nextHead = (head + 1) % capacity.',
    },
    complexity: [
      { operation: 'Enqueue / Push Back', average: 'O(1)', worst: 'O(1)', notes: 'Insert at tail.' },
      { operation: 'Dequeue / Pop Front', average: 'O(1)', worst: 'O(1)', notes: 'Remove from head.' },
      { operation: 'Deque Push/Pop Front & Back', average: 'O(1)', worst: 'O(1)', notes: 'Double-ended constant time.' },
      { operation: 'Search', average: 'O(N)', worst: 'O(N)', notes: 'Requires sequential scan.' },
    ],
    realWorldApplications: [
      {
        title: 'Task & Message Brokers (Kafka, RabbitMQ, SQS)',
        domain: 'Cloud Infrastructure',
        description: 'Orders asynchronous tasks so workers consume background jobs in guaranteed fair chronological sequence.',
      },
      {
        title: 'Print Spoolers & Web Server Connection Backlogs',
        domain: 'Operating Systems & Networking',
        description: 'Incoming TCP socket connections wait in the OS listen queue until accept() handles them.',
      },
      {
        title: 'Rate Limiters (Sliding Window Log)',
        domain: 'API Gateways',
        description: 'Deques store timestamps of recent requests, popping timestamps older than 60 seconds from the front in O(1) time.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'binary-tree-level-order',
        title: 'Binary Tree Level Order Traversal (#102)',
        difficulty: 'Medium',
        pattern: 'Breadth-First Search (BFS)',
        whyThisStructure: 'The queue guarantees that all nodes at level d are visited before any node at level d+1 is processed.',
      },
      {
        id: 'sliding-window-maximum',
        title: 'Sliding Window Maximum (#239)',
        difficulty: 'Hard',
        pattern: 'Monotonic Decreasing Deque',
        whyThisStructure: 'The deque stores candidate indices in descending order, letting you read the window max in O(1) from the front while evicting expired elements.',
      },
      {
        id: 'rotting-oranges',
        title: 'Rotting Oranges (#994)',
        difficulty: 'Medium',
        pattern: 'Multi-Source BFS',
        whyThisStructure: 'Initial rotten oranges are enqueued at time 0; queue propagation simulates simultaneous real-time infection minute by minute.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Circular Ring Buffer Queue for optimal O(1) operations
class CircularQueue<T> {
  private buffer: (T | undefined)[];
  private head = 0;
  private tail = 0;
  private count = 0;
  private capacity: number;

  constructor(capacity = 8) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  public enqueue(val: T): boolean {
    if (this.count === this.capacity) return false; // Buffer full
    this.buffer[this.tail] = val;
    this.tail = (this.tail + 1) % this.capacity;
    this.count++;
    return true;
  }

  public dequeue(): T | undefined {
    if (this.count === 0) return undefined; // Empty
    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return item;
  }
}`,
      keyTakeaway:
        'Never use JavaScript array.shift() in performance-critical code: shift() takes O(N) because it moves every remaining item in memory.',
    },
    youtubeQuery: 'sliding window maximum deque monotonic visual leetcode 239',
    quiz: [
      {
        id: 'q1-q',
        question: 'Why does naive JavaScript array `arr.shift()` make a BFS algorithm slow in high-volume interview problems?',
        options: [
          'Because JS arrays are converted to linked lists when shifted.',
          '`arr.shift()` shifts all remaining N-1 elements in physical memory, degrading BFS from O(V + E) to O(V^2).',
          'Because `shift()` triggers a garbage collection pause on every call.',
          '`shift()` re-sorts the array alphabetically.',
        ],
        correctIndex: 1,
        explanation:
          'In JavaScript, standard array `shift()` is O(N) because it moves elements to index i-1. Doing this V times inside BFS turns a linear traversal into quadratic O(V^2). Use pointer indexing or a real queue class.',
      },
    ],
  },
  {
    id: 'trees-bst',
    name: 'Binary Trees & Binary Search Trees (BST)',
    shortName: 'Trees & BST',
    category: 'Hierarchical',
    tagline: 'Hierarchical node branching; BST enforces Left < Root < Right for O(log N) search.',
    description:
      'A Tree represents hierarchical relationships where each node has zero or more child nodes. A Binary Tree restricts each node to at most two children (left and right). A Binary Search Tree (BST) adds the strict ordering invariant: all keys in the left subtree are strictly smaller than the node, and all keys in the right subtree are strictly greater. Inorder traversal of a BST yields elements in sorted order.',
    memoryModel: {
      layout: 'Heap-allocated nodes containing value and left/right child pointers.',
      cacheLocality: 'Poor',
      pointerOverhead: '2 pointers per node (16 bytes on 64-bit platforms).',
      explanation:
        'Recursive traversal pushes execution frames to the call stack equal to tree height H. For balanced trees H = O(log N); for degenerate skewed trees H = O(N).',
    },
    complexity: [
      { operation: 'BST Search (Balanced)', average: 'O(log N)', worst: 'O(N)', notes: 'Worst case O(N) if inserted in sorted order forming a linked list line.' },
      { operation: 'BST Insert (Balanced)', average: 'O(log N)', worst: 'O(N)', notes: 'Follows search path to null leaf.' },
      { operation: 'BST Delete (Balanced)', average: 'O(log N)', worst: 'O(N)', notes: 'Replaces with inorder predecessor or successor.' },
      { operation: 'Tree Traversal (DFS/BFS)', average: 'O(N)', worst: 'O(N)', notes: 'Visits every node exactly once.' },
    ],
    realWorldApplications: [
      {
        title: 'DOM (Document Object Model) in Browsers',
        domain: 'Web Engines (Blink, Gecko)',
        description: 'HTML elements form an n-ary tree structure used for CSS styling cascades and event bubbling/capturing.',
      },
      {
        title: 'File System Directories',
        domain: 'Operating Systems',
        description: 'Folders and files naturally branch in a hierarchical tree from the root directory (/ or C:\\).',
      },
      {
        title: 'Database B-Trees & B+ Trees',
        domain: 'Database Engines (InnoDB, Postgres)',
        description: 'Multi-way balanced search trees keep secondary indexes balanced on disk with high fanout for minimal I/O reads.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'validate-bst',
        title: 'Validate Binary Search Tree (#98)',
        difficulty: 'Medium',
        pattern: 'DFS with Min/Max Bounds Invariant',
        whyThisStructure: 'Every node must satisfy min < node.val < max throughout the entire subtree hierarchy, not just against its immediate parent.',
      },
      {
        id: 'lowest-common-ancestor-bst',
        title: 'Lowest Common Ancestor of a BST (#235)',
        difficulty: 'Medium',
        pattern: 'BST Branch Pruning',
        whyThisStructure: 'If both p and q are smaller than root, walk left; if both greater, walk right; the split point is the LCA in O(log N).',
      },
      {
        id: 'diameter-of-binary-tree',
        title: 'Diameter of Binary Tree (#543)',
        difficulty: 'Easy',
        pattern: 'Post-order DFS (Bottom-Up Depth)',
        whyThisStructure: 'Post-order recursion computes the height of left and right subtrees to update the global longest path through any node.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

function isValidBST(root: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;

  // Left subtree must be < root.val; Right subtree must be > root.val
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
      keyTakeaway:
        'In BST validation, checking only `node.left.val < node.val` is a classic bug: you must pass down strict global min/max boundaries.',
    },
    youtubeQuery: 'validate binary search tree invariant visual dfs leetcode 98',
    quiz: [
      {
        id: 'q1-bst',
        question: 'Why does an unbalanced BST degrade from O(log N) to O(N) when inserting sorted numbers [1, 2, 3, 4, 5]?',
        options: [
          'Because numbers exceed memory limits.',
          'Each new item is greater than the previous, creating a single right-skewed branch equivalent to a linked list.',
          'The tree runs out of pointers.',
          'Inorder traversal refuses to run on sorted inputs.',
        ],
        correctIndex: 1,
        explanation:
          'Inserting sorted data into a standard BST without self-balancing rotations causes every node to become the right child of the previous node, transforming the tree into a linked list of height N.',
      },
    ],
  },
  {
    id: 'heaps',
    name: 'Heaps & Priority Queues',
    shortName: 'Heaps & PQ',
    category: 'Hierarchical',
    tagline: 'Complete binary tree packed into a 1D array providing O(1) min/max retrieval and O(log N) insertion.',
    description:
      'A Binary Heap is a complete binary tree that satisfies the Heap Property: in a Min-Heap, every parent node is smaller than or equal to its children (root is the minimum). Crucially, a binary heap does NOT require pointers—it is stored contiguously in a flat array where parent(i) = floor((i-1)/2), left(i) = 2i + 1, right(i) = 2i + 2. A Priority Queue is the abstract data type typically implemented via a heap.',
    memoryModel: {
      layout: 'Flat contiguous 1D array representing a complete binary tree.',
      cacheLocality: 'High (contiguous RAM array).',
      pointerOverhead: 'Zero (child/parent relationships computed mathematically via index arithmetic).',
      explanation:
        'Because a complete binary tree has no missing leaves except possibly on the bottom right, it packs densely into an array with zero wasted slots and zero pointers.',
    },
    complexity: [
      { operation: 'Get Min / Peek', average: 'O(1)', worst: 'O(1)', notes: 'Root element is at index 0.' },
      { operation: 'Insert / Push (siftUp)', average: 'O(log N)', worst: 'O(log N)', notes: 'Swaps upward along tree height.' },
      { operation: 'Extract Min / Pop (siftDown)', average: 'O(log N)', worst: 'O(log N)', notes: 'Moves last leaf to root, then bubbles downward.' },
      { operation: 'Build Heap (Heapify)', average: 'O(N)', worst: 'O(N)', notes: 'Mathematical bottom-up summation converges to linear O(N).' },
    ],
    realWorldApplications: [
      {
        title: 'OS Process & CPU Schedulers',
        domain: 'Operating Systems',
        description: 'The Linux Completely Fair Scheduler (CFS) and real-time task queues use priority heaps to pick the next highest-priority process in O(1) time.',
      },
      {
        title: 'Dijkstra & Prim Shortest Path Algorithms',
        domain: 'Networking & GPS Navigation',
        description: 'Priority Queues allow greedy extraction of the closest unvisited graph node in O(log V) time.',
      },
      {
        title: 'Event-Driven Simulations & Timer Loops',
        domain: 'Game Engines & Node.js Event Loop',
        description: 'Timers (like setTimeout) are ordered by target expiration timestamp in a min-heap so the runtime wakes up exactly when the next timer fires.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'kth-largest-element-arr',
        title: 'Kth Largest Element in an Array (#215)',
        difficulty: 'Medium',
        pattern: 'Min-Heap of Size K',
        whyThisStructure: 'Keeping a Min-Heap of size K ensures the top always holds the Kth largest element in O(N log K) time and O(K) memory.',
      },
      {
        id: 'merge-k-sorted-lists',
        title: 'Merge K Sorted Lists (#23)',
        difficulty: 'Hard',
        pattern: 'Min-Heap Multiway Merge',
        whyThisStructure: 'The heap compares the heads of all K lists simultaneously in O(log K) per node, merging N total nodes in O(N log K).',
      },
      {
        id: 'find-median-from-data-stream',
        title: 'Find Median from Data Stream (#295)',
        difficulty: 'Hard',
        pattern: 'Two Heaps (Max-Heap + Min-Heap)',
        whyThisStructure: 'Splitting numbers into lower half (Max-Heap) and upper half (Min-Heap) provides O(1) median retrieval and O(log N) stream updates.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `class MinHeap {
  private data: number[] = [];

  public peek(): number | undefined { return this.data[0]; }
  public size(): number { return this.data.length; }

  public push(val: number): void {
    this.data.push(val);
    this.bubbleUp(this.data.length - 1);
  }

  public pop(): number | undefined {
    if (this.data.length === 0) return undefined;
    const min = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[i] >= this.data[parent]) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.data.length;
    while (2 * i + 1 < n) {
      let smallest = 2 * i + 1;
      const right = smallest + 1;
      if (right < n && this.data[right] < this.data[smallest]) smallest = right;
      if (this.data[i] <= this.data[smallest]) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}`,
      keyTakeaway:
        'To find the Kth LARGEST item, maintain a MIN-heap of size K. When full, pop the minimum; the remaining root is the Kth largest.',
    },
    youtubeQuery: 'heap data structure priority queue heapify explained visually',
    quiz: [
      {
        id: 'q1-heap',
        question: 'Why do we use a MIN-heap of size K (instead of a MAX-heap) to find the Kth largest element in an array of 1,000,000 numbers?',
        options: [
          'Min-heaps sort strings faster than max-heaps.',
          'A Min-heap of size K discards smaller elements whenever size > K. Its top element is always the minimum of the top K largest, which is the Kth largest overall.',
          'Max-heaps cannot be stored in arrays.',
          'Min-heaps take O(1) space regardless of K.',
        ],
        correctIndex: 1,
        explanation:
          'If you keep the top K largest elements in a Min-Heap, the root is the smallest among those top K, which by definition is the Kth largest. Memory stays bounded at O(K) rather than O(N).',
      },
    ],
  },
  {
    id: 'graphs',
    name: 'Graphs (Adjacency List & DAGs)',
    shortName: 'Graphs',
    category: 'Graph & Set',
    tagline: 'Networks of vertices connected by edges; models dependencies, paths, and flow.',
    description:
      'A Graph consists of vertices (nodes) and edges (connections, which can be directed or undirected, weighted or unweighted). In technical interviews, graphs are almost always represented via an Adjacency List: a map from each vertex to the list of its neighbors. A Directed Acyclic Graph (DAG) has directed edges with no cycles, allowing Topological Sorting (Kahn’s algorithm).',
    memoryModel: {
      layout: 'Array or Hash Map of neighbor arrays/lists: Map<Vertex, Vertex[]>.',
      cacheLocality: 'Moderate.',
      pointerOverhead: 'Proportional to number of edges E.',
      explanation:
        'Adjacency lists use O(V + E) memory, whereas an Adjacency Matrix uses O(V^2) memory (inefficient for sparse interview graphs).',
    },
    complexity: [
      { operation: 'Space Complexity', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Adjacency list stores V vertices and E edge links.' },
      { operation: 'BFS (Breadth-First Search)', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Shortest path on unweighted graph.' },
      { operation: 'DFS (Depth-First Search)', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Cycle detection, connected components.' },
      { operation: 'Topological Sort (Kahn’s / DFS)', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Linear ordering of DAG dependencies.' },
      { operation: 'Dijkstra (with Min-Heap)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', notes: 'Shortest path on positive weighted edges.' },
    ],
    realWorldApplications: [
      {
        title: 'Package Managers & Build Systems (npm, Webpack, Bazel)',
        domain: 'DevOps & Tooling',
        description: 'Dependencies form a DAG. Topological sort determines the exact compilation order so libraries compile before dependents.',
      },
      {
        title: 'Git Version Control (Commit DAG)',
        domain: 'Developer Tools',
        description: 'Git commits are immutable nodes in a Directed Acyclic Graph with parent hashes, enabling branch merging and 3-way diffs.',
      },
      {
        title: 'Social Networks & Friend Recommendation',
        domain: 'Social Platforms',
        description: 'Users are vertices and follow/friend connections are edges. Bidirectional BFS discovers shortest mutual friend paths.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'course-schedule',
        title: 'Course Schedule (#207)',
        difficulty: 'Medium',
        pattern: 'Topological Sort / Cycle Detection in DAG',
        whyThisStructure: 'Using an in-degree array + adjacency list reveals whether a cycle exists preventing course completion.',
      },
      {
        id: 'clone-graph',
        title: 'Clone Graph (#133)',
        difficulty: 'Medium',
        pattern: 'Graph DFS/BFS + Visited Hash Map',
        whyThisStructure: 'A Hash Map mapping oldNode -> newNode prevents infinite loops on cyclic edges while copying connections.',
      },
      {
        id: 'network-delay-time',
        title: 'Network Delay Time (#743)',
        difficulty: 'Medium',
        pattern: 'Dijkstra with Priority Queue',
        whyThisStructure: 'Propagates shortest signal latency across weighted network nodes.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Kahn's Algorithm for Topological Sort on a DAG
function canFinishCourses(numCourses: number, prerequisites: [number, number][]): boolean {
  const adj = Array.from({ length: numCourses }, () => [] as number[]);
  const inDegree = new Array(numCourses).fill(0);

  // Build Adjacency List: [course, prereq] means prereq -> course
  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }

  // Enqueue courses with zero prerequisites
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let visitedCount = 0;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    visitedCount++;
    for (const neighbor of adj[curr]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }

  return visitedCount === numCourses; // If visited < numCourses, a cycle exists!
}`,
      keyTakeaway:
        'In Kahn’s algorithm, if the total processed count is less than V, the remaining vertices are locked in a cycle.',
    },
    youtubeQuery: 'kahns algorithm topological sort cycle detection visual leetcode',
    quiz: [
      {
        id: 'q1-grp',
        question: 'Why is an Adjacency List preferred over an Adjacency Matrix (V x V) in most LeetCode interview problems?',
        options: [
          'Matrices cannot store negative edge weights.',
          'Most real-world and interview graphs are sparse (E << V^2); an adjacency list uses O(V + E) space, whereas a matrix wastes O(V^2) space.',
          'Matrices crash JavaScript garbage collection.',
          'Adjacency lists are automatically sorted by distance.',
        ],
        correctIndex: 1,
        explanation:
          'If V = 100,000 and each node has 3 edges, an adjacency matrix allocates 10 billion entries (OutOfMemory error), whereas an adjacency list uses only ~400,000 entries.',
      },
    ],
  },
  {
    id: 'tries',
    name: 'Tries (Prefix Trees)',
    shortName: 'Tries',
    category: 'Hierarchical',
    tagline: 'Tree specialized for string retrieval where edges represent characters, enabling O(L) prefix searches.',
    description:
      'A Trie (pronounced "try", from retrieval) is an n-ary tree where each node represents a character step. Strings sharing a common prefix share the same ancestor path in the tree. This allows searching for any string or prefix of length L in strict O(L) time—completely independent of how many millions of words are stored in the dictionary.',
    memoryModel: {
      layout: 'Node containing an array/map of child pointers (size 26 for lowercase English) and an isEndOfWord boolean flag.',
      cacheLocality: 'Moderate to Poor (pointer dereference per character).',
      pointerOverhead: '26 pointers per node when using a fixed array (can use hash map to save space on sparse alphabets).',
      explanation:
        'Memory is traded for speed. If 1,000 words begin with "inter", the 5-character prefix path is stored only once in memory.',
    },
    complexity: [
      { operation: 'Insert Word of length L', average: 'O(L)', worst: 'O(L)', notes: 'Traverse/create L child nodes.' },
      { operation: 'Search Exact Word', average: 'O(L)', worst: 'O(L)', notes: 'Follow character links and check isEndOfWord.' },
      { operation: 'Search Prefix (startsWith)', average: 'O(L)', worst: 'O(L)', notes: 'Follow character links; does not need isEndOfWord.' },
      { operation: 'Space Complexity', average: 'O(Total Chars * Alphabet Size)', worst: 'O(N * L)', notes: 'Shared prefixes collapse redundant memory.' },
    ],
    realWorldApplications: [
      {
        title: 'Search Engine & Browser URL Autocomplete',
        domain: 'Search & Browsers',
        description: 'When you type "lea...", a Trie instantly traverses to node "a" and traverses the subtree to yield suggestions in milliseconds.',
      },
      {
        title: 'IP Routing (Longest Prefix Matching)',
        domain: 'Networking Hardware',
        description: 'Internet routers store routing tables as binary tries (Radix trees) to match IP addresses against subnet masks at line-rate speed.',
      },
      {
        title: 'Spell Checkers & Predictive Keyboard Engines',
        domain: 'Mobile OS (iOS, Android)',
        description: 'Validates typed dictionary words and proposes 1-edit distance corrections using Trie DFS.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'implement-trie',
        title: 'Implement Trie (Prefix Tree) (#208)',
        difficulty: 'Medium',
        pattern: 'Trie Node Architecture',
        whyThisStructure: 'Demonstrates core insert, search, and startsWith methods in O(L) time.',
      },
      {
        id: 'word-search-ii',
        title: 'Word Search II (#212)',
        difficulty: 'Hard',
        pattern: 'Grid Backtracking + Trie Pruning',
        whyThisStructure: 'Putting words in a Trie allows backtracking to prune grid paths immediately as soon as the current letter sequence is not a prefix in the Trie.',
      },
      {
        id: 'maximum-xor-two-numbers',
        title: 'Maximum XOR of Two Numbers in an Array (#421)',
        difficulty: 'Medium',
        pattern: 'Binary Bitwise Trie',
        whyThisStructure: 'Storing numbers bit-by-bit (0 and 1 branches) allows greedy selection of opposite bits to maximize the XOR sum in O(32N).',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
}

class Trie {
  private root = new TrieNode();

  public insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isEndOfWord = true;
  }

  public startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return true; // Entire prefix found
  }
}`,
      keyTakeaway:
        'A Trie search time O(L) depends solely on the length of the query word L, completely invariant to whether the dictionary has 10 words or 10,000,000 words.',
    },
    youtubeQuery: 'trie prefix tree data structure explained visually leetcode 208',
    quiz: [
      {
        id: 'q1-trie',
        question: 'Why is a Trie faster than a Hash Set when checking if ANY word in a 1,000,000-word dictionary begins with prefix "app"?',
        options: [
          'A Hash Set cannot store strings.',
          'A Hash Set cannot search prefixes without scanning all N words (O(N * L)), whereas a Trie walks directly to "a" -> "p" -> "p" in O(L) time.',
          'Tries encrypt strings to bypass CPU caches.',
          'A Hash Set requires sorting words alphabetically.',
        ],
        correctIndex: 1,
        explanation:
          'Hash tables only support exact key matches. Checking prefixes in a Hash Set requires scanning through all keys, whereas a Trie walks down the prefix path in exactly L operations.',
      },
    ],
  },
  {
    id: 'union-find',
    name: 'Disjoint Set Union (Union-Find / DSU)',
    shortName: 'Union-Find',
    category: 'Graph & Set',
    tagline: 'Near-constant O(α(N)) operations to merge sets and detect connected components.',
    description:
      'Disjoint Set Union (DSU) partitions N elements into disjoint (non-overlapping) sets. It supports two primary operations: find(x) to identify the representative root of x’s set, and union(x, y) to merge the sets containing x and y. With Path Compression and Union by Rank, operations run in virtually O(1) time (Inverse Ackermann function α(N) ≤ 4 for all practical universe sizes).',
    memoryModel: {
      layout: 'Two flat integer arrays: parent[] and rank[] (or size[]).',
      cacheLocality: 'High (flat contiguous arrays).',
      pointerOverhead: 'None (represented as integer parent indices).',
      explanation:
        'Because elements are indexed 0..N-1, both parent and rank arrays sit in contiguous memory with zero node object allocations.',
    },
    complexity: [
      { operation: 'Find (with Path Compression)', average: 'O(α(N)) ≈ O(1)', worst: 'O(α(N))', notes: 'Points all visited nodes directly to the root.' },
      { operation: 'Union (by Rank/Size)', average: 'O(α(N)) ≈ O(1)', worst: 'O(α(N))', notes: 'Attaches the shallower tree under the deeper tree.' },
      { operation: 'Space Complexity', average: 'O(N)', worst: 'O(N)', notes: 'Stores parent[] and rank[] arrays.' },
    ],
    realWorldApplications: [
      {
        title: "Kruskal's Minimum Spanning Tree (MST)",
        domain: 'Network & Circuit Design',
        description: 'Sorts all edges by weight and uses DSU to greedily connect components without introducing cycles.',
      },
      {
        title: 'Image Processing (Connected Component Labeling)',
        domain: 'Computer Vision',
        description: 'Groups neighboring foreground pixels of binary images into discrete blobs or objects.',
      },
      {
        title: 'Social Network Island Detection',
        domain: 'Social Graph Analysis',
        description: 'Tracks isolated clusters of connected users dynamically as new friendships form.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'number-of-islands-dsu',
        title: 'Number of Connected Components (#323) / Number of Provinces (#547)',
        difficulty: 'Medium',
        pattern: 'Dynamic Connectivity',
        whyThisStructure: 'Directly counts remaining disjoint roots after processing all edges.',
      },
      {
        id: 'redundant-connection',
        title: 'Redundant Connection (#684)',
        difficulty: 'Medium',
        pattern: 'Cycle Detection in Undirected Graph',
        whyThisStructure: 'If find(u) === find(v) before adding an edge, the edge creates a cycle and is redundant.',
      },
      {
        id: 'accounts-merge',
        title: 'Accounts Merge (#721)',
        difficulty: 'Medium',
        pattern: 'Email Equivalence Clustering',
        whyThisStructure: 'Unions all emails belonging to the same user name and groups connected email sets.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `class UnionFind {
  private parent: number[];
  private rank: number[];
  public count: number;

  constructor(size: number) {
    this.count = size;
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  // Find with Path Compression: flattens the tree structure on each lookup
  public find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // Union by Rank: attaches shorter tree under the taller tree
  public union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false; // Already in the same set!

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    this.count--;
    return true;
  }
}`,
      keyTakeaway:
        'Path Compression turns deep parent chains into flat 1-hop pointers directly to root, yielding an amortized time complexity of O(α(N)) ≈ O(1).',
    },
    youtubeQuery: 'union find disjoint set path compression rank explained visually',
    quiz: [
      {
        id: 'q1-uf',
        question: 'What does "Path Compression" do inside the `find(x)` method of a Disjoint Set?',
        options: [
          'Deletes all negative values from the array.',
          'Updates each node visited along the traversal path to point directly to the set representative root.',
          'Compresses strings using gzip algorithms.',
          'Sorts the array before returning the root.',
        ],
        correctIndex: 1,
        explanation:
          'When finding the root, path compression recursively updates parent[x] = root. Every subsequent call on any node in that path now reaches the root in a single hop.',
      },
    ],
  },
];
