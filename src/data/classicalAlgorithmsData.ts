import {
  ComplexityInfo,
  RealWorldExample,
  LeetCodeBenchmark,
  QuizQuestion,
} from './dataStructuresData';
import { AlgorithmDetail } from './algorithmsData';

export const CLASSICAL_ALGORITHMS_DATA: AlgorithmDetail[] = [
  {
    id: 'bubble-selection-sort',
    name: 'Bubble Sort & Selection Sort (Loop Invariants & Flash EEPROM)',
    shortName: 'Bubble & Selection Sort',
    category: 'Classical Sorting',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'The foundational introduction to nested-loop complexity analysis, proof of correctness via loop invariants, and stability. Teaches how double-summation series 1 + 2 + ... + (N-1) leads to O(N²) quadratic time.',
      whyRareInInterviewsRaw:
        'On standard interview inputs (N = 10⁴ to 10⁵), an O(N²) algorithm executes ~10¹⁰ operations and triggers an immediate Time Limit Exceeded (TLE) timeout. Writing raw bubble sort loops is seen as a junior antipattern.',
      interviewDisguise:
        '1) Dutch National Flag / Sort Colors (#75): Multi-pointer in-place swapping of 3 discrete values in O(N). 2) Early termination: Checking if an array is already sorted in O(N) by monitoring swap flags. 3) Minimizing hardware memory writes.',
      realWorldSystemUse:
        'Selection Sort performs at most strictly N write operations (swaps) across the entire run. On physical embedded hardware using EEPROM or NOR Flash memory—where write cycles physically wear out memory cells after 10,000 writes—Selection Sort preserves hardware longevity far better than QuickSort or MergeSort which execute O(N log N) writes.'
    },
    tagline: 'Classroom nested loop invariants vs. O(N) physical flash memory writes.',
    description:
      'Bubble Sort repeatedly compares adjacent elements and swaps them into order, bubbling the largest remaining element to the end. Selection Sort repeatedly identifies the minimum element in the unsorted suffix and performs exactly one swap to place it at the sorted boundary. While slow on large random datasets, Selection Sort is mathematically optimal for minimizing physical write operations.',
    primaryDataStructures: ['Arrays', 'EEPROM / NOR Flash Memory'],
    memoryModel: {
      layout: 'In-place array manipulation with strictly 2 index registers (i, j).',
      cacheLocality: 'Bubble sort: High sequential L1 streaming. Selection sort: High read streaming, O(N) write operations.',
      pointerOverhead: 'None (primitive array indices).',
      explanation:
        'Runs completely in-place in O(1) auxiliary space. No recursive call stack frames, no dynamic heap allocation.',
    },
    complexity: [
      { operation: 'Bubble Sort (Average / Worst)', average: 'O(N²)', worst: 'O(N²)', notes: 'Quadratic comparisons and swaps.' },
      { operation: 'Bubble Sort (Best with Flag)', average: 'O(N)', worst: 'O(N)', notes: 'Early break if zero swaps detected in pass 1.' },
      { operation: 'Selection Sort (Comparisons)', average: 'O(N²)', worst: 'O(N²)', notes: 'Always executes N(N-1)/2 comparisons.' },
      { operation: 'Selection Sort (Writes / Swaps)', average: 'O(N)', worst: 'O(N)', notes: 'Guaranteed at most N total memory writes.' },
      { operation: 'Auxiliary Space', average: 'O(1)', worst: 'O(1)', notes: 'Zero memory allocation beyond loop variables.' },
    ],
    realWorldApplications: [
      {
        title: 'Embedded Hardware EEPROM / Flash Wear Leveling',
        domain: 'Firmware & Microcontrollers',
        description: 'Microcontroller chips have non-volatile flash memory rated for only 10k–100k write cycles. Selection sort guarantees at most N writes, protecting flash endurance.',
      },
      {
        title: 'Real-Time Telemetry Stream Sanity Checking',
        domain: 'Aerospace & IoT',
        description: 'Single-pass early-exit bubble scan confirms incoming telemetry frames arrive monotonically sorted in O(N) time with zero allocations.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'sort-colors-classical',
        title: 'Sort Colors (#75)',
        difficulty: 'Medium',
        pattern: '3-Way In-Place Swapping (Dutch Flag)',
        whyThisStructure: 'Demonstrates in-place swap invariants without using auxiliary count arrays or language sort built-ins.',
      },
      {
        id: 'check-sorted-rotated',
        title: 'Check if Array Is Sorted and Rotated (#1752)',
        difficulty: 'Easy',
        pattern: 'Monotonic Order Invariant',
        whyThisStructure: 'Validates sorted order with at most one adjacent inversion point in a circular array in O(N).',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Selection Sort: Guarantees at most O(N) write operations
function selectionSort(nums: number[]): number[] {
  const n = nums.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const temp = nums[i];
      nums[i] = nums[minIdx];
      nums[minIdx] = temp; // Exactly 1 swap per outer step!
    }
  }
  return nums;
}`,
      keyTakeaway:
        'Selection Sort guarantees at most N writes, which is mathematically optimal when writing to non-volatile memory or expensive storage.',
    },
    youtubeQuery: 'bubble sort selection sort loop invariants flash memory wear leveling',
    quiz: [
      {
        id: 'q1-bss',
        question: 'Why is Selection Sort preferred over QuickSort when sorting data stored on a physical EEPROM chip?',
        options: [
          'Selection Sort uses less CPU power than QuickSort.',
          'Selection Sort guarantees at most O(N) write operations, preventing premature physical wear on flash memory cells.',
          'Selection Sort runs in O(N log N) time on EEPROM.',
          'Selection Sort parallelizes better across microcontroller cores.',
        ],
        correctIndex: 1,
        explanation:
          'Flash and EEPROM memory degrade physically with each write cycle. Selection sort makes at most N write operations (swaps), compared to O(N log N) writes in QuickSort/MergeSort.',
      },
      {
        id: 'q2-bss',
        question: 'How can Bubble Sort achieve an O(N) best-case time complexity?',
        options: [
          'By using binary search to find the insert location.',
          'By maintaining a swapped boolean flag that breaks early if an entire pass completes with zero swaps.',
          'By skipping every second element.',
          'By sorting both ends simultaneously.',
        ],
        correctIndex: 1,
        explanation:
          'If no adjacent elements were inverted during the first pass, the array is already sorted. The swapped flag allows Bubble Sort to terminate in O(N) time.',
      },
    ],
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort & Timsort Adaptive Hybrid (L1 Cache & Sorted Streams)',
    shortName: 'Insertion Sort',
    category: 'Classical Sorting',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'Illustrates adaptive sorting—where nearly sorted inputs run in blazingly fast O(N) time—and the concept of online processing (sorting elements as they arrive one by one from a stream).',
      whyRareInInterviewsRaw:
        'On completely randomized arrays of 10⁵ elements, its worst-case O(N²) time complexity causes interview platforms to fail with TLE.',
      interviewDisguise:
        '1) Maintaining a sorted sliding buffer on incoming streaming events. 2) Hybrid threshold subroutines where small partitions (<= 32) are sorted without recursive overhead.',
      realWorldSystemUse:
        'Almost EVERY production runtime in the world uses Insertion Sort under the hood: Python (Timsort), Chrome V8 (Array.prototype.sort), Java (Dual-Pivot QuickSort), and Rust (pdqsort). When recursion partitions subarrays down to 16–64 elements, they switch to Insertion Sort because it has zero function call overhead and 100% L1 CPU cache hits.'
    },
    tagline: 'The secret engine under Timsort, V8, and Java Dual-Pivot QuickSort.',
    description:
      'Insertion Sort builds the final sorted array one item at a time by shifting larger preceding elements to the right. While quadratic on large random arrays, it is adaptive: running in strictly O(N) on nearly-sorted data. Because of its tiny instruction footprint and strictly linear sequential memory access, modern standard libraries use it to sort small partitions.',
    primaryDataStructures: ['Contiguous Arrays', 'CPU L1 Data Cache'],
    memoryModel: {
      layout: 'Linear contiguous array shifts. No dynamic allocation.',
      cacheLocality: 'Maximum (100% L1 cache hits due to adjacent backwards sliding).',
      pointerOverhead: 'None (primitive register values).',
      explanation:
        'Shifting elements backwards in contiguous RAM triggers the CPU hardware prefetcher, outperforming O(N log N) algorithms on small N (N <= 32).',
    },
    complexity: [
      { operation: 'Best Case (Nearly Sorted)', average: 'O(N)', worst: 'O(N)', notes: 'Single comparison per element when already in order.' },
      { operation: 'Average Case', average: 'O(N²)', worst: 'O(N²)', notes: 'Average N/4 shifts per element.' },
      { operation: 'Worst Case (Reversed)', average: 'O(N²)', worst: 'O(N²)', notes: 'Maximum shifts on reverse-sorted input.' },
      { operation: 'Auxiliary Space', average: 'O(1)', worst: 'O(1)', notes: 'Operates completely in-place.' },
      { operation: 'Stability', average: 'Stable', worst: 'Stable', notes: 'Never swaps equal keys.' },
    ],
    realWorldApplications: [
      {
        title: 'Python Timsort & Java Dual-Pivot QuickSort Subroutine',
        domain: 'Language Runtimes',
        description: 'Both languages switch to binary insertion sort when subarray size <= 32–64, beating recursive algorithms by avoiding call stack overhead.',
      },
      {
        title: 'Low-Latency Financial Order Book Updates',
        domain: 'Quantitative Finance',
        description: 'When new limit orders arrive with timestamps or prices close to existing bids/asks, insertion sort updates the sorted book in O(K) near-constant time.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'insertion-sort-list',
        title: 'Insertion Sort List (#147)',
        difficulty: 'Medium',
        pattern: 'Pointer Re-linking in Suffix',
        whyThisStructure: 'Direct implementation on singly linked lists where shifting node pointers avoids array shifts.',
      },
      {
        id: 'sort-an-array-hybrid',
        title: 'Sort an Array (#912)',
        difficulty: 'Medium',
        pattern: 'Hybrid Timsort / Introsort Cutoff',
        whyThisStructure: 'Demonstrates why hybrid algorithms switch to insertion sort for small partitions.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Insertion Sort: Adaptive and L1 cache-friendly
function insertionSort(nums: number[]): number[] {
  for (let i = 1; i < nums.length; i++) {
    const key = nums[i];
    let j = i - 1;
    // Shift elements of nums[0..i-1] that are greater than key
    while (j >= 0 && nums[j] > key) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = key;
  }
  return nums;
}`,
      keyTakeaway:
        'When an array is already sorted, Insertion Sort runs in strictly O(N) time with zero extra allocations.',
    },
    youtubeQuery: 'timsort insertion sort small array cutoff v8 python java',
    quiz: [
      {
        id: 'q1-is',
        question: 'Why do Python (Timsort), V8 (JavaScript), and Java switch to Insertion Sort for subarrays of length <= 32?',
        options: [
          'Because Insertion Sort is patented by Oracle.',
          'Because on small inputs, the low constant factors and L1 CPU cache locality of Insertion Sort beat the recursive overhead of QuickSort and MergeSort.',
          'Because QuickSort fails to compile on small arrays.',
          'Because Insertion Sort uses less RAM than an empty array.',
        ],
        correctIndex: 1,
        explanation:
          'On small arrays (N <= 32–64), the constant factor of QuickSort/MergeSort (recursion frames, pivot selection, merge buffers) is higher than Insertion Sort’s tight sequential loop with 100% L1 cache hits.',
      },
    ],
  },
  {
    id: 'merge-sort-classical',
    name: 'Merge Sort & External Disk Sorting (Dividing Big Data)',
    shortName: 'Merge Sort (External)',
    category: 'Divide & Conquer',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'The textbook model of the Divide & Conquer paradigm. Teaches recursion trees, Master Theorem recurrence T(N) = 2T(N/2) + O(N) = O(N log N), and algorithm stability (preserving original order of equal keys).',
      whyRareInInterviewsRaw:
        'Allocating and writing 30 lines of merge buffers takes 15 minutes of interview time. Unless testing linked lists or inversion count invariants, interviewers prefer you use standard library sort.',
      interviewDisguise:
        '1) Sort List (#148): Sorting a singly linked list in O(N log N) time and O(1) extra space. 2) Reverse Pairs (#493) & Count of Smaller Numbers After Self (#315): Inversion counting during the merge step in O(N log N).',
      realWorldSystemUse:
        'External 2-Way and K-Way Merge Sort is the engine used when datasets exceed available physical RAM (e.g., sorting 100 Terabytes of database logs in PostgreSQL, MySQL, and the MapReduce / Spark shuffle phase).'
    },
    tagline: 'Divide & conquer, guaranteed O(N log N), and multi-terabyte disk sorting.',
    description:
      'Merge Sort divides the array into two equal halves, recursively sorts them, and then merges the two sorted halves into a single ordered buffer. It guarantees O(N log N) worst-case time and is completely stable. Because it accesses data sequentially, it is the premier algorithm for external sorting on spinning disks and SSDs.',
    primaryDataStructures: ['Arrays', 'Linked Lists', 'Disk File Blocks / SSDs'],
    memoryModel: {
      layout: 'Requires O(N) auxiliary scratch buffer space for array merging.',
      cacheLocality: 'High streaming sequential reads during the merge phase.',
      pointerOverhead: 'Zero for arrays; 1 pointer per node for Linked Lists.',
      explanation:
        'On Linked Lists, Merge Sort operates in strictly O(1) auxiliary space by rewiring next pointers. On arrays, it requires an O(N) temporary buffer.',
    },
    complexity: [
      { operation: 'Best / Average / Worst Time', average: 'O(N log N)', worst: 'O(N log N)', notes: 'Strictly guaranteed under all inputs.' },
      { operation: 'Auxiliary Space (Array)', average: 'O(N)', worst: 'O(N)', notes: 'Requires temporary merge buffer.' },
      { operation: 'Auxiliary Space (Linked List)', average: 'O(1)', worst: 'O(1)', notes: 'In-place pointer rewiring (excluding recursion stack).' },
      { operation: 'Stability', average: 'Stable', worst: 'Stable', notes: 'Guarantees equal keys maintain relative order.' },
    ],
    realWorldApplications: [
      {
        title: 'External Merge Sort in PostgreSQL & MySQL',
        domain: 'Database Engines',
        description: 'When an ORDER BY query exceeds work_mem (e.g. 50GB table on a 4GB RAM server), Postgres writes sorted runs to temporary disk files and merges them.',
      },
      {
        title: 'Apache Spark & Hadoop MapReduce Shuffle Phase',
        domain: 'Distributed Big Data',
        description: 'Mappers emit key-value pairs sorted locally; reducers perform a K-way merge sort stream to aggregate grouped keys across network nodes.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'sort-list-classical',
        title: 'Sort List (#148)',
        difficulty: 'Medium',
        pattern: 'Linked List Divide & Conquer',
        whyThisStructure: 'Merge sort is optimal for linked lists because finding mid takes O(N) and merging takes O(1) extra space.',
      },
      {
        id: 'reverse-pairs-classical',
        title: 'Reverse Pairs (#493)',
        difficulty: 'Hard',
        pattern: 'Merge Sort Inversion Counting',
        whyThisStructure: 'Counts pairs where nums[i] > 2 * nums[j] in O(N log N) time during the merge step.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Merge Sort: O(N log N) guaranteed with reusable scratch buffer
function mergeSort(nums: number[]): number[] {
  const temp = new Array(nums.length);
  
  function sort(left: number, right: number) {
    if (left >= right) return;
    const mid = left + Math.floor((right - left) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  function merge(left: number, mid: number, right: number) {
    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
      if (nums[i] <= nums[j]) {
        temp[k++] = nums[i++];
      } else {
        temp[k++] = nums[j++];
      }
    }
    while (i <= mid) temp[k++] = nums[i++];
    while (j <= right) temp[k++] = nums[j++];
    for (let p = left; p <= right; p++) nums[p] = temp[p];
  }

  sort(0, nums.length - 1);
  return nums;
}`,
      keyTakeaway:
        'Preallocating a single temp buffer of size N avoids O(N log N) garbage collector allocations in JavaScript/Java.',
    },
    youtubeQuery: 'external merge sort database postgres mapreduce explain',
    quiz: [
      {
        id: 'q1-ms',
        question: 'Why is Merge Sort chosen over QuickSort for external sorting of files that do not fit into RAM?',
        options: [
          'Merge Sort uses fewer CPU instructions.',
          'Merge Sort reads and writes sequential contiguous disk blocks, maximizing disk throughput and minimizing random disk head seeks.',
          'Merge Sort has an O(N) best case.',
          'QuickSort cannot run on hard drives.',
        ],
        correctIndex: 1,
        explanation:
          'Spinning hard disks and SSDs achieve peak throughput on sequential block I/O. Merge Sort reads sorted runs from disk sequentially and streams merged output sequentially.',
      },
    ],
  },
  {
    id: 'quicksort-hoare',
    name: 'Quick Sort & Hoare vs Lomuto Partitioning (Introsort, 3-Way & Cache Lines)',
    shortName: 'Quick Sort (Partitioning)',
    category: 'Classical Sorting',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'Teaches pivot selection, in-place partitioning without auxiliary buffers, and mathematical expected value analysis (average O(N log N) vs worst-case O(N²)).',
      whyRareInInterviewsRaw:
        'Writing full QuickSort with recursion takes too much time, and naive pivot selection risks O(N²) on sorted tests. Standard libraries already implement it.',
      interviewDisguise:
        '1) Kth Largest Element in an Array (#215): QuickSelect discards one half after partitioning, achieving expected O(N) linear time without sorting! 2) Sort Colors (#75): Dijkstra 3-way partitioning (`< pivot`, `== pivot`, `> pivot`).',
      realWorldSystemUse:
        'C++ std::sort uses Introsort (QuickSort with automatic fallback to HeapSort if recursion depth exceeds 2*log(N), and fallback to Insertion Sort for sub-arrays <= 16). Linux kernel qsort() relies on QuickSort variants.'
    },
    tagline: 'In-place partitioning, QuickSelect O(N) order statistics, and C++ Introsort.',
    description:
      'Quick Sort selects a pivot element and partitions the array such that all elements smaller than the pivot are placed before it and all larger elements are placed after it. It then recursively sorts the subarrays. Because it sorts strictly in-place with sequential memory sweeps, it has superior cache performance compared to Merge Sort.',
    primaryDataStructures: ['Contiguous Arrays', 'L1/L2 Cache Lines'],
    memoryModel: {
      layout: 'In-place array swaps. Stack depth O(log N) average, O(N) worst case.',
      cacheLocality: 'Extremely high (Hoare two-pointer scan moves inwards sequentially).',
      pointerOverhead: 'None (primitive array indices).',
      explanation:
        'Hoare partitioning performs ~3x fewer swaps than Lomuto partitioning and handles duplicate elements gracefully.',
    },
    complexity: [
      { operation: 'Average Time', average: 'O(N log N)', worst: 'O(N log N)', notes: 'Achieved with randomized or median-of-3 pivot.' },
      { operation: 'Worst-Case Time', average: 'O(N²)', worst: 'O(N²)', notes: 'Occurs when pivot is always min/max (unbalanced partitions).' },
      { operation: 'QuickSelect (Kth Element)', average: 'O(N)', worst: 'O(N²)', notes: 'Only recurses into the partition containing index k.' },
      { operation: 'Auxiliary Space (Call Stack)', average: 'O(log N)', worst: 'O(N)', notes: 'Can be bounded to O(log N) by tail-recursing smaller half.' },
      { operation: 'Stability', average: 'Unstable', worst: 'Unstable', notes: 'Long-distance swaps disrupt equal key orders.' },
    ],
    realWorldApplications: [
      {
        title: 'C++ std::sort (Introsort)',
        domain: 'Standard Libraries',
        description: 'C++ STL uses Introsort: QuickSort for peak cache speed, falling back to HeapSort if recursion depth > 2*log(N) to guarantee O(N log N) worst-case.',
      },
      {
        title: 'Linux Kernel lib/sort.c',
        domain: 'Operating Systems',
        description: 'The Linux kernel implements an in-place heapsort/quicksort hybrid for sorting kernel structures without heap allocation.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'kth-largest-element-classical',
        title: 'Kth Largest Element in an Array (#215)',
        difficulty: 'Medium',
        pattern: 'QuickSelect (O(N) Expected)',
        whyThisStructure: 'Discards one half of the partition each step, resulting in geometric series N + N/2 + N/4 + ... = 2N = O(N) expected time.',
      },
      {
        id: 'sort-colors-hoare',
        title: 'Sort Colors (#75)',
        difficulty: 'Medium',
        pattern: 'Dutch National Flag 3-Way Partition',
        whyThisStructure: 'Partitions 3 distinct values (0, 1, 2) in a single pass with 3 pointers.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// QuickSelect: Find Kth largest in expected O(N) time
function findKthLargest(nums: number[], k: number): number {
  const targetIdx = nums.length - k; // Index if sorted

  function quickSelect(left: number, right: number): number {
    const pivot = nums[right];
    let p = left;

    for (let i = left; i < right; i++) {
      if (nums[i] <= pivot) {
        [nums[i], nums[p]] = [nums[p], nums[i]];
        p++;
      }
    }
    [nums[p], nums[right]] = [nums[right], nums[p]];

    if (p === targetIdx) return nums[p];
    if (p < targetIdx) return quickSelect(p + 1, right);
    return quickSelect(left, p - 1);
  }

  return quickSelect(0, nums.length - 1);
}`,
      keyTakeaway:
        'QuickSelect solves the Kth largest element in expected O(N) time without sorting the entire array.',
    },
    youtubeQuery: 'quicksort hoare vs lomuto partitioning introsort c++ stl',
    quiz: [
      {
        id: 'q1-qs',
        question: 'Why does C++ std::sort use Introsort (QuickSort + HeapSort) rather than pure QuickSort?',
        options: [
          'HeapSort uses less memory than QuickSort.',
          'Introsort gets QuickSort’s superior L1 cache speed on average, but switches to HeapSort if recursion depth exceeds 2*log(N) to prevent O(N²) worst case.',
          'Pure QuickSort is not supported on 64-bit CPUs.',
          'HeapSort is faster than QuickSort on small arrays.',
        ],
        correctIndex: 1,
        explanation:
          'Introsort gives the best of both worlds: peak cache speed on average from QuickSort, with a mathematically guaranteed O(N log N) worst-case via HeapSort fallback.',
      },
    ],
  },
  {
    id: 'counting-radix-sort',
    name: 'Counting Sort & Radix Sort (Breaking the Ω(N log N) Lower Bound)',
    shortName: 'Counting & Radix Sort',
    category: 'Linear-Time Sort',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'Proves the Information Theoretic Lower Bound (any comparison sort must perform at least Ω(N log N) comparisons) can be broken by exploiting integer radix and digit distributions to achieve linear O(N + K) or O(d * (N + K)) time.',
      whyRareInInterviewsRaw:
        'Only works when keys are bounded integers or fixed-length strings. If array values range from -10⁹ to 10⁹, naive counting sort requires 8GB of memory and crashes.',
      interviewDisguise:
        '1) Maximum Gap (#164): Finding the maximum difference between successive elements in sorted form in strictly O(N) time and O(N) space. 2) Top K Frequent Elements (#347): Bucket sorting frequencies in O(N).',
      realWorldSystemUse:
        'NVIDIA CUDA GPU sorting (Blelloch Radix Sort) is the fastest sorting algorithm on modern supercomputers because digit-slicing maps natively to SIMD parallel registers without branching. High-speed network switches sort IPv4 packet headers in hardware pipelines using radix tables.'
    },
    tagline: 'Non-comparison sorting, GPU parallel radix sorts, and O(N) maximum gaps.',
    description:
      'Counting Sort tallies frequencies of keys in a fixed range to place items into their exact output positions in O(N + K) time. Radix Sort extends this by sorting digit-by-digit from least significant to most significant (LSD) using a stable counting sort subroutine. Because it performs zero element comparisons, it beats the O(N log N) comparison barrier.',
    primaryDataStructures: ['Frequency Count Arrays', 'SIMD GPU Registers'],
    memoryModel: {
      layout: 'Auxiliary count array of size K (or 10 for decimal digits, 256 for bytes).',
      cacheLocality: 'Counting pass: High. Placement pass: Scatter writes with moderate cache misses.',
      pointerOverhead: 'None (primitive integer counts).',
      explanation:
        'LSD Radix sort sorts in passes equal to the number of digits d. For 32-bit integers, sorting in 4 passes of 8 bits (base 256) is blazingly fast.',
    },
    complexity: [
      { operation: 'Counting Sort Time', average: 'O(N + K)', worst: 'O(N + K)', notes: 'K is the range of input values (max - min + 1).' },
      { operation: 'Radix Sort Time', average: 'O(d * (N + B))', worst: 'O(d * (N + B))', notes: 'd is number of digits, B is base (e.g. 10 or 256).' },
      { operation: 'Auxiliary Space (Counting)', average: 'O(N + K)', worst: 'O(N + K)', notes: 'Requires count array + output array.' },
      { operation: 'Comparison Operations', average: '0', worst: '0', notes: 'Non-comparison based sorting algorithm.' },
    ],
    realWorldApplications: [
      {
        title: 'NVIDIA CUDA Parallel GPU Radix Sort (CUB / Thrust)',
        domain: 'High-Performance GPU Computing',
        description: 'Modern GPUs sort billions of floating point numbers per second using parallel bitwise radix sort across thousands of streaming multiprocessors.',
      },
      {
        title: 'Network Packet Header Classification & Routing',
        domain: 'Computer Networks',
        description: 'Hardware switches inspect 32-bit IPv4 header prefixes using multi-bit trie and radix pipelines at 400 Gbps line rates.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'maximum-gap-classical',
        title: 'Maximum Gap (#164)',
        difficulty: 'Hard',
        pattern: 'Bucket / Radix Linear Sort',
        whyThisStructure: 'Solves the maximum successive gap problem in strictly O(N) linear time and linear space.',
      },
      {
        id: 'top-k-frequent-bucket',
        title: 'Top K Frequent Elements (#347)',
        difficulty: 'Medium',
        pattern: 'Bucket Sort by Frequency',
        whyThisStructure: 'Buckets frequencies 1..N to extract top K elements in O(N) without a heap.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// LSD Radix Sort for non-negative integers
function radixSort(nums: number[]): number[] {
  if (nums.length <= 1) return nums;
  const maxVal = Math.max(...nums);

  // Run counting sort for every digit exponent (1, 10, 100, ...)
  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    const output = new Array(nums.length);
    const count = new Array(10).fill(0);

    for (let i = 0; i < nums.length; i++) {
      const digit = Math.floor(nums[i] / exp) % 10;
      count[digit]++;
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    // Build output in reverse order for stability!
    for (let i = nums.length - 1; i >= 0; i--) {
      const digit = Math.floor(nums[i] / exp) % 10;
      output[count[digit] - 1] = nums[i];
      count[digit]--;
    }
    for (let i = 0; i < nums.length; i++) nums[i] = output[i];
  }
  return nums;
}`,
      keyTakeaway:
        'Radix sort must iterate backwards during the placement pass to preserve stability across digit passes.',
    },
    youtubeQuery: 'radix sort counting sort breaking comparison lower bound explained',
    quiz: [
      {
        id: 'q1-rs',
        question: 'Why does Radix Sort iterate backwards (from N-1 down to 0) when copying elements into the output array?',
        options: [
          'To save CPU instructions.',
          'To ensure the counting sort subroutine remains stable (preserving the relative order of items with identical current digits established in earlier passes).',
          'Because arrays in C are indexed in reverse.',
          'To prevent memory leaks.',
        ],
        correctIndex: 1,
        explanation:
          'LSD Radix sort relies entirely on stability. Processing items in reverse ensures that elements sharing the same current digit retain their relative ordering from previous digit passes.',
      },
    ],
  },
  {
    id: 'dijkstra-shortest-path',
    name: 'Dijkstra’s Algorithm & Prim/Kruskal MST (Greedy Relaxation & Network Delay)',
    shortName: 'Dijkstra Shortest Path',
    category: 'Shortest Path & MST',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'The premier greedy graph algorithm. Teaches priority queue edge relaxation, distance table invariants, and the Cut Property in Minimum Spanning Trees (MSTs).',
      whyRareInInterviewsRaw:
        'BFS is simpler and suffices for unweighted graphs (where each edge has weight 1). Dijkstra is required the moment edges have positive variable weights.',
      interviewDisguise:
        '1) Network Delay Time (#743): Classical Dijkstra finding time for all nodes to receive a signal. 2) Cheapest Flights Within K Stops (#787): Shortest path with step pruning. 3) Min Cost to Connect All Points (#1584): Kruskal MST with Disjoint-Set Union.',
      realWorldSystemUse:
        'Internet routing protocols (OSPF - Open Shortest Path First, IS-IS) use Dijkstra to compute packet forwarding tables across autonomous systems. Google Maps and Apple Maps route turn-by-turn navigation over road networks using bidirectional Dijkstra with contraction hierarchies.'
    },
    tagline: 'Single-source shortest path on weighted graphs in O((V + E) log V).',
    description:
      'Dijkstra’s algorithm finds the shortest paths from a single source node to all other nodes in a weighted graph with non-negative edge weights. It greedily selects the unvisited node with the smallest tentative distance using a Min-Heap, relaxes its outgoing edges, and marks it visited. Unlike Bellman-Ford, it assumes once a node is settled, its shortest distance is finalized.',
    primaryDataStructures: ['Min-Heap (PriorityQueue)', 'Adjacency List', 'Distance Array'],
    memoryModel: {
      layout: 'Distance array of size V + Min-heap priority queue storing (distance, node) pairs.',
      cacheLocality: 'Moderate (heap pushes/pops jump memory; adjacency list traversal is sequential).',
      pointerOverhead: 'Adjacency list edge nodes + heap tree pointers.',
      explanation:
        'Using a binary min-heap achieves O((V + E) log V) time. A Fibonacci heap theoretically achieves O(E + V log V), but has large constant factors.',
    },
    complexity: [
      { operation: 'Time (Binary Min-Heap)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', notes: 'V log V node extractions + E log V edge relaxations.' },
      { operation: 'Time (Fibonacci Heap)', average: 'O(E + V log V)', worst: 'O(E + V log V)', notes: 'Theoretical optimum; rarely used in practice.' },
      { operation: 'Auxiliary Space', average: 'O(V + E)', worst: 'O(V + E)', notes: 'Adjacency graph + min-heap + distance map.' },
      { operation: 'Negative Edge Weights', average: 'Not Supported', worst: 'Fails / Loops', notes: 'Requires Bellman-Ford algorithm.' },
    ],
    realWorldApplications: [
      {
        title: 'OSPF & IS-IS Internet Routing Protocols',
        domain: 'Networking Hardware',
        description: 'Enterprise routers exchange link-state advertisements and run Dijkstra to determine the lowest-cost paths for IP packets across the internet backbone.',
      },
      {
        title: 'Google Maps Road Navigation',
        domain: 'Geospatial Engineering',
        description: 'Preprocessed contraction hierarchies prune millions of road segments, running bidirectional Dijkstra in milliseconds to calculate turn-by-turn routes.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'network-delay-time-classical',
        title: 'Network Delay Time (#743)',
        difficulty: 'Medium',
        pattern: 'Dijkstra Min-Heap Shortest Path',
        whyThisStructure: 'Finds the time required for a signal sent from node k to reach all nodes in a directed weighted network.',
      },
      {
        id: 'min-cost-connect-points-mst',
        title: 'Min Cost to Connect All Points (#1584)',
        difficulty: 'Medium',
        pattern: 'Kruskal MST with Union-Find',
        whyThisStructure: 'Finds the minimum spanning tree connecting N coordinate points using Manhattan distance edges.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Dijkstra's Shortest Path on Directed Weighted Graph
function dijkstra(n: number, edges: number[][], src: number): number[] {
  // adj[u] = [[v, weight], ...]
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
  }

  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  // Simple min-heap queue storing [currentDist, node]
  const pq: [number, number][] = [[0, src]];

  while (pq.length > 0) {
    // Extract minimum distance node (sort or binary heap)
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;

    if (d > dist[u]) continue; // Stale heap entry; skip!

    for (const [v, weight] of adj[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.push([dist[v], v]);
      }
    }
  }

  return dist;
}`,
      keyTakeaway:
        'Always check if (d > dist[u]) continue; to discard duplicate stale entries in the priority queue.',
    },
    youtubeQuery: 'dijkstras algorithm priority queue ospf routing explained',
    quiz: [
      {
        id: 'q1-dijk',
        question: 'What happens if Dijkstra’s algorithm is executed on a graph containing negative edge weights?',
        options: [
          'It throws a runtime exception.',
          'It may produce incorrect shortest path answers because its greedy choice assumes distances can never decrease once a node is finalized.',
          'It automatically converts the negative weights to positive.',
          'It runs in O(N!) time.',
        ],
        correctIndex: 1,
        explanation:
          'Dijkstra relies on the greedy assumption that once a node’s shortest distance is pulled from the min-heap, it cannot be improved. A negative edge can invalidate settled paths, producing incorrect distances.',
      },
    ],
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford & Negative Cycles (FX Arbitrage & Distances)',
    shortName: 'Bellman-Ford',
    category: 'Shortest Path & MST',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'Demonstrates dynamic programming edge relaxation. Teaches why simple paths have at most V-1 edges, how relaxing edges V-1 times guarantees shortest paths, and how an extra V-th pass detects negative cycles.',
      whyRareInInterviewsRaw:
        'Its O(V * E) time complexity is slower than Dijkstra. It is only required when edges have negative weights or when negative cycle detection is explicitly demanded.',
      interviewDisguise:
        '1) Financial currency arbitrage (converting exchange rates into negative log weights so product > 1 becomes negative cycle). 2) Cheapest Flights Within K Stops (#787): Performing exactly K+1 edge relaxation passes.',
      realWorldSystemUse:
        'Quantitative trading systems detecting triangular currency arbitrage cycles in foreign exchange markets. Distributed distance-vector network routing protocols (RIP - Routing Information Protocol).'
    },
    tagline: 'Handles negative weights and detects currency arbitrage cycles in O(V * E).',
    description:
      'Bellman-Ford computes single-source shortest paths on graphs that may contain negative edge weights. It iteratively relaxes all edges in the graph V-1 times. If an edge can still be relaxed on the V-th iteration, the graph contains a negative-weight cycle reachable from the source. In quantitative finance, currency arbitrage is modeled as a negative cycle detection problem.',
    primaryDataStructures: ['Edge List', 'Distance Array'],
    memoryModel: {
      layout: 'Single 1D distance array of size V + edge tuples [u, v, weight].',
      cacheLocality: 'High (linearly iterates through flat edge array).',
      pointerOverhead: 'None (flat array of integer tuples).',
      explanation:
        'Extremely space-efficient: requires only O(V) auxiliary memory and an edge list.',
    },
    complexity: [
      { operation: 'Time Complexity', average: 'O(V * E)', worst: 'O(V * E)', notes: 'V-1 iterations over all E edges.' },
      { operation: 'Auxiliary Space', average: 'O(V)', worst: 'O(V)', notes: 'Only tracks 1D distance array.' },
      { operation: 'Negative Edge Weights', average: 'Supported', worst: 'Supported', notes: 'Correctly computes shortest paths.' },
      { operation: 'Negative Cycle Detection', average: 'Guaranteed', worst: 'Guaranteed', notes: 'Detected on V-th iteration pass.' },
    ],
    realWorldApplications: [
      {
        title: 'Quantitative Forex Triangular Arbitrage Detection',
        domain: 'FinTech & High-Frequency Trading',
        description: 'Trading engines convert currency exchange rates into edge weights using -log(rate). Bellman-Ford detects negative cycles where a trader earns risk-free profit by cycling currencies.',
      },
      {
        title: 'Routing Information Protocol (RIP)',
        domain: 'Network Engineering',
        description: 'Early internet routers exchanged distance-vector routing tables based on the Bellman-Ford algorithm with a hop limit of 15 to prevent count-to-infinity loops.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'cheapest-flights-k-stops',
        title: 'Cheapest Flights Within K Stops (#787)',
        difficulty: 'Medium',
        pattern: 'K-Step Edge Relaxation',
        whyThisStructure: 'Direct application of Bellman-Ford by relaxing edges exactly K+1 times using a previous distance snapshot.',
      },
      {
        id: 'network-delay-time-bf',
        title: 'Network Delay Time (#743)',
        difficulty: 'Medium',
        pattern: 'Edge Relaxation Alternative',
        whyThisStructure: 'Demonstrates Bellman-Ford distance convergence on small directed graphs.',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// Bellman-Ford with Negative Cycle Detection
function bellmanFord(
  n: number,
  edges: [number, number, number][],
  src: number
): { dist: number[]; hasNegativeCycle: boolean } {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  // Relax all edges V - 1 times
  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  // V-th iteration to check for negative-weight cycles
  let hasNegativeCycle = false;
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { dist, hasNegativeCycle };
}`,
      keyTakeaway:
        'A simple path in a graph with V vertices has at most V-1 edges. If any edge can still be relaxed after V-1 passes, a negative cycle exists.',
    },
    youtubeQuery: 'bellman ford algorithm negative cycles currency arbitrage explained',
    quiz: [
      {
        id: 'q1-bf',
        question: 'How does high-frequency trading turn currency arbitrage detection into a graph problem solved by Bellman-Ford?',
        options: [
          'By sorting exchange rates from lowest to highest.',
          'By transforming exchange rates using -log(rate); multiplying rates > 1 becomes a negative sum, which Bellman-Ford detects as a negative-weight cycle.',
          'By using binary search on market orders.',
          'By storing exchange rates in a max-heap.',
        ],
        correctIndex: 1,
        explanation:
          'In forex, an arbitrage opportunity exists when rate1 * rate2 * rate3 > 1. Taking the negative logarithm yields: -log(rate1) + -log(rate2) + -log(rate3) < 0. This turns arbitrage into a negative-weight cycle.',
      },
    ],
  },
  {
    id: 'string-search-kmp',
    name: 'Knuth-Morris-Pratt (KMP) & Rabin-Karp (Linear Substrings & Rolling Hash)',
    shortName: 'KMP & Rabin-Karp',
    category: 'String Algorithms',
    tier: 'college-classical',
    academicBridge: {
      whyCollegeTaughtIt:
        'Demonstrates how preprocessing patterns into a failure function (LPS - Longest Proper Prefix which is also Suffix) or rolling polynomial hash eliminates naive O(N * M) backtrack scans, yielding optimal O(N + M) search.',
      whyRareInInterviewsRaw:
        'Coding a bug-free LPS table or rolling hash with modulo arithmetic in 20 minutes under pressure is notoriously prone to off-by-one errors and integer overflow. Interviewers rarely expect full KMP unless hiring for search/compilers.',
      interviewDisguise:
        '1) Find the Index of the First Occurrence in a String (#28). 2) Shortest Palindrome (#214): Using KMP LPS table to find the longest palindromic prefix. 3) Longest Duplicate Substring (#1044): Binary search + Rabin-Karp rolling hash.',
      realWorldSystemUse:
        'GNU grep pattern matching, plagiarism detection software (Turnitin uses Rabin-Karp rolling hashes to scan billions of academic papers in parallel), and bioinformatics DNA/RNA sequence alignment tools.'
    },
    tagline: 'Linear O(N + M) substring search via prefix automata and rolling hashes.',
    description:
      'Knuth-Morris-Pratt (KMP) searches for occurrences of a pattern in a text by preprocessing the pattern into a Longest Proper Prefix which is also Suffix (LPS) array. When a mismatch occurs, the LPS table indicates the next character in the pattern to compare, never backtracking in the text string. Rabin-Karp uses a rolling polynomial hash to compare substring hashes in O(1) time.',
    primaryDataStructures: ['LPS Prefix Table', 'Rolling Polynomial Hash'],
    memoryModel: {
      layout: '1D integer LPS array of length M (pattern length). Strictly contiguous.',
      cacheLocality: 'High (text is scanned in a strictly forward linear direction).',
      pointerOverhead: 'None (primitive integer indices).',
      explanation:
        'KMP requires strictly O(M) auxiliary space for the pattern LPS array and never steps backward in the main text stream.',
    },
    complexity: [
      { operation: 'KMP Search Time', average: 'O(N + M)', worst: 'O(N + M)', notes: 'Strictly linear; never backtracks in text.' },
      { operation: 'LPS Table Preprocessing', average: 'O(M)', worst: 'O(M)', notes: 'M is pattern length.' },
      { operation: 'Rabin-Karp Rolling Hash', average: 'O(N + M)', worst: 'O(N * M)', notes: 'Worst case occurs on hash collision attacks.' },
      { operation: 'Auxiliary Space (KMP)', average: 'O(M)', worst: 'O(M)', notes: 'Stores LPS table.' },
    ],
    realWorldApplications: [
      {
        title: 'Plagiarism Detection Engines (Turnitin)',
        domain: 'Information Retrieval',
        description: 'Rabin-Karp rolling hash (fingerprinting) partitions submitted essays into k-grams, matching overlapping sentences against billions of indexed documents in linear time.',
      },
      {
        title: 'Bioinformatics DNA Sequence Alignment (BLAST)',
        domain: 'Genomics',
        description: 'KMP and Boyer-Moore variants scan gigabase human genome sequences to locate specific gene promoter motifs without backtracking.',
      },
    ],
    leetcodeBenchmarks: [
      {
        id: 'find-index-first-occurrence',
        title: 'Find Index of First Occurrence (#28)',
        difficulty: 'Easy',
        pattern: 'KMP Substring Search',
        whyThisStructure: 'Classical substring search solved in optimal O(N + M) time using KMP LPS table.',
      },
      {
        id: 'shortest-palindrome-kmp',
        title: 'Shortest Palindrome (#214)',
        difficulty: 'Hard',
        pattern: 'LPS Table Palindrome Prefix',
        whyThisStructure: 'Computes LPS table on s + "#" + reverse(s) to find the longest palindromic prefix in O(N).',
      },
    ],
    scratchImplementation: {
      language: 'TypeScript',
      code: `// KMP Algorithm: O(N + M) Substring Search
function strStrKMP(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  const m = needle.length;
  const n = haystack.length;

  // Build LPS (Longest Proper Prefix which is also Suffix)
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    if (needle[i] === needle[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  // Scan haystack
  let hIdx = 0;
  let nIdx = 0;
  while (hIdx < n) {
    if (haystack[hIdx] === needle[nIdx]) {
      hIdx++;
      nIdx++;
    }
    if (nIdx === m) {
      return hIdx - m; // Match found!
    } else if (hIdx < n && haystack[hIdx] !== needle[nIdx]) {
      if (nIdx !== 0) {
        nIdx = lps[nIdx - 1];
      } else {
        hIdx++;
      }
    }
  }

  return -1;
}`,
      keyTakeaway:
        'KMP never increments backwards in the haystack text: hIdx strictly increases, guaranteeing O(N + M) linear performance.',
    },
    youtubeQuery: 'kmp algorithm knuth morris pratt lps table explained',
    quiz: [
      {
        id: 'q1-kmp',
        question: 'What is the primary operational advantage of the KMP algorithm over naive substring search?',
        options: [
          'KMP works on numbers instead of characters.',
          'The text pointer never backtracks, allowing streaming processing of endless texts where past characters cannot be re-read.',
          'KMP uses O(1) total memory.',
          'KMP runs in O(log N) time.',
        ],
        correctIndex: 1,
        explanation:
          'Because KMP uses the LPS table to adjust the pattern pointer on mismatch, the main text pointer strictly moves forward. This enables single-pass streaming across network packets or files without buffering past characters.',
      },
    ],
  },
];
