export type SupportedLanguage = 'python' | 'typescript' | 'java' | 'cpp' | 'go';

export interface LanguageOption {
  id: SupportedLanguage;
  label: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'python', label: 'Python 3', badge: 'Most Popular' },
  { id: 'typescript', label: 'TypeScript / JS', badge: 'Full-Stack' },
  { id: 'java', label: 'Java', badge: 'Enterprise' },
  { id: 'cpp', label: 'C++', badge: 'High Perf' },
  { id: 'go', label: 'Go', badge: 'Backend' },
];

export interface StructureCode {
  keyTakeaway: string;
  snippets: Record<SupportedLanguage, string>;
}

export const SCRATCH_CODE_DATABASE: Record<string, StructureCode> = {
  arrays: {
    keyTakeaway:
      'Geometric doubling (capacity * 2) guarantees that N appends take O(N) total copying work, yielding an amortized O(1) cost per append.',
    snippets: {
      python: `# Python Dynamic Array from Scratch
class DynamicArray:
    def __init__(self, capacity: int = 4):
        self.capacity = capacity
        self.length = 0
        self.data = [None] * self.capacity

    def get(self, index: int):
        if index < 0 or index >= self.length:
            raise IndexError("Index out of bounds")
        return self.data[index]

    def push(self, val):
        if self.length == self.capacity:
            self._resize(self.capacity * 2)  # Doubling capacity
        self.data[self.length] = val
        self.length += 1

    def _resize(self, new_capacity: int):
        new_data = [None] * new_capacity
        for i in range(self.length):
            new_data[i] = self.data[i]
        self.data = new_data
        self.capacity = new_capacity

    def __len__(self):
        return self.length`,
      typescript: `// TypeScript Dynamic Array from Scratch
class DynamicArray<T> {
  private data: (T | undefined)[];
  private capacity: number;
  private length: number;

  constructor(initialCapacity = 4) {
    this.capacity = initialCapacity;
    this.length = 0;
    this.data = new Array(this.capacity);
  }

  public get(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new RangeError("Index out of bounds");
    }
    return this.data[index]!;
  }

  public push(value: T): void {
    if (this.length === this.capacity) {
      this.resize(this.capacity * 2); // Doubling ensures O(1) amortized append
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

  public size(): number {
    return this.length;
  }
}`,
      java: `// Java Dynamic Array from Scratch
public class DynamicArray<T> {
    private Object[] data;
    private int capacity;
    private int size;

    public DynamicArray(int initialCapacity) {
        this.capacity = Math.max(initialCapacity, 1);
        this.size = 0;
        this.data = new Object[this.capacity];
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        return (T) data[index];
    }

    public void push(T val) {
        if (size == capacity) {
            resize(capacity * 2); // Amortized O(1) doubling
        }
        data[size++] = val;
    }

    private void resize(int newCapacity) {
        Object[] next = new Object[newCapacity];
        System.arraycopy(data, 0, next, 0, size);
        data = next;
        capacity = newCapacity;
    }

    public int size() {
        return size;
    }
}`,
      cpp: `// C++ Dynamic Array (Vector) from Scratch
#include <stdexcept>
#include <iostream>

template <typename T>
class DynamicArray {
private:
    T* data;
    int capacity;
    int length;

    void resize(int newCapacity) {
        T* next = new T[newCapacity];
        for (int i = 0; i < length; ++i) {
            next[i] = std::move(data[i]);
        }
        delete[] data;
        data = next;
        capacity = newCapacity;
    }

public:
    DynamicArray(int initialCapacity = 4) : capacity(initialCapacity), length(0) {
        data = new T[capacity];
    }

    ~DynamicArray() {
        delete[] data;
    }

    T& get(int index) {
        if (index < 0 || index >= length) throw std::out_of_range("Index out of bounds");
        return data[index];
    }

    void push(const T& val) {
        if (length == capacity) {
            resize(capacity * 2);
        }
        data[length++] = val;
    }

    int size() const { return length; }
};`,
      go: `// Go Dynamic Array (Slice) Pattern from Scratch
package main

import "errors"

type DynamicArray[T any] struct {
    data     []T
    length   int
    capacity int
}

func NewDynamicArray[T any](initialCap int) *DynamicArray[T] {
    return &DynamicArray[T]{
        data:     make([]T, initialCap),
        length:   0,
        capacity: initialCap,
    }
}

func (a *DynamicArray[T]) Get(idx int) (T, error) {
    var zero T
    if idx < 0 || idx >= a.length {
        return zero, errors.New("index out of bounds")
    }
    return a.data[idx], nil
}

func (a *DynamicArray[T]) Push(val T) {
    if a.length == a.capacity {
        a.resize(a.capacity * 2)
    }
    a.data[a.length] = val
    a.length++
}

func (a *DynamicArray[T]) resize(newCap int) {
    next := make([]T, newCap)
    copy(next, a.data[:a.length])
    a.data = next
    a.capacity = newCap
}`,
    },
  },

  'linked-lists': {
    keyTakeaway:
      'In Doubly Linked Lists, always reassign the neighboring pointers before severing current node links. Sentinel (dummy) head and tail nodes eliminate null checks.',
    snippets: {
      python: `# Python Doubly Linked List with Sentinel Nodes
class ListNode:
    def __init__(self, val=0, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next

class DoublyLinkedList:
    def __init__(self):
        # Dummy head and tail eliminate empty list edge cases
        self.head = ListNode(0)
        self.tail = ListNode(0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def prepend(self, val: int) -> ListNode:
        node = ListNode(val)
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        return node

    def remove_node(self, node: ListNode) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev`,
      typescript: `// TypeScript Doubly Linked List with Sentinel Nodes
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  prev: ListNode<T> | null = null;
  constructor(val: T) {
    this.value = val;
  }
}

class DoublyLinkedList<T> {
  public head: ListNode<T>;
  public tail: ListNode<T>;

  constructor() {
    // Dummy sentinel nodes prevent null check bugs
    this.head = new ListNode<T>(null as any);
    this.tail = new ListNode<T>(null as any);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public prepend(val: T): ListNode<T> {
    const node = new ListNode(val);
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
    return node;
  }

  public removeNode(node: ListNode<T>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }
}`,
      java: `// Java Doubly Linked List with Sentinel Nodes
public class DoublyLinkedList<T> {
    public static class Node<T> {
        public T val;
        public Node<T> prev;
        public Node<T> next;
        public Node(T val) { this.val = val; }
    }

    private final Node<T> head;
    private final Node<T> tail;

    public DoublyLinkedList() {
        head = new Node<>(null);
        tail = new Node<>(null);
        head.next = tail;
        tail.prev = head;
    }

    public Node<T> prepend(T val) {
        Node<T> node = new Node<>(val);
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
        return node;
    }

    public void removeNode(Node<T> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}`,
      cpp: `// C++ Doubly Linked List with Sentinel Pointers
template <typename T>
class DoublyLinkedList {
public:
    struct Node {
        T val;
        Node* prev;
        Node* next;
        Node(T v) : val(v), prev(nullptr), next(nullptr) {}
    };

private:
    Node* head;
    Node* tail;

public:
    DoublyLinkedList() {
        head = new Node(T{});
        tail = new Node(T{});
        head->next = tail;
        tail->prev = head;
    }

    ~DoublyLinkedList() {
        Node* curr = head;
        while (curr) {
            Node* nxt = curr->next;
            delete curr;
            curr = nxt;
        }
    }

    Node* prepend(T val) {
        Node* node = new Node(val);
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
        return node;
    }

    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
        delete node;
    }
};`,
      go: `// Go Doubly Linked List
package main

type ListNode[T any] struct {
    Val  T
    Prev *ListNode[T]
    Next *ListNode[T]
}

type DoublyLinkedList[T any] struct {
    head *ListNode[T]
    tail *ListNode[T]
}

func NewDoublyLinkedList[T any]() *DoublyLinkedList[T] {
    h := &ListNode[T]{}
    t := &ListNode[T]{}
    h.Next = t
    t.Prev = h
    return &DoublyLinkedList[T]{head: h, tail: t}
}

func (l *DoublyLinkedList[T]) Prepend(val T) *ListNode[T] {
    node := &ListNode[T]{Val: val}
    node.Next = l.head.Next
    node.Prev = l.head
    l.head.Next.Prev = node
    l.head.Next = node
    return node
}

func (l *DoublyLinkedList[T]) RemoveNode(node *ListNode[T]) {
    node.Prev.Next = node.Next
    node.Next.Prev = node.Prev
}`,
    },
  },

  'hash-tables': {
    keyTakeaway:
      'Separate chaining stores colliding entries in bucket lists. A 31-multiplier polynomial rolling hash provides uniform distribution with fast bit-shift multiplication.',
    snippets: {
      python: `# Python Hash Map with Separate Chaining
class SimpleHashMap:
    def __init__(self, capacity: int = 16):
        self.capacity = capacity
        self.buckets = [[] for _ in range(capacity)]

    def _hash(self, key) -> int:
        return hash(key) % self.capacity

    def put(self, key, value) -> None:
        idx = self._hash(key)
        bucket = self.buckets[idx]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key):
        idx = self._hash(key)
        for k, v in self.buckets[idx]:
            if k == key:
                return v
        return None

    def remove(self, key) -> bool:
        idx = self._hash(key)
        bucket = self.buckets[idx]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return True
        return False`,
      typescript: `// TypeScript Hash Map with Separate Chaining
class SimpleHashMap<K, V> {
  private buckets: Array<Array<[K, V]>>;
  private capacity: number;

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
    for (const entry of bucket) {
      if (entry[0] === key) {
        entry[1] = value;
        return;
      }
    }
    bucket.push([key, value]);
  }

  public get(key: K): V | undefined {
    const idx = this.hash(key);
    for (const [k, v] of this.buckets[idx]) {
      if (k === key) return v;
    }
    return undefined;
  }
}`,
      java: `// Java Hash Map with Separate Chaining
import java.util.LinkedList;

public class SimpleHashMap<K, V> {
    private static class Entry<K, V> {
        K key;
        V value;
        Entry(K k, V v) { this.key = k; this.value = v; }
    }

    private final int capacity;
    private final LinkedList<Entry<K, V>>[] buckets;

    @SuppressWarnings("unchecked")
    public SimpleHashMap(int capacity) {
        this.capacity = capacity;
        this.buckets = new LinkedList[capacity];
        for (int i = 0; i < capacity; i++) {
            this.buckets[i] = new LinkedList<>();
        }
    }

    private int hash(K key) {
        return Math.abs(key.hashCode()) % capacity;
    }

    public void put(K key, V value) {
        int idx = hash(key);
        for (Entry<K, V> entry : buckets[idx]) {
            if (entry.key.equals(key)) {
                entry.value = value;
                return;
            }
        }
        buckets[idx].add(new Entry<>(key, value));
    }

    public V get(K key) {
        int idx = hash(key);
        for (Entry<K, V> entry : buckets[idx]) {
            if (entry.key.equals(key)) return entry.value;
        }
        return null;
    }
}`,
      cpp: `// C++ Hash Map with Separate Chaining
#include <vector>
#include <list>
#include <string>

template <typename K, typename V>
class SimpleHashMap {
private:
    struct Entry { K key; V val; };
    int capacity;
    std::vector<std::list<Entry>> buckets;

    int hash(const K& key) {
        return std::hash<K>{}(key) % capacity;
    }

public:
    SimpleHashMap(int cap = 16) : capacity(cap), buckets(cap) {}

    void put(const K& key, const V& val) {
        int idx = hash(key);
        for (auto& entry : buckets[idx]) {
            if (entry.key == key) {
                entry.val = val;
                return;
            }
        }
        buckets[idx].push_back({key, val});
    }

    bool get(const K& key, V& outVal) {
        int idx = hash(key);
        for (const auto& entry : buckets[idx]) {
            if (entry.key == key) {
                outVal = entry.val;
                return true;
            }
        }
        return false;
    }
};`,
      go: `// Go Hash Map with Separate Chaining
package main

import "fmt"

type Entry[K comparable, V any] struct {
    Key K
    Val V
}

type SimpleHashMap[K comparable, V any] struct {
    buckets  [][]Entry[K, V]
    capacity int
}

func NewSimpleHashMap[K comparable, V any](capacity int) *SimpleHashMap[K, V] {
    return &SimpleHashMap[K, V]{
        buckets:  make([][]Entry[K, V], capacity),
        capacity: capacity,
    }
}

func (m *SimpleHashMap[K, V]) hash(key K) int {
    str := fmt.Sprintf("%v", key)
    h := 0
    for i := 0; i < len(str); i++ {
        h = (h*31 + int(str[i])) % m.capacity
    }
    return h
}

func (m *SimpleHashMap[K, V]) Put(key K, val V) {
    idx := m.hash(key)
    for i, e := range m.buckets[idx] {
        if e.Key == key {
            m.buckets[idx][i].Val = val
            return
        }
    }
    m.buckets[idx] = append(m.buckets[idx], Entry[K, V]{Key: key, Val: val})
}`,
    },
  },

  stacks: {
    keyTakeaway:
      'Store INDICES on the monotonic stack rather than values: this preserves distance calculation, boundary identification, and direct output updates in O(N).',
    snippets: {
      python: `# Python Monotonic Decreasing Stack for Next Greater Element
def next_greater_elements(nums: list[int]) -> list[int]:
    result = [-1] * len(nums)
    stack = []  # Stores INDICES

    for i in range(len(nums)):
        # While current number is strictly greater than stack top
        while stack and nums[i] > nums[stack[-1]]:
            smaller_idx = stack.pop()
            result[smaller_idx] = nums[i]
        stack.append(i)

    return result`,
      typescript: `// TypeScript Monotonic Decreasing Stack for Next Greater Element
function nextGreaterElements(nums: number[]): number[] {
  const result = new Array(nums.length).fill(-1);
  const stack: number[] = []; // Stores INDICES

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const smallerIdx = stack.pop()!;
      result[smallerIdx] = nums[i];
    }
    stack.push(i);
  }

  return result;
}`,
      java: `// Java Monotonic Decreasing Stack for Next Greater Element
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class MonotonicStack {
    public static int[] nextGreaterElements(int[] nums) {
        int[] result = new int[nums.length];
        Arrays.fill(result, -1);
        Deque<Integer> stack = new ArrayDeque<>(); // Stores INDICES

        for (int i = 0; i < nums.length; i++) {
            while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
                int smallerIdx = stack.pop();
                result[smallerIdx] = nums[i];
            }
            stack.push(i);
        }

        return result;
    }
}`,
      cpp: `// C++ Monotonic Decreasing Stack for Next Greater Element
#include <vector>
#include <stack>

std::vector<int> nextGreaterElements(const std::vector<int>& nums) {
    std::vector<int> result(nums.size(), -1);
    std::stack<int> st; // Stores INDICES

    for (int i = 0; i < (int)nums.size(); ++i) {
        while (!st.empty() && nums[i] > nums[st.top()]) {
            int smallerIdx = st.top();
            st.pop();
            result[smallerIdx] = nums[i];
        }
        st.push(i);
    }

    return result;
}`,
      go: `// Go Monotonic Decreasing Stack for Next Greater Element
package main

func nextGreaterElements(nums []int) []int {
    result := make([]int, len(nums))
    for i := range result {
        result[i] = -1
    }
    stack := make([]int, 0, len(nums)) // Stores INDICES

    for i := 0; i < len(nums); i++ {
        for len(stack) > 0 && nums[i] > nums[stack[len(stack)-1]] {
            smallerIdx := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            result[smallerIdx] = nums[i]
        }
        stack = append(stack, i)
    }

    return result
}`,
    },
  },

  'queues-deques': {
    keyTakeaway:
      'Circular ring buffers eliminate the O(N) array shift overhead by tracking modulo head/tail index offsets in contiguous memory.',
    snippets: {
      python: `# Python Circular Ring Buffer Queue
class CircularQueue:
    def __init__(self, capacity: int = 8):
        self.capacity = capacity
        self.buffer = [None] * capacity
        self.head = 0
        self.tail = 0
        self.count = 0

    def enqueue(self, val) -> bool:
        if self.count == self.capacity:
            return False  # Queue full
        self.buffer[self.tail] = val
        self.tail = (self.tail + 1) % self.capacity
        self.count += 1
        return True

    def dequeue(self):
        if self.count == 0:
            return None  # Empty
        val = self.buffer[self.head]
        self.buffer[self.head] = None
        self.head = (self.head + 1) % self.capacity
        self.count -= 1
        return val`,
      typescript: `// TypeScript Circular Ring Buffer Queue
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
    if (this.count === this.capacity) return false;
    this.buffer[this.tail] = val;
    this.tail = (this.tail + 1) % this.capacity;
    this.count++;
    return true;
  }

  public dequeue(): T | undefined {
    if (this.count === 0) return undefined;
    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return item;
  }
}`,
      java: `// Java Circular Ring Buffer Queue
public class CircularQueue<T> {
    private final Object[] buffer;
    private final int capacity;
    private int head = 0;
    private int tail = 0;
    private int count = 0;

    public CircularQueue(int capacity) {
        this.capacity = capacity;
        this.buffer = new Object[capacity];
    }

    public boolean enqueue(T val) {
        if (count == capacity) return false;
        buffer[tail] = val;
        tail = (tail + 1) % capacity;
        count++;
        return true;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (count == 0) return null;
        T item = (T) buffer[head];
        buffer[head] = null;
        head = (head + 1) % capacity;
        count--;
        return item;
    }
}`,
      cpp: `// C++ Circular Ring Buffer Queue
#include <vector>
#include <optional>

template <typename T>
class CircularQueue {
private:
    std::vector<T> buffer;
    int capacity;
    int head = 0;
    int tail = 0;
    int count = 0;

public:
    CircularQueue(int cap = 8) : capacity(cap), buffer(cap) {}

    bool enqueue(const T& val) {
        if (count == capacity) return false;
        buffer[tail] = val;
        tail = (tail + 1) % capacity;
        count++;
        return true;
    }

    std::optional<T> dequeue() {
        if (count == 0) return std::nullopt;
        T item = buffer[head];
        head = (head + 1) % capacity;
        count--;
        return item;
    }
};`,
      go: `// Go Circular Ring Buffer Queue
package main

type CircularQueue[T any] struct {
    buffer   []T
    capacity int
    head     int
    tail     int
    count    int
}

func NewCircularQueue[T any](capacity int) *CircularQueue[T] {
    return &CircularQueue[T]{
        buffer:   make([]T, capacity),
        capacity: capacity,
    }
}

func (q *CircularQueue[T]) Enqueue(val T) bool {
    if q.count == q.capacity {
        return false
    }
    q.buffer[q.tail] = val
    q.tail = (q.tail + 1) % q.capacity
    q.count++
    return true
}

func (q *CircularQueue[T]) Dequeue() (T, bool) {
    var zero T
    if q.count == 0 {
        return zero, false
    }
    item := q.buffer[q.head]
    q.head = (q.head + 1) % q.capacity
    q.count--
    return item, true
}`,
    },
  },

  'trees-bst': {
    keyTakeaway:
      'Never validate a BST by comparing a node only with its immediate children. Propagate global minimum and maximum bounds down recursive branches.',
    snippets: {
      python: `# Python BST Validation with Min/Max Bounds
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode | None, min_val=float("-inf"), max_val=float("inf")) -> bool:
    if not root:
        return True

    # Invariant: min_val < node.val < max_val
    if not (min_val < root.val < max_val):
        return False

    return (is_valid_bst(root.left, min_val, root.val) and
            is_valid_bst(root.right, root.val, max_val))`,
      typescript: `// TypeScript BST Validation with Min/Max Bounds
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

function isValidBST(
  root: TreeNode | null,
  minVal = -Infinity,
  maxVal = Infinity
): boolean {
  if (!root) return true;

  // Strict invariant: minVal < node.val < maxVal
  if (root.val <= minVal || root.val >= maxVal) return false;

  return (
    isValidBST(root.left, minVal, root.val) &&
    isValidBST(root.right, root.val, maxVal)
  );
}`,
      java: `// Java BST Validation with Min/Max Bounds
public class ValidateBST {
    public static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    public static boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private static boolean validate(TreeNode node, Integer min, Integer max) {
        if (node == null) return true;
        if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
            return false;
        }
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
}`,
      cpp: `// C++ BST Validation with Min/Max Bounds
#include <climits>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

bool isValidBST(TreeNode* root, long long minVal = LLONG_MIN, long long maxVal = LLONG_MAX) {
    if (!root) return true;
    if (root->val <= minVal || root->val >= maxVal) return false;
    return isValidBST(root->left, minVal, root->val) &&
           isValidBST(root->right, root->val, maxVal);
}`,
      go: `// Go BST Validation with Min/Max Bounds
package main

import "math"

type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func isValidBST(root *TreeNode) bool {
    return validate(root, math.MinInt64, math.MaxInt64)
}

func validate(node *TreeNode, minVal, maxVal int64) bool {
    if node == nil {
        return true
    }
    v := int64(node.Val)
    if v <= minVal || v >= maxVal {
        return false
    }
    return validate(node.Left, minVal, v) && validate(node.Right, v, maxVal)
}`,
    },
  },

  heaps: {
    keyTakeaway:
      'To find the Kth LARGEST item, maintain a MIN-heap of size K. When the heap reaches size K+1, pop the minimum; the root element is always the Kth largest.',
    snippets: {
      python: `# Python Min-Heap from Scratch
class MinHeap:
    def __init__(self):
        self.data = []

    def push(self, val: int) -> None:
        self.data.append(val)
        self._bubble_up(len(self.data) - 1)

    def pop(self) -> int | None:
        if not self.data:
            return None
        min_val = self.data[0]
        last = self.data.pop()
        if self.data:
            self.data[0] = last
            self._bubble_down(0)
        return min_val

    def _bubble_up(self, i: int):
        while i > 0:
            parent = (i - 1) // 2
            if self.data[i] >= self.data[parent]:
                break
            self.data[i], self.data[parent] = self.data[parent], self.data[i]
            i = parent

    def _bubble_down(self, i: int):
        n = len(self.data)
        while 2 * i + 1 < n:
            smallest = 2 * i + 1
            right = smallest + 1
            if right < n and self.data[right] < self.data[smallest]:
                smallest = right
            if self.data[i] <= self.data[smallest]:
                break
            self.data[i], self.data[smallest] = self.data[smallest], self.data[i]
            i = smallest`,
      typescript: `// TypeScript Min-Heap from Scratch
class MinHeap {
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
      java: `// Java Min-Heap from Scratch
import java.util.ArrayList;

public class MinHeap {
    private final ArrayList<Integer> data = new ArrayList<>();

    public void push(int val) {
        data.add(val);
        bubbleUp(data.size() - 1);
    }

    public Integer pop() {
        if (data.isEmpty()) return null;
        int min = data.get(0);
        int last = data.remove(data.size() - 1);
        if (!data.isEmpty()) {
            data.set(0, last);
            bubbleDown(0);
        }
        return min;
    }

    private void bubbleUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data.get(i) >= data.get(parent)) break;
            swap(i, parent);
            i = parent;
        }
    }

    private void bubbleDown(int i) {
        int n = data.size();
        while (2 * i + 1 < n) {
            int smallest = 2 * i + 1;
            int right = smallest + 1;
            if (right < n && data.get(right) < data.get(smallest)) {
                smallest = right;
            }
            if (data.get(i) <= data.get(smallest)) break;
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int i, int j) {
        int temp = data.get(i);
        data.set(i, data.get(j));
        data.set(j, temp);
    }
}`,
      cpp: `// C++ Min-Heap from Scratch
#include <vector>
#include <algorithm>

class MinHeap {
private:
    std::vector<int> data;

    void bubbleUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data[i] >= data[parent]) break;
            std::swap(data[i], data[parent]);
            i = parent;
        }
    }

    void bubbleDown(int i) {
        int n = data.size();
        while (2 * i + 1 < n) {
            int smallest = 2 * i + 1;
            int right = smallest + 1;
            if (right < n && data[right] < data[smallest]) smallest = right;
            if (data[i] <= data[smallest]) break;
            std::swap(data[i], data[smallest]);
            i = smallest;
        }
    }

