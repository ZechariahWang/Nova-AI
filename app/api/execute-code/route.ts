import { NextResponse } from 'next/server';
import { TestCase } from '@/constants/codingTemplates';

export async function POST(request: Request) {
  try {
    const { code, language, testCases, questions } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // For security reasons, we'll simulate code execution locally
    // In a production environment, you'd want to use a secure sandbox service
    let output = '';

    // If test cases are provided, run them
    if (testCases && testCases.length > 0) {
      const testResults: string[] = [];

      switch (language) {
        case 'javascript':
        case 'typescript':
          try {
            // Execute the code to define the function
            const functionNames = ['twoSum', 'reverseString', 'isValid', 'mergeTwoLists', 'maxSubArray', 'search', 'fibonacci', 'isPalindrome', 'climbStairs', 'maxProfit'];
            const wrappedCode = `
              (function() {
                ${code};
                const exports = {};
                ${functionNames.map(name => `try { if (typeof ${name} !== 'undefined') exports.${name} = ${name}; } catch(e) {}`).join('\n')}
                return exports;
              })()
            `;

            try {
              // Try to extract functions from eval
              const functions = eval(wrappedCode);

              // Run each test case
              for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i] as TestCase;
                try {
                  // Try common function names
                  let result;
                  let functionFound = false;

                  // Check each possible function name
                  const functionNames = ['twoSum', 'reverseString', 'isValid', 'mergeTwoLists', 'maxSubArray', 'search', 'fibonacci', 'isPalindrome', 'climbStairs', 'maxProfit'];

                  for (const funcName of functionNames) {
                    if (functions[funcName] && typeof functions[funcName] === 'function') {
                      functionFound = true;

                      // Special handling for reverseString (in-place modification)
                      if (funcName === 'reverseString') {
                        const input = [...testCase.input[0]];
                        functions[funcName](input);
                        result = input;
                      } else {
                        result = functions[funcName](...testCase.input);
                      }
                      break;
                    }
                  }

                  if (!functionFound) {
                    testResults.push(`Test ${i + 1}: ✗ ERROR\n  No recognized function found. Make sure your function is defined.`);
                    continue;
                  }

                  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
                  const status = passed ? '✓ PASS' : '✗ FAIL';
                  testResults.push(`Test ${i + 1}: ${status}\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Got: ${JSON.stringify(result)}`);
                } catch (err) {
                  testResults.push(`Test ${i + 1}: ✗ ERROR\n  ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
              }
              output = testResults.join('\n\n');
            } catch (evalError) {
              // Fallback: try direct eval
              eval(code);

              // Try to find the function in global scope
              const globalScope = global as any;

              for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i] as TestCase;
                try {
                  let result;
                  let functionFound = false;

                  const functionNames = ['twoSum', 'reverseString', 'isValid', 'mergeTwoLists', 'maxSubArray', 'search', 'fibonacci', 'isPalindrome', 'climbStairs', 'maxProfit'];

                  for (const funcName of functionNames) {
                    if (typeof globalScope[funcName] === 'function') {
                      functionFound = true;

                      if (funcName === 'reverseString') {
                        const input = [...testCase.input[0]];
                        globalScope[funcName](input);
                        result = input;
                      } else {
                        result = globalScope[funcName](...testCase.input);
                      }
                      break;
                    }
                  }

                  if (!functionFound) {
                    testResults.push(`Test ${i + 1}: ✗ ERROR\n  No recognized function found`);
                    continue;
                  }

                  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
                  const status = passed ? '✓ PASS' : '✗ FAIL';
                  testResults.push(`Test ${i + 1}: ${status}\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Got: ${JSON.stringify(result)}`);
                } catch (err) {
                  testResults.push(`Test ${i + 1}: ✗ ERROR\n  ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
              }
              output = testResults.join('\n\n');
            }
          } catch (error) {
            output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          break;

        case 'python':
          try {
            // Extract function name from code
            const functionMatch = code.match(/def\s+(\w+)\s*\(/);
            const functionName = functionMatch ? functionMatch[1] : null;

            if (!functionName) {
              output = 'Error: Could not find function definition in Python code';
              break;
            }

            // Try to use child_process if Python is available, otherwise show test info
            let pythonAvailable = false;
            let pythonCommand = 'python3';
            try {
              const { execSync } = await import('child_process');
              // Test if Python is available (try python3, python, or wsl python3)
              try {
                execSync('python3 --version', { stdio: 'ignore' });
                pythonAvailable = true;
                pythonCommand = 'python3';
              } catch {
                try {
                  execSync('python --version', { stdio: 'ignore' });
                  pythonAvailable = true;
                  pythonCommand = 'python';
                } catch {
                  try {
                    execSync('wsl python3 --version', { stdio: 'ignore' });
                    pythonAvailable = true;
                    pythonCommand = 'wsl python3';
                  } catch {
                    pythonAvailable = false;
                  }
                }
              }

              // Run each test case
              for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i] as TestCase;
                try {
                  // Create test code that calls the function
                  const testCode = `
${code}

# Test case ${i + 1}
import json
result = ${functionName}(${testCase.input.map((inp: any) => JSON.stringify(inp)).join(', ')})
print(json.dumps(result))
`;

                  try {
                    // Execute Python code
                    const result = execSync(pythonCommand, {
                      input: testCode,
                      encoding: 'utf-8',
                      timeout: 5000,
                      maxBuffer: 1024 * 1024,
                    }).trim();

                    // Parse the result
                    let parsedResult;
                    try {
                      parsedResult = JSON.parse(result);
                    } catch {
                      parsedResult = result;
                    }

                    const passed = JSON.stringify(parsedResult) === JSON.stringify(testCase.expected);
                    const status = passed ? '✓ PASS' : '✗ FAIL';
                    testResults.push(`Test ${i + 1}: ${status}\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Got: ${JSON.stringify(parsedResult)}`);
                  } catch (execError) {
                    // If Python execution fails, show error
                    const errorMsg = execError instanceof Error ? execError.message : 'Execution error';
                    testResults.push(`Test ${i + 1}: ✗ ERROR\n  ${errorMsg}\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}`);
                  }
                } catch (err) {
                  testResults.push(`Test ${i + 1}: ✗ ERROR\n  ${err instanceof Error ? err.message : 'Unknown error'}`);
                }
              }
              output = testResults.join('\n\n');
            } catch {
              pythonAvailable = false;
            }

            // If Python is not available, show test cases for manual verification
            if (!pythonAvailable) {
              for (let i = 0; i < testCases.length; i++) {
                const testCase = testCases[i] as TestCase;
                testResults.push(`Test ${i + 1}:\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Call: ${functionName}(${testCase.input.map((inp: any) => JSON.stringify(inp)).join(', ')})`);
              }
              output = `Python Test Cases:\n${'='.repeat(50)}\n\n${testResults.join('\n\n')}\n\n${'='.repeat(50)}\n\n⚠️  Python 3 not found on server.\n\nTo enable automatic testing:\n  • Install Python 3 on your system\n  • Or test manually by copying your code and running:\n    python3 -c "your_code_here"\n\nFor now, verify your solution matches the expected outputs above.`;
            }
          } catch (error) {
            output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          break;

        case 'java':
          try {
            // Extract method name from code
            const methodMatch = code.match(/public\s+\w+(?:\[\])?\s+(\w+)\s*\(/);
            const methodName = methodMatch ? methodMatch[1] : 'solution';

            for (let i = 0; i < testCases.length; i++) {
              const testCase = testCases[i] as TestCase;
              const status = '⚠ MANUAL';
              testResults.push(`Test ${i + 1}: ${status} - Verify manually\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Method: solution.${methodName}(${testCase.input.map((inp: any) => JSON.stringify(inp)).join(', ')})`);
            }
            output = `Java Test Results:\n${'='.repeat(50)}\n\n${testResults.join('\n\n')}\n\n${'='.repeat(50)}\nNote: Java execution is simulated. To run tests:\n1. Save your code to Solution.java\n2. Compile: javac Solution.java\n3. Create a test harness to call ${methodName}() with test inputs\n\nFor accurate results, use a local Java compiler.`;
          } catch (error) {
            output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          break;

        case 'cpp':
          try {
            // Extract method name from code
            const methodMatch = code.match(/\w+\*?\s+(\w+)\s*\([^)]*\)\s*\{/);
            const methodName = methodMatch ? methodMatch[1] : 'solution';

            for (let i = 0; i < testCases.length; i++) {
              const testCase = testCases[i] as TestCase;
              const status = '⚠ MANUAL';
              testResults.push(`Test ${i + 1}: ${status} - Verify manually\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Method: solution.${methodName}(${testCase.input.map((inp: any) => JSON.stringify(inp)).join(', ')})`);
            }
            output = `C++ Test Results:\n${'='.repeat(50)}\n\n${testResults.join('\n\n')}\n\n${'='.repeat(50)}\nNote: C++ execution is simulated. To run tests:\n1. Save your code to solution.cpp\n2. Compile: g++ -o solution solution.cpp\n3. Create a main() function to test ${methodName}() with test inputs\n\nFor accurate results, use a local C++ compiler.`;
          } catch (error) {
            output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          break;
      }
    } else {
      // Original execution logic for non-test-case scenarios
      switch (language) {
        case 'javascript':
        case 'typescript':
          try {
            // Capture console.log output
            const logs: string[] = [];
            const originalLog = console.log;
            console.log = (...args: any[]) => {
              logs.push(args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' '));
            };

            // Simple evaluation for safe JavaScript code
            // Note: This is not secure for production use
            const result = eval(code);

            // Restore console.log
            console.log = originalLog;

            output = logs.length > 0 ? logs.join('\n') : (result !== undefined ? String(result) : '');
          } catch (error) {
            output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          break;

        case 'python':
          // For Python, we'll simulate some basic outputs
          if (code.includes('print("Hello, World!")')) {
            output = 'Hello, World!';
          } else if (code.includes('print(')) {
            // Extract print statements and simulate output
            const printMatches = code.match(/print\(.*?\)/g);
            if (printMatches) {
              output = printMatches.map((match: string) => {
                const content = match.match(/print\((.*?)\)/)?.[1];
                if (content) {
                  // Remove quotes if it's a string literal
                  return content.replace(/^["']|["']$/g, '');
                }
                return '';
              }).join('\n');
            }
          } else {
            output = 'Python code executed successfully (simulation mode)';
          }
          break;

        case 'java':
          if (code.includes('System.out.println("Hello, World!")')) {
            output = 'Hello, World!';
          } else if (code.includes('System.out.println')) {
            // Extract System.out.println statements
            const printMatches = code.match(/System\.out\.println\(.*?\)/g);
            if (printMatches) {
              output = printMatches.map((match: string) => {
                const content = match.match(/System\.out\.println\((.*?)\)/)?.[1];
                if (content) {
                  return content.replace(/^["']|["']$/g, '');
                }
                return '';
              }).join('\n');
            }
          } else {
            output = 'Java code compiled and executed successfully (simulation mode)';
          }
          break;

        case 'cpp':
          if (code.includes('cout << "Hello, World!"')) {
            output = 'Hello, World!';
          } else if (code.includes('cout <<')) {
            // Extract cout statements
            const coutMatches = code.match(/cout\s*<<\s*.*?;/g);
            if (coutMatches) {
              output = coutMatches.map((match: string) => {
                const content = match.match(/cout\s*<<\s*(.*?)\s*;/)?.[1];
                if (content) {
                  return content.replace(/^["']|["']$/g, '').replace(/\s*<<\s*endl/, '');
                }
                return '';
              }).join('\n');
            }
          } else {
            output = 'C++ code compiled and executed successfully (simulation mode)';
          }
          break;

        default:
          output = `${language} execution not yet implemented (simulation mode)`;
      }
    }

    return NextResponse.json({
      success: true,
      output: output || 'Code executed successfully (no output)',
    });

  } catch (error) {
    console.error('Code execution error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}