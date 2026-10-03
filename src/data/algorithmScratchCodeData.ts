import { StructureCode } from './scratchCodeData';
import { CLASSICAL_ALGORITHM_SCRATCH_CODE_DATABASE } from './classicalScratchCodeData';

const CORE_ALGORITHM_SCRATCH_CODE_DATABASE: Record<string, StructureCode> = {
  'binary-search': {
    keyTakeaway:
      'Always calculate mid as `low + (high - low) // 2` to avoid 32-bit integer overflow, and use `low <= high` with `low = mid + 1` and `high = mid - 1` for clean convergence.',
    snippets: {
      python: `# Python Binary Search (Iterative & Exact)
def binary_search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      typescript: `// TypeScript Binary Search (Iterative & Exact)
function binarySearch(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}`,
      java: `// Java Binary Search (Iterative & Exact)
public class BinarySearch {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2; // Prevents 32-bit overflow
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
}`,
      cpp: `// C++ Binary Search (Iterative & Exact)
#include <vector>

int binarySearch(const std::vector<int>& nums, int target) {
    int low = 0, high = (int)nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      go: `// Go Binary Search (Iterative & Exact)
package main

func binarySearch(nums []int, target int) int {
    low, high := 0, len(nums)-1
    for low <= high {
        mid := low + (high-low)/2
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return -1
}`,
    },
  },

  'two-pointers': {
    keyTakeaway:
      'On sorted sequences, incrementing left strictly increases candidate sum and decrementing right strictly decreases sum. In-place array operations use a fast read pointer and slow write pointer.',
    snippets: {
      python: `# Python Two Pointers (Sorted Two Sum & Remove Duplicates)
def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        curr = nums[left] + nums[right]
        if curr == target:
            return [left, right]
        elif curr < target:
            left += 1
        else:
            right -= 1
    return []`,
      typescript: `// TypeScript Two Pointers (Sorted Two Sum)
function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }

  return [];
}`,
      java: `// Java Two Pointers (Sorted Two Sum)
public class TwoPointers {
    public static int[] twoSumSorted(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) return new int[]{left, right};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }
}`,
      cpp: `// C++ Two Pointers (Sorted Two Sum)
#include <vector>

std::vector<int> twoSumSorted(const std::vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
      go: `// Go Two Pointers (Sorted Two Sum)
package main

func twoSumSorted(nums []int, target int) []int {
    left, right := 0, len(nums)-1
    for left < right {
        sum := nums[left] + nums[right]
        if sum == target {
            return []int{left, right}
        } else if sum < target {
            left++
        } else {
            right--
        }
    }
    return []int{}
}`,
    },
  },

  'sliding-window': {
    keyTakeaway:
      'Expand right pointer to absorb elements into window; while condition is violated, shrink left pointer to restore invariant. Total operations = 2N = O(N) amortized.',
    snippets: {
      python: `# Python Sliding Window: Longest Substring Without Repeating
def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    max_len = 0
    left = 0

    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len`,
      typescript: `// TypeScript Sliding Window: Longest Substring Without Repeating
function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
      left = lastSeen.get(char)! + 1;
    }
    lastSeen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
      java: `// Java Sliding Window: Longest Substring Without Repeating
import java.util.HashMap;
import java.util.Map;

public class SlidingWindow {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLen = 0, left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
                left = lastSeen.get(c) + 1;
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}`,
      cpp: `// C++ Sliding Window: Longest Substring Without Repeating
#include <string>
#include <vector>
#include <algorithm>

int lengthOfLongestSubstring(const std::string& s) {
    std::vector<int> lastSeen(128, -1);
    int maxLen = 0, left = 0;

    for (int right = 0; right < (int)s.size(); ++right) {
        char c = s[right];
        if (lastSeen[c] >= left) {
            left = lastSeen[c] + 1;
        }
        lastSeen[c] = right;
        maxLen = std::max(maxLen, right - left + 1);
    }

    return maxLen;
}`,
      go: `// Go Sliding Window: Longest Substring Without Repeating
package main

func lengthOfLongestSubstring(s string) int {
    lastSeen := make(map[byte]int)
    maxLen, left := 0, 0

    for right := 0; right < len(s); right++ {
        c := s[right]
        if prevIdx, exists := lastSeen[c]; exists && prevIdx >= left {
            left = prevIdx + 1
        }
        lastSeen[c] = right
        if currLen := right - left + 1; currLen > maxLen {
            maxLen = currLen
        }
    }

    return maxLen
}`,
    },
  },

  bfs: {
    keyTakeaway:
      'Freeze level size `levelSize = q.length` before each layer loop to process trees level by level. Always mark nodes as visited immediately upon ENQUEUEING.',
    snippets: {
      python: `# Python BFS Template (Level-by-Level on Graph)
from collections import deque

def bfs_shortest_path(adj: dict, start: int, target: int) -> int:
    queue = deque([(start, 0)]) # (node, distance)
    visited = {start}

    while queue:
        curr, dist = queue.popleft()
        if curr == target:
            return dist

        for neighbor in adj.get(curr, []):
            if neighbor not in visited:
                visited.add(neighbor) # Mark upon enqueue!
                queue.append((neighbor, dist + 1))

    return -1`,
      typescript: `// TypeScript BFS Template (Flat Array Queue with Head Pointer)
function bfsShortestPath(adj: number[][], start: number, target: number): number {
  const queue: [number, number][] = [[start, 0]];
  const visited = new Set<number>([start]);
  let head = 0;

  while (head < queue.length) {
    const [curr, dist] = queue[head++];
    if (curr === target) return dist;

    for (const neighbor of adj[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor); // Mark immediately
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return -1;
}`,
      java: `// Java BFS Template
import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.List;
import java.util.Queue;
import java.util.Set;

public class BFS {
    public static int shortestPath(List<Integer>[] adj, int start, int target) {
        Queue<int[]> q = new ArrayDeque<>();
        Set<Integer> visited = new HashSet<>();

        q.offer(new int[]{start, 0});
        visited.add(start);

        while (!q.isEmpty()) {
            int[] entry = q.poll();
            int curr = entry[0], dist = entry[1];
            if (curr == target) return dist;

            for (int next : adj[curr]) {
                if (visited.add(next)) { // Atomically checks and adds
                    q.offer(new int[]{next, dist + 1});
                }
            }
        }
        return -1;
    }
}`,
      cpp: `// C++ BFS Template
#include <vector>
#include <queue>

int bfsShortestPath(const std::vector<std::vector<int>>& adj, int start, int target) {
    int n = adj.size();
    std::queue<std::pair<int, int>> q;
    std::vector<bool> visited(n, false);

    q.push({start, 0});
    visited[start] = true;

    while (!q.empty()) {
        auto [curr, dist] = q.front();
        q.pop();
        if (curr == target) return dist;

        for (int next : adj[curr]) {
            if (!visited[next]) {
                visited[next] = true;
                q.push({next, dist + 1});
            }
        }
    }
    return -1;
}`,
      go: `// Go BFS Template
package main

func bfsShortestPath(adj [][]int, start, target int) int {
    type item struct{ node, dist int }
    queue := []item{{node: start, dist: 0}}
    visited := make([]bool, len(adj))
    visited[start] = true

    head := 0
    for head < len(queue) {
        curr := queue[head]; head++
        if curr.node == target {
            return curr.dist
        }
        for _, next := range adj[curr.node] {
            if !visited[next] {
                visited[next] = true
                queue = append(queue, item{node: next, dist: curr.dist + 1})
            }
        }
    }
    return -1
}`,
    },
  },

  'dfs-backtracking': {
    keyTakeaway:
      'The 3-Step Backtracking Discipline: 1. CHOOSE (mutate current state) -> 2. EXPLORE (recurse to next depth) -> 3. UN-CHOOSE (pop/undo mutation). Always clone snapshots.',
    snippets: {
      python: `# Python Backtracking Template: Subsets
def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    current = []

    def backtrack(start: int):
        result.append(list(current)) # Snapshot copy!
        for i in range(start, len(nums)):
            current.append(nums[i])  # Choose
            backtrack(i + 1)         # Explore
            current.pop()            # Un-choose

    backtrack(0)
    return result`,
      typescript: `// TypeScript Backtracking Template: Subsets
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const current: number[] = [];

  function backtrack(start: number) {
    result.push([...current]); // Snapshot copy!
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);  // Choose
      backtrack(i + 1);       // Explore
      current.pop();          // Un-choose
    }
  }

  backtrack(0);
  return result;
}`,
      java: `// Java Backtracking Template: Subsets
import java.util.ArrayList;
import java.util.List;

public class Backtracking {
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrack(0, nums, current, result);
        return result;
    }

    private static void backtrack(int start, int[] nums, List<Integer> curr, List<List<Integer>> res) {
        res.add(new ArrayList<>(curr)); // Snapshot copy!
        for (int i = start; i < nums.length; i++) {
            curr.add(nums[i]);     // Choose
            backtrack(i + 1, nums, curr, res); // Explore
            curr.remove(curr.size() - 1); // Un-choose
        }
    }
}`,
      cpp: `// C++ Backtracking Template: Subsets
#include <vector>

void backtrack(int start, const std::vector<int>& nums, std::vector<int>& curr, std::vector<std::vector<int>>& res) {
    res.push_back(curr); // Copies vector
    for (int i = start; i < (int)nums.size(); ++i) {
        curr.push_back(nums[i]); // Choose
        backtrack(i + 1, nums, curr, res); // Explore
        curr.pop_back(); // Un-choose
    }
}

std::vector<std::vector<int>> subsets(const std::vector<int>& nums) {
    std::vector<std::vector<int>> res;
    std::vector<int> curr;
    backtrack(0, nums, curr, res);
    return res;
}`,
      go: `// Go Backtracking Template: Subsets
package main

func subsets(nums []int) [][]int {
    var result [][]int
    var current []int

    var backtrack func(start int)
    backtrack = func(start int) {
        snapshot := make([]int, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)

        for i := start; i < len(nums); i++ {
            current = append(current, nums[i])
            backtrack(i + 1)
            current = current[:len(current)-1]
        }
    }

    backtrack(0)
    return result
}`,
    },
  },

  sorting: {
    keyTakeaway:
      'In-place QuickSort uses a pivot to partition arrays in O(N log N) average time. MergeSort guarantees O(N log N) worst-case time with stability at the cost of O(N) extra RAM.',
    snippets: {
      python: `# Python MergeSort (Stable O(N log N))
def merge_sort(nums: list[int]) -> list[int]:
    if len(nums) <= 1:
        return nums

    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])

    # Merge step
    merged, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged`,
      typescript: `// TypeScript In-Place QuickSort
function quickSort(arr: number[], low = 0, high = arr.length - 1): void {
  if (low < high) {
    const pIdx = partition(arr, low, high);
    quickSort(arr, low, pIdx - 1);
    quickSort(arr, pIdx + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
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
      java: `// Java MergeSort
public class MergeSort {
    public static void sort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            sort(arr, left, mid);
            sort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    private static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        while (i <= mid && j <= right) {
            temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
        }
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, left, temp.length);
    }
}`,
      cpp: `// C++ QuickSort
#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; ++j) {
        if (arr[j] < pivot) std::swap(arr[i++], arr[j]);
    }
    std::swap(arr[i], arr[high]);
    return i;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}`,
      go: `// Go MergeSort
