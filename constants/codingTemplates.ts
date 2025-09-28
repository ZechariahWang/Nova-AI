// Predefined function templates for common coding interview problems

export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';

interface CodingTemplate {
  functionName: string;
  languages: Record<SupportedLanguage, string>;
}

// Common coding interview problems and their function signatures
export const codingTemplates: { [key: string]: CodingTemplate } = {
  "two sum": {
    functionName: "twoSum",
    languages: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here

};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here

}`,
      python: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here

    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here

    }
};`
    }
  },
  "reverse string": {
    functionName: "reverseString",
    languages: {
      javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
    // Your code here

};`,
      typescript: `function reverseString(s: string[]): void {
    // Your code here

}`,
      python: `def reverse_string(s):
    """
    :type s: List[str]
    :rtype: None Do not return anything, modify s in-place instead.
    """
    # Your code here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here

    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here

    }
};`
    }
  },
  "valid parentheses": {
    functionName: "isValid",
    languages: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Your code here

};`,
      typescript: `function isValid(s: string): boolean {
    // Your code here

}`,
      python: `def is_valid(s):
    """
    :type s: str
    :rtype: bool
    """
    # Your code here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your code here

    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Your code here

    }
};`
    }
  },
  "merge two sorted lists": {
    functionName: "mergeTwoLists",
    languages: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    // Your code here

};`,
      typescript: `class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
    }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    // Your code here

}`,
      python: `# Definition for singly-linked list.
# class ListNode(object):
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution(object):
    def mergeTwoLists(self, list1, list2):
        """
        :type list1: ListNode
        :type list2: ListNode
        :rtype: ListNode
        """
        # Your code here
        pass`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your code here

    }
}`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Your code here

    }
};`
    }
  },
  "maximum subarray": {
    functionName: "maxSubArray",
    languages: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    // Your code here

};`,
      typescript: `function maxSubArray(nums: number[]): number {
    // Your code here

}`,
      python: `def max_sub_array(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # Your code here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here

    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Your code here

    }
};`
    }
  },
  "binary search": {
    functionName: "search",
    languages: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    // Your code here

};`,
      typescript: `function search(nums: number[], target: number): number {
    // Your code here

}`,
      python: `def search(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # Your code here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here

    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Your code here

    }
};`
    }
  },
  "fibonacci": {
    functionName: "fibonacci",
    languages: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var fibonacci = function(n) {
    // Your code here

};`,
      typescript: `function fibonacci(n: number): number {
    // Your code here

}`,
      python: `def fibonacci(n):
    """
    :type n: int
    :rtype: int
    """
    # Your code here
    pass`,
      java: `class Solution {
    public int fibonacci(int n) {
        // Your code here

    }
}`,
      cpp: `class Solution {
public:
    int fibonacci(int n) {
        // Your code here

    }
};`
    }
  },
  "palindrome": {
    functionName: "isPalindrome",
    languages: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // Your code here

};`,
      typescript: `function isPalindrome(s: string): boolean {
    // Your code here

}`,
      python: `def is_palindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    # Your code here
    pass`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Your code here

    }
}`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Your code here

    }
};`
    }
  },
  "climbing stairs": {
    functionName: "climbStairs",
    languages: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    // Your code here

};`,
      typescript: `function climbStairs(n: number): number {
    // Your code here

}`,
      python: `def climb_stairs(n):
    """
    :type n: int
    :rtype: int
    """
    # Your code here
    pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Your code here

    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Your code here

    }
};`
    }
  },
  "best time to buy and sell stock": {
    functionName: "maxProfit",
    languages: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // Your code here

};`,
      typescript: `function maxProfit(prices: number[]): number {
    // Your code here

}`,
      python: `def max_profit(prices):
    """
    :type prices: List[int]
    :rtype: int
    """
    # Your code here
    pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your code here

    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Your code here

    }
};`
    }
  }
};

// Function to match question text to coding template
export function findCodingTemplate(question: string): CodingTemplate | null {
  const questionLower = question.toLowerCase();

  // Check for exact matches first
  for (const [key, template] of Object.entries(codingTemplates)) {
    if (questionLower.includes(key)) {
      return template;
    }
  }

  // Check for partial matches with keywords
  const keywords = {
    "sum": "two sum",
    "reverse": "reverse string",
    "parentheses": "valid parentheses",
    "brackets": "valid parentheses",
    "merge": "merge two sorted lists",
    "linked list": "merge two sorted lists",
    "subarray": "maximum subarray",
    "kadane": "maximum subarray",
    "search": "binary search",
    "fib": "fibonacci",
    "palindrome": "palindrome",
    "climb": "climbing stairs",
    "stairs": "climbing stairs",
    "stock": "best time to buy and sell stock",
    "profit": "best time to buy and sell stock"
  };

  for (const [keyword, templateKey] of Object.entries(keywords)) {
    if (questionLower.includes(keyword)) {
      return codingTemplates[templateKey];
    }
  }

  return null;
}

// Function to get initial code for coding interview
export function getInitialCodingCode(questions: string[], language: string): string {
  if (!questions || questions.length === 0) {
    return getDefaultCodeForLanguage(language);
  }

  // Try to find a template for the first question
  const firstQuestion = questions[0];
  const template = findCodingTemplate(firstQuestion);

  if (template && template.languages[language as SupportedLanguage]) {
    return template.languages[language as SupportedLanguage];
  }

  return getDefaultCodeForLanguage(language);
}

// Fallback to default code if no template matches
function getDefaultCodeForLanguage(language: string): string {
  const defaultCodes: Record<SupportedLanguage, string> = {
    javascript: '// Write your code here\nconsole.log("Hello, World!");',
    typescript: '// Write your code here\nconsole.log("Hello, World!");',
    python: '# Write your code here\nprint("Hello, World!")',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}'
  };

  return defaultCodes[language as SupportedLanguage] || defaultCodes.javascript;
}