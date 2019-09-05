import {
  appendFileSync,
  closeSync,
  existsSync,
  openSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { SequenceValue } from './types';

const LAST_POINT = './last-point.json';
const WORDS = './words.txt';
let fdWords: number | null = null;
const knownWords = new Set(readFileSync(WORDS, 'utf-8').split(/\r?\n/));

export function getLastPoint(): SequenceValue {
  if (existsSync(LAST_POINT)) {
    const fileStr = readFileSync(LAST_POINT, 'utf-8');
    if (fileStr === '') {
      throw new Error(`${LAST_POINT} is empty`);
    }
    const lastPoint = JSON.parse(fileStr);
    if (!Array.isArray(lastPoint)) {
      throw new Error(`${LAST_POINT} is invalid, not array`);
    }
    if (lastPoint.length !== 16) {
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
  return new Array(16).fill(undefined).map((_, i) => i) as SequenceValue;
  function isArrayOfNumbers(array: any[]): array is number[] {
    return array.every((v) => typeof v === 'number');
  }
}
export function storeLastPoint(value: SequenceValue): void {
  writeFileSync(LAST_POINT, JSON.stringify(value), 'utf-8');
}
export function storeWords(values: string[]): void {
  if (values.length === 0) {
    return;
  }
  reportMinors(values);
  for (const value of values) {
    if (value.length > 13 && !knownWords.has(value)) {
      if (fdWords === null) {
        fdWords = openSync(WORDS, 'as');
      }
      appendFileSync(fdWords, value + '\n', 'utf-8');
      knownWords.add(value);
    }
  }
}
export function closeWords() {
  if (fdWords === null) {
    return;
  }
  closeSync(fdWords);
  fdWords = null;
}

export function getLongestWords() {
  return readFileSync('./longest_words.txt', 'utf8');
}
function reportMinors(values: string[]) {
  const longest = values.reduceRight((prev, curr) =>
    curr.length > prev.length ? curr : prev,
  );
  console.log(longest, 'and', values.length, 'others');
}