package main

func mergeSort(nums []int) []int {
    if len(nums) <= 1 {
        return nums
    }
    mid := len(nums) / 2
    left := mergeSort(nums[:mid])
    right := mergeSort(nums[mid:])

    result := make([]int, 0, len(left)+len(right))
    i, j := 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i]); i++
        } else {
            result = append(result, right[j]); j++
        }
    }
    result = append(result, left[i:]...)
    result = append(result, right[j:]...)
    return result
}`,
    },
  },

  'dynamic-programming': {
    keyTakeaway:
      'Define the subproblem meaning in plain English (e.g. `dp[i]` = min coins to make amount `i`). Always verify base cases and state transition order before compressing space.',
    snippets: {
      python: `# Python Dynamic Programming: Coin Change (Bottom-Up)
def coin_change(coins: list[int], amount: int) -> int:
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0 # 0 coins needed for amount 0

    for a in range(1, amount + 1):
        for coin in coins:
            if a - coin >= 0:
                dp[a] = min(dp[a], 1 + dp[a - coin])

    return dp[amount] if dp[amount] != float("inf") else -1`,
      typescript: `// TypeScript Dynamic Programming: Coin Change (Bottom-Up)
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      java: `// Java Dynamic Programming: Coin Change
import java.util.Arrays;

public class DP {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // Sentinel max value
        dp[0] = 0;

        for (int a = 1; a <= amount; a++) {
            for (int coin : coins) {
                if (a - coin >= 0) {
                    dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
                }
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      cpp: `// C++ Dynamic Programming: Coin Change
#include <vector>
#include <algorithm>

