import { NextResponse } from 'next/server';
import { TestCase } from '@/constants/codingTemplates';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

// Map language names to Piston language identifiers
const languageMap: Record<string, { language: string; version: string }> = {
  'javascript': { language: 'javascript', version: '18.15.0' },
  'typescript': { language: 'typescript', version: '5.0.3' },
  'python': { language: 'python', version: '3.10.0' }
};

export async function POST(request: Request) {
  try {
    const { code, language, testCases, questions } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
      );
    }

    let output = '';

    // Get language configuration for Piston API
    const langConfig = languageMap[language];

    // If test cases are provided, run them
    if (testCases && testCases.length > 0) {
      const testResults: string[] = [];

      // Build test code for the specific language
      switch (language) {
        case 'javascript':
        case 'typescript':
          try {
            const functionNames = ['twoSum', 'reverseString', 'isValid', 'mergeTwoLists', 'maxSubArray', 'search', 'fibonacci', 'isPalindrome', 'climbStairs', 'maxProfit'];

            for (let i = 0; i < testCases.length; i++) {
              const testCase = testCases[i] as TestCase;

              // Find function name from code
              let funcName = '';
              for (const name of functionNames) {
                if (code.includes(`function ${name}`) || code.includes(`const ${name}`) || code.includes(`let ${name}`) || code.includes(`var ${name}`)) {
                  funcName = name;
                  break;
                }
              }

              const testCode = `
${code}

// Test case ${i + 1}
const result = ${funcName}(${testCase.input.map((inp: any) => JSON.stringify(inp)).join(', ')});
console.log(JSON.stringify(result));
`;

              const response = await fetch(PISTON_API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  language: langConfig.language,
                  version: langConfig.version,
                  files: [{
                    content: testCode,
                  }],
                }),
              });

              if (!response.ok) {
                testResults.push(`Test ${i + 1}: ✗ ERROR\n  Execution API error: ${response.statusText}`);
                continue;
              }

              const data = await response.json();
              const result = data.run?.output?.trim() || data.run?.stdout?.trim();

              let parsedResult;
              try {
                parsedResult = JSON.parse(result);
              } catch {
                parsedResult = result;
              }

              const passed = JSON.stringify(parsedResult) === JSON.stringify(testCase.expected);
              const status = passed ? '✓ PASS' : '✗ FAIL';
              testResults.push(`Test ${i + 1}: ${status}\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Got: ${JSON.stringify(parsedResult)}`);
            }
            output = testResults.join('\n\n');
          } catch (error) {
            output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          break;

        case 'python':
          try {
            const functionMatch = code.match(/def\s+(\w+)\s*\(/);
            const functionName = functionMatch ? functionMatch[1] : null;

            if (!functionName) {
              output = 'Error: Could not find function definition in Python code';
              break;
            }

            for (let i = 0; i < testCases.length; i++) {
              const testCase = testCases[i] as TestCase;

              const testCode = `
${code}

# Test case ${i + 1}
import json
result = ${functionName}(${testCase.input.map((inp: any) => JSON.stringify(inp)).join(', ')})
print(json.dumps(result))
`;

              const response = await fetch(PISTON_API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  language: langConfig.language,
                  version: langConfig.version,
                  files: [{
                    content: testCode,
                  }],
                }),
              });

              if (!response.ok) {
                testResults.push(`Test ${i + 1}: ✗ ERROR\n  Execution API error: ${response.statusText}`);
                continue;
              }

              const data = await response.json();
              const result = data.run?.output?.trim() || data.run?.stdout?.trim();

              let parsedResult;
              try {
                parsedResult = JSON.parse(result);
              } catch {
                parsedResult = result;
              }

              const passed = JSON.stringify(parsedResult) === JSON.stringify(testCase.expected);
              const status = passed ? '✓ PASS' : '✗ FAIL';
              testResults.push(`Test ${i + 1}: ${status}\n  Input: ${JSON.stringify(testCase.input)}\n  Expected: ${JSON.stringify(testCase.expected)}\n  Got: ${JSON.stringify(parsedResult)}`);
            }
            output = testResults.join('\n\n');
          } catch (error) {
            output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          break;
      }
    } else {
      // Non-test-case scenarios - execute code directly
      try {
        const response = await fetch(PISTON_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{
              content: code,
            }],
          }),
        });

        if (!response.ok) {
          output = `Execution API error: ${response.statusText}`;
        } else {
          const data = await response.json();
          output = data.run?.output || data.run?.stdout || 'Code executed successfully (no output)';
        }
      } catch (error) {
        output = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
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