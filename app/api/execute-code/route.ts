import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // For security reasons, we'll simulate code execution locally
    // In a production environment, you'd want to use a secure sandbox service
    let output = '';

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
            output = printMatches.map(match => {
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
            output = printMatches.map(match => {
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
            output = coutMatches.map(match => {
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