int coinChange(const std::vector<int>& coins, int amount) {
    std::vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;

    for (int a = 1; a <= amount; ++a) {
        for (int coin : coins) {
            if (a - coin >= 0) {
                dp[a] = std::min(dp[a], 1 + dp[a - coin]);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}`,
      go: `// Go Dynamic Programming: Coin Change
package main

func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = amount + 1
    }
    dp[0] = 0

    for a := 1; a <= amount; a++ {
        for _, coin := range coins {
            if a-coin >= 0 {
                if 1+dp[a-coin] < dp[a] {
                    dp[a] = 1 + dp[a-coin]
                }
            }
        }
    }

    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}`,
    },
  },

  greedy: {
    keyTakeaway:
      'Sort intervals by END time when scheduling tasks to free resources earliest. In reachability problems (Jump Game), track maximum reach index greedily.',
    snippets: {
      python: `# Python Greedy: Non-Overlapping Intervals
def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0

    intervals.sort(key=lambda x: x[1]) # Sort by END time
    non_overlap_count = 1
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start >= last_end:
            non_overlap_count += 1
            last_end = end

    return len(intervals) - non_overlap_count`,
      typescript: `// TypeScript Greedy: Non-Overlapping Intervals
function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;

  intervals.sort((a, b) => a[1] - b[1]); // Sort by END time
  let nonOverlapCount = 1;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= lastEnd) {
      nonOverlapCount++;
      lastEnd = intervals[i][1];
    }
  }

  return intervals.length - nonOverlapCount;
}`,
      java: `// Java Greedy: Non-Overlapping Intervals
