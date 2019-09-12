import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { SequenceValue } from './types';
import { sendMailWord } from './email';

const LAST_POINT = (prefixed: number) => `./last-point.${prefixed}.json`;
const WORDS = (prefixed: number) => `./words.${prefixed}.txt`;
let knownWords: Set<string> | null = null;

export function getLastPoint(prefixed: number): SequenceValue {
  const lastPointFilePath = LAST_POINT(prefixed);
  if (existsSync(lastPointFilePath)) {
    const fileStr = readFileSync(lastPointFilePath, 'utf-8');
    if (fileStr === '') {
      throw new Error(`${lastPointFilePath} is empty`);
    }
    const lastPoint = JSON.parse(fileStr);
    if (!Array.isArray(lastPoint)) {
      throw new Error(`${lastPointFilePath} is invalid, not array`);
    }
    if (lastPoint.length !== 15) {
      throw new Error(
        `${lastPointFilePath} is invalid, array not 16 in length`,
      );
    }
    if (!isArrayOfNumbers(lastPoint)) {
      throw new Error(
        `${lastPointFilePath} is invalid, values are not numbers`,
      );
    }
    if (!lastPoint.every((v) => v >= 0 && v < 16)) {
      throw new Error(`${lastPointFilePath} is invalid, number out of range`);
    }
    if (!lastPoint.every((v, index, array) => array.indexOf(v) === index)) {
      throw new Error(`${lastPointFilePath} is invalid, not unique`);
    }
    return lastPoint as SequenceValue;
  }
  return new Array(15).fill(undefined).map((_, i) => i) as SequenceValue;
  function isArrayOfNumbers(array: any[]): array is number[] {
    return array.every((v) => typeof v === 'number');
  }
}
export function storeLastPoint(prefixed: number, value: SequenceValue): void {
  const lastPointFilePath = LAST_POINT(prefixed);
  writeFileSync(lastPointFilePath, JSON.stringify(value), 'utf-8');
}
export function storeWords(prefixed: number, arrayOfValues: string[][]): void {
  const wordsFilePath = WORDS(prefixed);
  if (arrayOfValues.length === 0) {
    return;
  }
  const values: string[] = arrayOfValues.reduceRight((prev, curr) =>
    prev.concat(curr),
  );
  if (values.length === 0) {
    return;
  }

  for (const value of values) {
    if (value.length > 13 && !(knownWords && knownWords.has(value))) {
      if (knownWords === null) {
        knownWords = new Set(
          existsSync(wordsFilePath)
            ? readFileSync(wordsFilePath, 'utf-8').split(/\r?\n/)
            : undefined,
        );
      }
      // tslint:disable-next-line: no-console
      console.log(value);
      appendFileSync(wordsFilePath, value + EOL, 'utf-8');
      if (value.length > 14) {
        sendMailWord(value);
      }
      knownWords.add(value);
    }
  }
}

export function getLongestWords() {
  return readFileSync('./longest_words.txt', 'utf8');
}
