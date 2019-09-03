import { SequenceValue } from './types';
import { readFileSync, existsSync, writeFileSync, openSync, appendFileSync, closeSync } from 'fs';

const LAST_POINT = './last-point.json';
const WORDS = './words.txt';
let fdWords: number | null = null;

export function getLastPoint(): SequenceValue {
  if (existsSync(LAST_POINT)) {
    const tmp_str = readFileSync(LAST_POINT, 'utf-8');
    if (tmp_str === '') {
      throw new Error(`${LAST_POINT} is empty`);
    }
    const lastPoint = JSON.parse(tmp_str);
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
  for (const value of values) {
    if (value.length > 13) {
      if (fdWords === null) {
        fdWords = openSync(WORDS, 'as');
      }
      appendFileSync(fdWords, value + '\n', 'utf-8');
    }
  }
}
export function closeWords() {
  if (fdWords === null) {
    return;
  }
  closeSync(fdWords);
}

export function getLongestWords() {
  return readFileSync('./longest_words.txt', 'utf8');
}