public:
    void push(int val) {
        data.push_back(val);
        bubbleUp(data.size() - 1);
    }

    int pop() {
        int minVal = data[0];
        data[0] = data.back();
        data.pop_back();
        if (!data.empty()) bubbleDown(0);
        return minVal;
    }
};`,
      go: `// Go Min-Heap from Scratch
package main

type MinHeap struct {
    data []int
}

func (h *MinHeap) Push(val int) {
    h.data = append(h.data, val)
    h.bubbleUp(len(h.data) - 1)
}

func (h *MinHeap) Pop() (int, bool) {
    if len(h.data) == 0 {
        return 0, false
    }
    minVal := h.data[0]
    last := h.data[len(h.data)-1]
    h.data = h.data[:len(h.data)-1]
    if len(h.data) > 0 {
        h.data[0] = last
        h.bubbleDown(0)
    }
    return minVal, true
}

func (h *MinHeap) bubbleUp(i int) {
    for i > 0 {
        parent := (i - 1) / 2
        if h.data[i] >= h.data[parent] {
            break
        }
        h.data[i], h.data[parent] = h.data[parent], h.data[i]
        i = parent
    }
}

func (h *MinHeap) bubbleDown(i int) {
    n := len(h.data)
    for 2*i+1 < n {
        smallest := 2*i + 1
        right := smallest + 1
        if right < n && h.data[right] < h.data[smallest] {
            smallest = right
        }
        if h.data[i] <= h.data[smallest] {
            break
        }
        h.data[i], h.data[smallest] = h.data[smallest], h.data[i]
        i = smallest
    }
}`,
    },
  },

  graphs: {
    keyTakeaway:
      'Kahn’s Topological Sort enqueues vertices with in-degree 0. If processed count < total vertices, the remaining nodes form a cycle.',
    snippets: {
      python: `# Python Kahn's Topological Sort (Cycle Detection)