import java.util.Arrays;

public class Greedy {
    public static int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1])); // Sort by END time

        int count = 1;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= lastEnd) {
                count++;
                lastEnd = intervals[i][1];
            }
        }

        return intervals.length - count;
    }
}`,
      cpp: `// C++ Greedy: Non-Overlapping Intervals
#include <vector>
#include <algorithm>

int eraseOverlapIntervals(std::vector<std::vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1]; // Sort by END time
    });

    int count = 1;
    int lastEnd = intervals[0][1];

    for (size_t i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] >= lastEnd) {
            count++;
            lastEnd = intervals[i][1];
        }
    }

    return (int)intervals.size() - count;
}`,
      go: `// Go Greedy: Non-Overlapping Intervals
package main

import "sort"

func eraseOverlapIntervals(intervals [][]int) int {
    if len(intervals) == 0 {
        return 0
    }
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][1] < intervals[j][1] // Sort by END time
    })

    count := 1
    lastEnd := intervals[0][1]

    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] >= lastEnd {
            count++
            lastEnd = intervals[i][1]
        }
    }

    return len(intervals) - count
}`,
    },
  },

  'bit-manipulation': {
    keyTakeaway:
      'Key bitwise identities: `x ^ x = 0`, `x ^ 0 = x` (cancellation); `n & (n - 1)` clears lowest set bit; `n & -n` isolates lowest set bit.',
    snippets: {
      python: `# Python Bit Manipulation: Single Number & Count Set Bits
def single_number(nums: list[int]) -> int:
    unique = 0
    for num in nums:
        unique ^= num
    return unique

def count_set_bits(n: int) -> int:
    count = 0
    while n != 0:
        n &= (n - 1) # Brian Kernighan: clears lowest 1-bit
        count += 1
    return count`,
      typescript: `// TypeScript Bit Manipulation: Single Number & Count Bits
function singleNumber(nums: number[]): number {
  let unique = 0;
  for (const num of nums) unique ^= num;
  return unique;
}

function countSetBits(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1); // Clears lowest set bit
    count++;
  }
  return count;
}`,
      java: `// Java Bit Manipulation
public class BitManipulation {
    public static int singleNumber(int[] nums) {
        int unique = 0;
        for (int num : nums) unique ^= num;
        return unique;
    }

