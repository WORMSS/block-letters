import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { SequenceValue } from './types';
import { sendMailWord } from './email';

const LAST_POINT = (prefixed: number) => `./last-point.${prefixed}.json`;
const WORDS = (prefixed: number) => `./words.${prefixed}.txt`;
let knownWords: Set<string> | null = null;

export function getLastPoint(prefixed: number): SequenceValue {
  if (existsSync(LAST_POINT(prefixed))) {
    const fileStr = readFileSync(LAST_POINT(prefixed), 'utf-8');
    if (fileStr === '') {
      throw new Error(`${LAST_POINT} is empty`);
    }
    const lastPoint = JSON.parse(fileStr);
    if (!Array.isArray(lastPoint)) {
      throw new Error(`${LAST_POINT} is invalid, not array`);
    }
    if (lastPoint.length !== 15) {
      throw new Error(`${LAST_POINT} is invalid, array not 16 in length`);
    }
    if (!isArrayOfNumbers(lastPoint)) {
      throw new Error(`${LAST_POINT} is invalid, values are not numbers`);
    }
    if (!lastPoint.every((v) => v >= 0 && v < 16)) {
      throw new Error(`${LAST_POINT} is invalid, number out of range`);
    }
    if (!lastPoint.every((v, index, array) => array.indexOf(v) === index)) {
      throw new Error(`${LAST_POINT} is invalid, not unique`);
    }
    return lastPoint as SequenceValue;
  }
  return new Array(15).fill(undefined).map((_, i) => i) as SequenceValue;
  function isArrayOfNumbers(array: any[]): array is number[] {
    return array.every((v) => typeof v === 'number');
  }
}
export function storeLastPoint(prefixed: number, value: SequenceValue): void {
  writeFileSync(LAST_POINT(prefixed), JSON.stringify(value), 'utf-8');
}
export function storeWords(prefixed: number, arrayOfValues: string[][]): void {
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
          existsSync(WORDS(prefixed))
            ? readFileSync(WORDS(prefixed), 'utf-8').split(/\r?\n/)
            : undefined,
        );
      }
      console.log(value);
      appendFileSync(WORDS(prefixed), value + '\n', 'utf-8');
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
