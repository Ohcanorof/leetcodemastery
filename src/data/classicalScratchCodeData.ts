import { StructureCode } from './scratchCodeData';

export const CLASSICAL_ALGORITHM_SCRATCH_CODE_DATABASE: Record<string, StructureCode> = {
  'bubble-selection-sort': {
    keyTakeaway:
      'Selection Sort guarantees at most N total write operations (swaps), which minimizes wear on physical Flash memory and EEPROM cells. Bubble Sort with an early-exit flag verifies sorted streams in O(N).',
    snippets: {
      python: `# Python: Selection Sort (O(N) writes) & Bubble Sort (O(N) early exit)
def selection_sort(nums: list[int]) -> list[int]:
    n = len(nums)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        if min_idx != i:
            nums[i], nums[min_idx] = nums[min_idx], nums[i] # Max N writes total
    return nums

def bubble_sort(nums: list[int]) -> list[int]:
    n = len(nums)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = True
        if not swapped: # Early exit in O(N) if already sorted
            break
    return nums`,
      typescript: `// TypeScript: Selection Sort (O(N) writes) & Bubble Sort (O(N) early exit)
export function selectionSort(nums: number[]): number[] {
  const n = nums.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]]; // At most N writes
    }
  }
  return nums;
}

export function bubbleSort(nums: number[]): number[] {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // O(N) best case
  }
  return nums;
}`,
      java: `// Java: Selection Sort & Early-Exit Bubble Sort
public class ClassicalSorting {
    public static void selectionSort(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (nums[j] < nums[minIdx]) minIdx = j;
            }
            if (minIdx != i) {
                int temp = nums[i];
                nums[i] = nums[minIdx];
                nums[minIdx] = temp; // Strictly <= N writes
            }
        }
    }

    public static void bubbleSort(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (nums[j] > nums[j + 1]) {
                    int temp = nums[j];
                    nums[j] = nums[j + 1];
                    nums[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
      cpp: `// C++: Selection Sort (Flash wear-leveling) & Bubble Sort
#include <vector>
#include <utility>

void selectionSort(std::vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (nums[j] < nums[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            std::swap(nums[i], nums[minIdx]); // Exactly 1 swap per outer step
        }
    }
}

void bubbleSort(std::vector<int>& nums) {
    int n = nums.size();
    for (int i = 0; i < n; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (nums[j] > nums[j + 1]) {
                std::swap(nums[j], nums[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Early termination in O(N)
    }
}`,
      go: `// Go: Selection Sort & Bubble Sort
package main

func selectionSort(nums []int) {
    n := len(nums)
    for i := 0; i < n-1; i++ {
        minIdx := i
        for j := i + 1; j < n; j++ {
            if nums[j] < nums[minIdx] {
                minIdx = j
            }
        }
        if minIdx != i {
            nums[i], nums[minIdx] = nums[minIdx], nums[i]
        }
    }
}

func bubbleSort(nums []int) {
    n := len(nums)
    for i := 0; i < n; i++ {
        swapped := false
        for j := 0; j < n-i-1; j++ {
            if nums[j] > nums[j+1] {
                nums[j], nums[j+1] = nums[j+1], nums[j]
                swapped = true
            }
        }
        if !swapped {
            break
        }
    }
}`,
    },
  },
  'insertion-sort': {
    keyTakeaway:
      'Insertion Sort runs in strictly O(N) on nearly-sorted data and has near-zero overhead. Timsort (Python), V8 (JavaScript), and Java switch to it for small subarrays (N <= 32–64) due to 100% L1 cache hits.',
    snippets: {
      python: `# Python: Adaptive Insertion Sort
def insertion_sort(nums: list[int]) -> list[int]:
    for i in range(1, len(nums)):
        key = nums[i]
        j = i - 1
        # Shift elements of nums[0..i-1] that are greater than key
        while j >= 0 and nums[j] > key:
            nums[j + 1] = nums[j]
            j -= 1
        nums[j + 1] = key
    return nums`,
      typescript: `// TypeScript: Adaptive Insertion Sort (L1 Cache Optimized)
export function insertionSort(nums: number[]): number[] {
  for (let i = 1; i < nums.length; i++) {
    const key = nums[i];
    let j = i - 1;
    while (j >= 0 && nums[j] > key) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = key;
  }
  return nums;
}`,
      java: `// Java: Insertion Sort with Primitive Array Shift
public class InsertionSort {
    public static void sort(int[] nums) {
        int n = nums.length;
        for (int i = 1; i < n; i++) {
            int key = nums[i];
            int j = i - 1;
            while (j >= 0 && nums[j] > key) {
                nums[j + 1] = nums[j];
                j--;
            }
            nums[j + 1] = key;
        }
    }
}`,
      cpp: `// C++: Insertion Sort (Used in std::sort for sub-partitions <= 16)
#include <vector>

void insertionSort(std::vector<int>& nums) {
    int n = nums.size();
    for (int i = 1; i < n; ++i) {
        int key = nums[i];
        int j = i - 1;
        while (j >= 0 && nums[j] > key) {
            nums[j + 1] = nums[j];
            --j;
        }
        nums[j + 1] = key;
    }
}`,
      go: `// Go: Insertion Sort
package main

func insertionSort(nums []int) {
    for i := 1; i < len(nums); i++ {
        key := nums[i]
        j := i - 1
        for j >= 0 && nums[j] > key {
            nums[j+1] = nums[j]
            j--
        }
        nums[j+1] = key
    }
}`,
    },
  },
  'merge-sort-classical': {
    keyTakeaway:
      'Merge Sort guarantees O(N log N) worst-case time, is stable, and only requires sequential access—making it the gold standard for external disk sorting (Postgres/MapReduce). On arrays, preallocate ONE temp buffer to avoid GC thrashing.',
    snippets: {
      python: `# Python: Merge Sort with Reusable Scratch Buffer
def merge_sort(nums: list[int]) -> list[int]:
    temp = [0] * len(nums)

    def sort(left: int, right: int):
        if left >= right:
            return
        mid = (left + right) // 2
        sort(left, mid)
        sort(mid + 1, right)
        merge(left, mid, right)

    def merge(left: int, mid: int, right: int):
        i, j, k = left, mid + 1, left
        while i <= mid and j <= right:
            if nums[i] <= nums[j]: # <= maintains stability
                temp[k] = nums[i]
                i += 1
            else:
                temp[k] = nums[j]
                j += 1
            k += 1
        while i <= mid:
            temp[k] = nums[i]; i += 1; k += 1
        while j <= right:
            temp[k] = nums[j]; j += 1; k += 1
        for p in range(left, right + 1):
            nums[p] = temp[p]

    if nums:
        sort(0, len(nums) - 1)
    return nums`,
      typescript: `// TypeScript: Merge Sort with Preallocated Temp Array
export function mergeSort(nums: number[]): number[] {
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
      temp[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
    }
    while (i <= mid) temp[k++] = nums[i++];
    while (j <= right) temp[k++] = nums[j++];
    for (let p = left; p <= right; p++) nums[p] = temp[p];
  }

  if (nums.length > 0) sort(0, nums.length - 1);
  return nums;
}`,
      java: `// Java: High-Performance Merge Sort
public class MergeSort {
    public static void sort(int[] nums) {
        if (nums == null || nums.length <= 1) return;
        int[] temp = new int[nums.length]; // Preallocate once
        mergeSort(nums, temp, 0, nums.length - 1);
    }

    private static void mergeSort(int[] nums, int[] temp, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(nums, temp, left, mid);
        mergeSort(nums, temp, mid + 1, right);
        merge(nums, temp, left, mid, right);
    }

    private static void merge(int[] nums, int[] temp, int left, int mid, int right) {
        int i = left, j = mid + 1, k = left;
        while (i <= mid && j <= right) {
            temp[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
        }
        while (i <= mid) temp[k++] = nums[i++];
        while (j <= right) temp[k++] = nums[j++];
        System.arraycopy(temp, left, nums, left, right - left + 1);
    }
}`,
      cpp: `// C++: Merge Sort with Auxiliary Buffer
#include <vector>

void merge(std::vector<int>& nums, std::vector<int>& temp, int left, int mid, int right) {
    int i = left, j = mid + 1, k = left;
    while (i <= mid && j <= right) {
        temp[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
    }
    while (i <= mid) temp[k++] = nums[i++];
    while (j <= right) temp[k++] = nums[j++];
    for (int p = left; p <= right; ++p) nums[p] = temp[p];
}

void mergeSortInternal(std::vector<int>& nums, std::vector<int>& temp, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSortInternal(nums, temp, left, mid);
    mergeSortInternal(nums, temp, mid + 1, right);
    merge(nums, temp, left, mid, right);
}

void mergeSort(std::vector<int>& nums) {
    if (nums.empty()) return;
    std::vector<int> temp(nums.size());
    mergeSortInternal(nums, temp, 0, (int)nums.size() - 1);
}`,
      go: `// Go: Merge Sort with Reusable Buffer
package main

func mergeSort(nums []int) {
    if len(nums) <= 1 {
        return
    }
    temp := make([]int, len(nums))
    var sort func(int, int)
    sort = func(left, right int) {
        if left >= right {
            return
        }
        mid := left + (right-left)/2
        sort(left, mid)
        sort(mid+1, right)
        
        i, j, k := left, mid+1, left
        for i <= mid && j <= right {
            if nums[i] <= nums[j] {
                temp[k] = nums[i]; i++
            } else {
                temp[k] = nums[j]; j++
            }
            k++
        }
        for i <= mid { temp[k] = nums[i]; i++; k++ }
        for j <= right { temp[k] = nums[j]; j++; k++ }
        copy(nums[left:right+1], temp[left:right+1])
    }
    sort(0, len(nums)-1)
}`,
    },
  },
  'quicksort-hoare': {
    keyTakeaway:
      'Hoare partitioning uses two pointers converging inwards. It executes ~3x fewer swaps than Lomuto and handles duplicates cleanly. QuickSelect discards one half to find the Kth element in expected O(N) time.',
    snippets: {
      python: `# Python: QuickSelect (Kth Largest in Expected O(N)) & Hoare QuickSort
def find_kth_largest(nums: list[int], k: number) -> int:
    target_idx = len(nums) - k

    def quick_select(left: int, right: int) -> int:
        pivot = nums[right]
        p = left
        for i in range(left, right):
            if nums[i] <= pivot:
                nums[i], nums[p] = nums[p], nums[i]
                p += 1
        nums[p], nums[right] = nums[right], nums[p]

        if p == target_idx:
            return nums[p]
        elif p < target_idx:
            return quick_select(p + 1, right)
        else:
            return quick_select(left, p - 1)

    return quick_select(0, len(nums) - 1)`,
      typescript: `// TypeScript: QuickSelect (Order Statistics in Expected O(N))
export function findKthLargest(nums: number[], k: number): number {
  const targetIdx = nums.length - k;

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
      java: `// Java: QuickSelect in O(N) Expected Time
public class QuickSelect {
    public static int findKthLargest(int[] nums, int k) {
        int targetIdx = nums.length - k;
        return select(nums, 0, nums.length - 1, targetIdx);
    }

    private static int select(int[] nums, int left, int right, int targetIdx) {
        int pivot = nums[right];
        int p = left;
        for (int i = left; i < right; i++) {
            if (nums[i] <= pivot) {
                int temp = nums[i]; nums[i] = nums[p]; nums[p] = temp;
                p++;
            }
        }
        int temp = nums[p]; nums[p] = nums[right]; nums[right] = temp;

        if (p == targetIdx) return nums[p];
        if (p < targetIdx) return select(nums, p + 1, right, targetIdx);
        return select(nums, left, p - 1, targetIdx);
    }
}`,
      cpp: `// C++: QuickSelect & std::nth_element Equivalent
#include <vector>
#include <utility>

int quickSelect(std::vector<int>& nums, int left, int right, int targetIdx) {
    int pivot = nums[right];
    int p = left;
    for (int i = left; i < right; ++i) {
        if (nums[i] <= pivot) {
            std::swap(nums[i], nums[p++]);
        }
    }
    std::swap(nums[p], nums[right]);

    if (p == targetIdx) return nums[p];
    if (p < targetIdx) return quickSelect(nums, p + 1, right, targetIdx);
    return quickSelect(nums, left, p - 1, targetIdx);
}

int findKthLargest(std::vector<int>& nums, int k) {
    int targetIdx = (int)nums.size() - k;
    return quickSelect(nums, 0, (int)nums.size() - 1, targetIdx);
}`,
      go: `// Go: QuickSelect for Kth Largest Element
package main

func findKthLargest(nums []int, k int) int {
    targetIdx := len(nums) - k
    var select func(int, int) int
    select = func(left, right int) int {
        pivot := nums[right]
        p := left
        for i := left; i < right; i++ {
            if nums[i] <= pivot {
                nums[i], nums[p] = nums[p], nums[i]
                p++
            }
        }
        nums[p], nums[right] = nums[right], nums[p]

        if p == targetIdx {
            return nums[p]
        } else if p < targetIdx {
            return select(p+1, right)
        }
        return select(left, p-1)
    }
    return select(0, len(nums)-1)
}`,
    },
  },
  'counting-radix-sort': {
    keyTakeaway:
      'Counting Sort and LSD Radix Sort beat the comparison lower bound Ω(N log N) by sorting on bitwise digit slices in O(d * (N + Base)). Iterating backwards during placement is required for stability.',
    snippets: {
      python: `# Python: LSD Radix Sort for Non-Negative Integers
def radix_sort(nums: list[int]) -> list[int]:
    if not nums:
        return nums
    max_val = max(nums)
    exp = 1
    n = len(nums)
    output = [0] * n

    while max_val // exp > 0:
        count = [0] * 10
        for x in nums:
            count[(x // exp) % 10] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        # Iterate backwards for stable sorting!
        for i in range(n - 1, -1, -1):
            digit = (nums[i] // exp) % 10
            output[count[digit] - 1] = nums[i]
            count[digit] -= 1
        for i in range(n):
            nums[i] = output[i]
        exp *= 10

    return nums`,
      typescript: `// TypeScript: LSD Radix Sort in O(d * (N + 10))
export function radixSort(nums: number[]): number[] {
  if (nums.length <= 1) return nums;
  const maxVal = Math.max(...nums);
  const n = nums.length;
  const output = new Array(n);

  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) {
      count[Math.floor(nums[i] / exp) % 10]++;
    }
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    // Reverse scan to ensure stability!
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(nums[i] / exp) % 10;
      output[count[digit] - 1] = nums[i];
      count[digit]--;
    }
    for (let i = 0; i < n; i++) nums[i] = output[i];
  }
  return nums;
}`,
      java: `// Java: Radix Sort for Integers
import java.util.Arrays;

public class RadixSort {
    public static void sort(int[] nums) {
        if (nums == null || nums.length <= 1) return;
        int max = nums[0];
        for (int v : nums) if (v > max) max = v;

        int n = nums.length;
        int[] output = new int[n];

        for (int exp = 1; max / exp > 0; exp *= 10) {
            int[] count = new int[10];
            for (int i = 0; i < n; i++) count[(nums[i] / exp) % 10]++;
            for (int i = 1; i < 10; i++) count[i] += count[i - 1];
            for (int i = n - 1; i >= 0; i--) {
                int digit = (nums[i] / exp) % 10;
                output[count[digit] - 1] = nums[i];
                count[digit]--;
            }
            System.arraycopy(output, 0, nums, 0, n);
        }
    }
}`,
      cpp: `// C++: Radix Sort (LSD Base 10)
#include <vector>
#include <algorithm>

void radixSort(std::vector<int>& nums) {
    if (nums.empty()) return;
    int maxVal = *std::max_element(nums.begin(), nums.end());
    int n = nums.size();
    std::vector<int> output(n);

    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        int count[10] = {0};
        for (int i = 0; i < n; ++i) count[(nums[i] / exp) % 10]++;
        for (int i = 1; i < 10; ++i) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; --i) {
            int digit = (nums[i] / exp) % 10;
            output[count[digit] - 1] = nums[i];
            count[digit]--;
        }
        for (int i = 0; i < n; ++i) nums[i] = output[i];
    }
}`,
      go: `// Go: Radix Sort (Base 10)
package main

func radixSort(nums []int) {
    if len(nums) <= 1 { return }
    maxVal := nums[0]
    for _, v := range nums { if v > maxVal { maxVal = v } }

    n := len(nums)
    output := make([]int, n)

    for exp := 1; maxVal/exp > 0; exp *= 10 {
        var count [10]int
        for i := 0; i < n; i++ { count[(nums[i]/exp)%10]++ }
        for i := 1; i < 10; i++ { count[i] += count[i-1] }
        for i := n - 1; i >= 0; i-- {
            digit := (nums[i] / exp) % 10
            output[count[digit]-1] = nums[i]
            count[digit]--
        }
        copy(nums, output)
    }
}`,
    },
  },
  'dijkstra-shortest-path': {
    keyTakeaway:
      'Dijkstra operates in O((V + E) log V) with a Min-Heap. Always check `if (d > dist[u]) continue;` to discard obsolete heap entries from earlier relaxations.',
    snippets: {
      python: `# Python: Dijkstra's Shortest Path with heapq
import heapq

def dijkstra(n: int, edges: list[list[int]], src: int) -> list[int]:
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))

    dist = [float('inf')] * n
    dist[src] = 0
    pq = [(0, src)] # (distance, node)

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: # Stale entry check!
            continue
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))

    return dist`,
      typescript: `// TypeScript: Dijkstra's Shortest Path Algorithm
export function dijkstra(n: number, edges: number[][], src: number): number[] {
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w]);

  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const pq: [number, number][] = [[0, src]]; // [distance, node]

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (d > dist[u]) continue; // Skip stale heap entry

    for (const [v, weight] of adj[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.push([dist[v], v]);
      }
    }
  }

  return dist;
}`,
      java: `// Java: Dijkstra's Algorithm using PriorityQueue
import java.util.*;

public class Dijkstra {
    public static int[] shortestPath(int n, int[][] edges, int src) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) adj.get(e[0]).add(new int[]{e[1], e[2]});

        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        // Min-heap ordering by distance
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        pq.offer(new int[]{0, src});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], u = curr[1];
            if (d > dist[u]) continue;

            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }
}`,
      cpp: `// C++: Dijkstra with std::priority_queue
#include <vector>
#include <queue>
#include <climits>

std::vector<int> dijkstra(int n, const std::vector<std::vector<int>>& edges, int src) {
    std::vector<std::vector<std::pair<int, int>>> adj(n);
    for (const auto& e : edges) adj[e[0]].push_back({e[1], e[2]});

    std::vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    // Min-heap storing pair: {distance, node}
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;

        for (const auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      go: `// Go: Dijkstra Shortest Path with container/heap
package main

import (
    "container/heap"
    "math"
)

type Item struct { node, dist int }
type PriorityQueue []Item
func (pq PriorityQueue) Len() int           { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq PriorityQueue) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x any)        { *pq = append(*pq, x.(Item)) }
func (pq *PriorityQueue) Pop() any          { old := *pq; n := len(old); item := old[n-1]; *pq = old[0 : n-1]; return item }

func dijkstra(n int, edges [][]int, src int) []int {
    adj := make([][][2]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], [2]int{e[1], e[2]}) }

    dist := make([]int, n)
    for i := range dist { dist[i] = math.MaxInt32 }
    dist[src] = 0

    pq := &PriorityQueue{}
    heap.Init(pq)
    heap.Push(pq, Item{node: src, dist: 0})

    for pq.Len() > 0 {
        curr := heap.Pop(pq).(Item)
        if curr.dist > dist[curr.node] { continue }
        for _, edge := range adj[curr.node] {
            v, w := edge[0], edge[1]
            if dist[curr.node]+w < dist[v] {
                dist[v] = dist[curr.node] + w
                heap.Push(pq, Item{node: v, dist: dist[v]})
            }
        }
    }
    return dist
}`,
    },
  },
  'bellman-ford': {
    keyTakeaway:
      'Bellman-Ford relaxes all edges V-1 times to guarantee shortest paths even with negative edge weights. If any edge can still relax on the V-th pass, a negative cycle exists (currency arbitrage).',
    snippets: {
      python: `# Python: Bellman-Ford with Negative Cycle Detection
def bellman_ford(n: int, edges: list[list[int]], src: int):
    dist = [float('inf')] * n
    dist[src] = 0

    # Relax edges V - 1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w

    # V-th iteration: Check for negative cycles
    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            has_negative_cycle = True
            break

    return dist, has_negative_cycle`,
      typescript: `// TypeScript: Bellman-Ford Shortest Paths & Negative Cycles
export function bellmanFord(
  n: number,
  edges: [number, number, number][],
  src: number
): { dist: number[]; hasNegativeCycle: boolean } {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;

  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  let hasNegativeCycle = false;
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  return { dist, hasNegativeCycle };
}`,
      java: `// Java: Bellman-Ford Shortest Path Algorithm
import java.util.Arrays;

public class BellmanFord {
    public static class Result {
        public int[] dist;
        public boolean hasNegativeCycle;
        public Result(int[] d, boolean c) { dist = d; hasNegativeCycle = c; }
    }

    public static Result run(int n, int[][] edges, int src) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        for (int i = 0; i < n - 1; i++) {
            for (int[] e : edges) {
                int u = e[0], v = e[1], w = e[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }

        boolean cycle = false;
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                cycle = true;
                break;
            }
        }
        return new Result(dist, cycle);
    }
}`,
      cpp: `// C++: Bellman-Ford Algorithm with Negative Cycle Detection
#include <vector>
#include <climits>

struct Result {
    std::vector<int> dist;
    bool hasNegativeCycle;
};

Result bellmanFord(int n, const std::vector<std::vector<int>>& edges, int src) {
    std::vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    for (int i = 0; i < n - 1; ++i) {
        for (const auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    bool cycle = false;
    for (const auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
            cycle = true;
            break;
        }
    }
    return {dist, cycle};
}`,
      go: `// Go: Bellman-Ford Shortest Path
package main

import "math"

func bellmanFord(n int, edges [][]int, src int) ([]int, bool) {
    dist := make([]int, n)
    for i := range dist { dist[i] = math.MaxInt32 }
    dist[src] = 0

    for i := 0; i < n-1; i++ {
        for _, e := range edges {
            u, v, w := e[0], e[1], e[2]
            if dist[u] != math.MaxInt32 && dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
            }
        }
    }

    hasCycle := false
    for _, e := range edges {
        u, v, w := e[0], e[1], e[2]
        if dist[u] != math.MaxInt32 && dist[u]+w < dist[v] {
            hasCycle = true
            break
        }
    }
    return dist, hasCycle
}`,
    },
  },
  'string-search-kmp': {
    keyTakeaway:
      'Knuth-Morris-Pratt constructs an LPS table in O(M) time and never backtracks in the main text stream, guaranteeing strict O(N + M) single-pass substring search.',
    snippets: {
      python: `# Python: KMP Linear Substring Search in O(N + M)
def str_str_kmp(haystack: str, needle: str) -> int:
    if not needle:
        return 0
    m, n = len(needle), len(haystack)

    # Build LPS (Longest Proper Prefix which is also Suffix)
    lps = [0] * m
    length, i = 0, 1
    while i < m:
        if needle[i] == needle[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1

    # Scan haystack without ever backtracking h_idx
    h_idx = n_idx = 0
    while h_idx < n:
        if haystack[h_idx] == needle[n_idx]:
            h_idx += 1
            n_idx += 1
        if n_idx == m:
            return h_idx - m # Match found!
        elif h_idx < n and haystack[h_idx] != needle[n_idx]:
            if n_idx != 0:
                n_idx = lps[n_idx - 1]
            else:
                h_idx += 1
    return -1`,
      typescript: `// TypeScript: KMP Algorithm in O(N + M)
export function strStrKMP(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  const m = needle.length;
  const n = haystack.length;

  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    if (needle[i] === needle[len]) {
      lps[i++] = ++len;
    } else {
      if (len !== 0) len = lps[len - 1];
      else lps[i++] = 0;
    }
  }

  let hIdx = 0, nIdx = 0;
  while (hIdx < n) {
    if (haystack[hIdx] === needle[nIdx]) {
      hIdx++;
      nIdx++;
    }
    if (nIdx === m) return hIdx - m;
    else if (hIdx < n && haystack[hIdx] !== needle[nIdx]) {
      if (nIdx !== 0) nIdx = lps[nIdx - 1];
      else hIdx++;
    }
  }
  return -1;
}`,
      java: `// Java: KMP Substring Matching
public class KMP {
    public static int strStr(String haystack, String needle) {
        if (needle.isEmpty()) return 0;
        int m = needle.length(), n = haystack.length();

        int[] lps = new int[m];
        int len = 0, i = 1;
        while (i < m) {
            if (needle.charAt(i) == needle.charAt(len)) {
                lps[i++] = ++len;
            } else {
                if (len != 0) len = lps[len - 1];
                else lps[i++] = 0;
            }
        }

        int hIdx = 0, nIdx = 0;
        while (hIdx < n) {
            if (haystack.charAt(hIdx) == needle.charAt(nIdx)) {
                hIdx++;
                nIdx++;
            }
            if (nIdx == m) return hIdx - m;
            else if (hIdx < n && haystack.charAt(hIdx) != needle.charAt(nIdx)) {
                if (nIdx != 0) nIdx = lps[nIdx - 1];
                else hIdx++;
            }
        }
        return -1;
    }
}`,
      cpp: `// C++: Knuth-Morris-Pratt (KMP) Substring Match
#include <string>
#include <vector>

int strStrKMP(const std::string& haystack, const std::string& needle) {
    if (needle.empty()) return 0;
    int m = needle.size(), n = haystack.size();

    std::vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (needle[i] == needle[len]) {
            lps[i++] = ++len;
        } else {
            if (len != 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
    }

    int hIdx = 0, nIdx = 0;
    while (hIdx < n) {
        if (haystack[hIdx] == needle[nIdx]) {
            hIdx++; nIdx++;
        }
        if (nIdx == m) return hIdx - m;
        else if (hIdx < n && haystack[hIdx] != needle[nIdx]) {
            if (nIdx != 0) nIdx = lps[nIdx - 1];
            else hIdx++;
        }
    }
    return -1;
}`,
      go: `// Go: KMP Substring Search
package main

func strStrKMP(haystack string, needle string) int {
    if len(needle) == 0 { return 0 }
    m, n := len(needle), len(haystack)

    lps := make([]int, m)
    length, i := 0, 1
    for i < m {
        if needle[i] == needle[length] {
            length++
            lps[i] = length
            i++
        } else {
            if length != 0 {
                length = lps[length-1]
            } else {
                lps[i] = 0
                i++
            }
        }
    }

    hIdx, nIdx := 0, 0
    for hIdx < n {
        if haystack[hIdx] == needle[nIdx] {
            hIdx++; nIdx++
        }
        if nIdx == m {
            return hIdx - m
        } else if hIdx < n && haystack[hIdx] != needle[nIdx] {
            if nIdx != 0 {
                nIdx = lps[nIdx-1]
            } else {
                hIdx++
            }
        }
    }
    return -1
}`,
    },
  },
};