from collections import deque

def can_finish_courses(num_courses: int, prerequisites: list[list[int]]) -> bool:
    adj = [[] for _ in range(num_courses)]
    in_degree = [0] * num_courses

    # [course, prereq] means prereq -> course
    for course, prereq in prerequisites:
        adj[prereq].append(course)
        in_degree[course] += 1

    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    visited_count = 0

    while queue:
        curr = queue.popleft()
        visited_count += 1
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited_count == num_courses  # True if DAG, False if cycle exists`,
      typescript: `// TypeScript Kahn's Topological Sort (Cycle Detection)
function canFinishCourses(numCourses: number, prerequisites: [number, number][]): boolean {
  const adj = Array.from({ length: numCourses }, () => [] as number[]);
  const inDegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course);
    inDegree[course]++;
  }

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

  return visitedCount === numCourses;
}`,
      java: `// Java Kahn's Topological Sort (Cycle Detection)
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class TopologicalSort {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        List<Integer>[] adj = new ArrayList[numCourses];
        for (int i = 0; i < numCourses; i++) adj[i] = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int[] edge : prerequisites) {
            int course = edge[0];
            int prereq = edge[1];
            adj[prereq].add(course);
            inDegree[course]++;
        }

        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }

        int visited = 0;
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            visited++;
            for (int neighbor : adj[curr]) {
                if (--inDegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        return visited == numCourses;
    }
}`,
      cpp: `// C++ Kahn's Topological Sort (Cycle Detection)
#include <vector>
#include <queue>

bool canFinish(int numCourses, const std::vector<std::vector<int>>& prerequisites) {
    std::vector<std::vector<int>> adj(numCourses);
    std::vector<int> inDegree(numCourses, 0);

    for (const auto& edge : prerequisites) {
        adj[edge[1]].push_back(edge[0]);
        inDegree[edge[0]]++;
    }

    std::queue<int> q;
    for (int i = 0; i < numCourses; ++i) {
        if (inDegree[i] == 0) q.push(i);
    }

    int visited = 0;
    while (!q.empty()) {
        int curr = q.front();
        q.pop();
        visited++;
        for (int neighbor : adj[curr]) {
            if (--inDegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    return visited == numCourses;
}`,
      go: `// Go Kahn's Topological Sort (Cycle Detection)
package main

func canFinish(numCourses int, prerequisites [][]int) bool {
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

    visited := 0
    for len(queue) > 0 {
        curr := queue[0]
        queue = queue[1:]
        visited++
        for _, neighbor := range adj[curr] {
            inDegree[neighbor]--
            if inDegree[neighbor] == 0 {
                queue = append(queue, neighbor)
            }
        }
    }

    return visited == numCourses
}`,
    },
  },

  tries: {
    keyTakeaway:
      'A Trie prefix search runs in strict O(L) time where L is the query length, entirely independent of dictionary size.',
    snippets: {
      python: `# Python Trie (Prefix Tree)
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end_of_word = True

    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.is_end_of_word

    def starts_with(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return True`,
      typescript: `// TypeScript Trie (Prefix Tree)
class TrieNode {
  children = new Map<string, TrieNode>();
  isEndOfWord = false;
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
    return true;
  }
}`,
      java: `// Java Trie (Prefix Tree)
import java.util.HashMap;
import java.util.Map;

public class Trie {
    private static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEndOfWord = false;
    }

    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            curr.children.putIfAbsent(c, new TrieNode());
            curr = curr.children.get(c);
        }
        curr.isEndOfWord = true;
    }

    public boolean startsWith(String prefix) {
        TrieNode curr = root;
        for (char c : prefix.toCharArray()) {
            if (!curr.children.containsKey(c)) return false;
            curr = curr.children.get(c);
        }
        return true;
    }
}`,
      cpp: `// C++ Trie (Prefix Tree)
#include <unordered_map>
#include <string>

class TrieNode {
public:
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord = false;
};

class Trie {
private:
    TrieNode* root;

public:
    Trie() { root = new TrieNode(); }

    void insert(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) {
                curr->children[c] = new TrieNode();
            }
            curr = curr->children[c];
        }
        curr->isEndOfWord = true;
    }

    bool startsWith(const std::string& prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return true;
    }
};`,
      go: `// Go Trie (Prefix Tree)
package main

type TrieNode struct {
    children    map[rune]*TrieNode
    isEndOfWord bool
}

type Trie struct {
    root *TrieNode
}

func NewTrie() *Trie {
    return &Trie{root: &TrieNode{children: make(map[rune]*TrieNode)}}
}

func (t *Trie) Insert(word string) {
    curr := t.root
    for _, ch := range word {
        if _, exists := curr.children[ch]; !exists {
            curr.children[ch] = &TrieNode{children: make(map[rune]*TrieNode)}
        }
        curr = curr.children[ch]
    }
    curr.isEndOfWord = true
}

func (t *Trie) StartsWith(prefix string) bool {
    curr := t.root
    for _, ch := range prefix {
        if _, exists := curr.children[ch]; !exists {
            return false
        }
        curr = curr.children[ch]
    }
    return true
}`,
    },
  },

  'union-find': {
    keyTakeaway:
      'Path Compression flattens parent trees on lookup; Union by Rank attaches shorter trees under taller trees. Together, they achieve near-constant O(α(N)) operations.',
    snippets: {
      python: `# Python Disjoint Set Union (Union-Find) with Path Compression & Rank
class UnionFind:
    def __init__(self, size: int):
        self.parent = list(range(size))
        self.rank = [0] * size
        self.count = size

    # Find with Path Compression
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    # Union by Rank
    def union(self, x: int, y: int) -> bool:
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False  # Already in same set (Cycle detected!)

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        self.count -= 1
        return True`,
      typescript: `// TypeScript Disjoint Set Union (Union-Find)
class UnionFind {
  private parent: number[];
  private rank: number[];
  public count: number;

  constructor(size: number) {
    this.count = size;
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  // Find with Path Compression: flattens tree directly to root
  public find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  // Union by Rank: keeps tree height logarithmic
  public union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

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
      java: `// Java Disjoint Set Union (Union-Find)
public class UnionFind {
    private final int[] parent;
    private final int[] rank;
    public int count;

    public UnionFind(int size) {
        this.count = size;
        this.parent = new int[size];
        this.rank = new int[size];
        for (int i = 0; i < size; i++) parent[i] = i;
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        count--;
        return true;
    }
}`,
      cpp: `// C++ Disjoint Set Union (Union-Find)
#include <vector>
#include <numeric>

class UnionFind {
private:
    std::vector<int> parent;
    std::vector<int> rank;

public:
    int count;

    UnionFind(int size) : count(size), parent(size), rank(size, 0) {
        std::iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }

    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        count--;
        return true;
    }
};`,
      go: `// Go Disjoint Set Union (Union-Find)
package main

type UnionFind struct {
    parent []int
    rank   []int
    Count  int
}

func NewUnionFind(size int) *UnionFind {
    parent := make([]int, size)
    for i := range parent {
        parent[i] = i
    }
    return &UnionFind{
        parent: parent,
        rank:   make([]int, size),
        Count:  size,
    }
}

func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x]) // Path compression
    }
    return uf.parent[x]
}

func (uf *UnionFind) Union(x, y int) bool {
    rx := uf.Find(x)
    ry := uf.Find(y)
    if rx == ry {
        return false
    }

    if uf.rank[rx] < uf.rank[ry] {
        uf.parent[rx] = ry
    } else if uf.rank[rx] > uf.rank[ry] {
        uf.parent[ry] = rx
    } else {
        uf.parent[ry] = rx
        uf.rank[rx]++
    }
    uf.Count--
    return true
}`,
    },
  },
};
