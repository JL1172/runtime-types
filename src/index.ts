import { chalk, Colors } from './colorize';
import * as fs from 'fs';

class Stack {
  private storage: Record<string, string> = {};
  private count: number = 0;
  public push(val: string): void {
    this.storage[val] = val;
    this.count++;
  }
  public pop(): string {
    if (this.count > 0) {
      this.count--;
      const valPopped: string = this.storage[this.count];
      delete this.storage[this.count];
      return valPopped;
    } else {
      return null;
    }
  }
  public get size(): number {
    return this.count;
  }
}
class RunTimeTypeError extends Error {}

export class RunTimeType {
  private readonly fs = fs;

  private readonly filePath: string;
  private src_code: string;

  constructor(fileName: string) {
    this.filePath = fileName;
  }
  public async main() {
    await this.readFile();
  }

  private async readFile(): Promise<void> {
    try {
      this.src_code = await new Promise((resolve, reject) => {
        this.fs.readFile(
          this.filePath,
          { encoding: 'utf-8' },
          (error, data: string) => {
            if (error) {
              reject(error.message);
            } else resolve(data);
          },
        );
      });
    } catch (err: unknown) {
      this.exitProgram(
        'Error occurred at RunTimeType.readFile method',
        new RunTimeTypeError(err + ''),
      );
    }
  }

  private async tokenizeFile(): Promise<void> {
    try {
      const unfilteredTokens: string[] = this.src_code.split('\n');
      const interfaceRegex: RegExp = /^\s*interface\b/;
      const unfilteredTokenLength: number = unfilteredTokens.length;
      for (let i: number = 0; i < unfilteredTokenLength; i++) {
        const currentLineOfCode: string = unfilteredTokens[i];
        if (interfaceRegex.test(currentLineOfCode)) {
          /**need to figure out how to find last closing curly brace of interface statement */



          let indexInterfaceInitialized: number = i;
          const stack = new Stack();
          const matchingChars: Record<string, string> = {
            '}': '{',
            ']': '[',
            ')': '(',
          };
          const openingRegex = /^[[({]/;
          const closingRegex = /^[]}\)]/;
          const splitLineOfCode: string[] = currentLineOfCode.split('');
          const splitLineOfCodeLength: number = splitLineOfCode.length;
          for (let j: number = 0; j < splitLineOfCodeLength; j++) {
            const currentChar: string = splitLineOfCode[j];
            if (openingRegex.test(currentChar)) {
              stack.push(currentChar);
            } else if (closingRegex.test(currentChar)) {
              const poppedValue: string = stack.pop();
              if (matchingChars[currentChar] !== poppedValue) {
                throw new RunTimeTypeError(
                  'Syntax error, unexpected token: [' +
                    currentChar +
                    ']' +
                    'expected: [' +
                    poppedValue +
                    ']',
                );
              }
            }
          }
        }

        /**dont know if this works */
      }
    } catch (err: unknown) {
      this.exitProgram(
        'Error occurred at RunTimeType.tokenizeFile method',
        new RunTimeTypeError(err + ''),
      );
    }
  }

  private exitProgram(message: string, error: RunTimeTypeError): void {
    console.error(
      chalk('[MESSAGE]: ' + message, Colors.red) +
        '\n' +
        chalk('[STACK]: ' + error?.stack, Colors.magenta) +
        '\n' +
        chalk('process exited with code 1', Colors.bgRed),
    );
    process.exit(1);
  }
}