    public static int countSetBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1);
            count++;
        }
        return count;
    }
}`,
      cpp: `// C++ Bit Manipulation
#include <vector>

int singleNumber(const std::vector<int>& nums) {
    int unique = 0;
    for (int num : nums) unique ^= num;
    return unique;
}

int countSetBits(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
      go: `// Go Bit Manipulation
package main

func singleNumber(nums []int) int {
    unique := 0
    for _, num := range nums {
        unique ^= num
    }
    return unique
}

func countSetBits(n int) int {
    count := 0
    for n != 0 {
        n &= (n - 1)
        count++
    }
    return count
}`,
    },
  },

  'topological-sort': {
    keyTakeaway:
      'Kahn’s algorithm enqueues nodes with in-degree 0. Each dequeued node decrements neighbor in-degrees. If processed count < V, a directed cycle exists.',
    snippets: {
      python: `# Python Kahn's Topological Sort
from collections import deque

def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(num_courses)]
    in_degree = [0] * num_courses

    for course, prereq in prerequisites:
        adj[prereq].append(course)
        in_degree[course] += 1

    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    order = []

    while queue:
        curr = queue.popleft()
        order.append(curr)
        for next_course in adj[curr]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                queue.append(next_course)

    return order if len(order) == num_courses else []`,
      typescript: `// TypeScript Kahn's Topological Sort
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const inDegree = new Array(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);

  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }

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
      if (--inDegree[nextCourse] === 0) {
        queue.push(nextCourse);
      }
    }
  }

  return order.length === numCourses ? order : [];
}`,
      java: `// Java Kahn's Topological Sort
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class TopSort {
    public static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<Integer>[] adj = new ArrayList[numCourses];
        for (int i = 0; i < numCourses; i++) adj[i] = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int[] p : prerequisites) {
            adj[p[1]].add(p[0]);
            inDegree[p[0]]++;
        }

        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);

        int[] order = new int[numCourses];
        int idx = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            order[idx++] = curr;
            for (int nxt : adj[curr]) {
                if (--inDegree[nxt] == 0) q.offer(nxt);
            }
        }

        return idx == numCourses ? order : new int[0];
    }
}`,
      cpp: `// C++ Kahn's Topological Sort
#include <vector>
#include <queue>

std::vector<int> findOrder(int numCourses, const std::vector<std::vector<int>>& prerequisites) {
    std::vector<std::vector<int>> adj(numCourses);
    std::vector<int> inDegree(numCourses, 0);

    for (const auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }

    std::queue<int> q;
    for (int i = 0; i < numCourses; ++i) if (inDegree[i] == 0) q.push(i);

    std::vector<int> order;
    while (!q.empty()) {
        int curr = q.front(); q.pop();
        order.push_back(curr);
        for (int nxt : adj[curr]) {
            if (--inDegree[nxt] == 0) q.push(nxt);
        }
    }

    return (int)order.size() == numCourses ? order : std::vector<int>();
}`,
      go: `// Go Kahn's Topological Sort
package main

func findOrder(numCourses int, prerequisites [][]int) []int {
    adj := make([][]int, numCourses)
    inDegree := make([]int, numCourses)

    for _, p := range prerequisites {
        course, prereq := p[0], p[1]
        adj[prereq] = append(adj[prereq], course)
        inDegree[course]++
    }

    queue := make([]int, 0)
    for i := 0; i < numCourses; i++ {
        if inDegree[i] == 0 {
            queue = append(queue, i)
        }
    }

    order := make([]int, 0, numCourses)
    for len(queue) > 0 {
        curr := queue[0]; queue = queue[1:]
        order = append(order, curr)
        for _, nextCourse := range adj[curr] {
            inDegree[nextCourse]--
            if inDegree[nextCourse] == 0 {
                queue = append(queue, nextCourse)
            }
        }
    }

    if len(order) != numCourses {
        return []int{}
    }
    return order
}`,
    },
  },
};

export const ALGORITHM_SCRATCH_CODE_DATABASE: Record<string, StructureCode> = {
  ...CORE_ALGORITHM_SCRATCH_CODE_DATABASE,
  ...CLASSICAL_ALGORITHM_SCRATCH_CODE_DATABASE,
};

