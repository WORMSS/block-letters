import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { sendMailWord } from './email';
import { SequenceValue } from './types';

const KNOWN_WORDS: Set<string> = new Set();
let LAST_POINT: string = '';
let WORDS: string = '';
let PREFIXED: number = -1;

export function setup(prefixed: number) {
  PREFIXED = prefixed;
  LAST_POINT = `./last-point.${PREFIXED}.json`;
  WORDS = `./words.${PREFIXED}.txt`;
  if (existsSync(WORDS)) {
    for (const word of readFileSync(WORDS, 'utf-8').split(/\r?\n/)) {
      KNOWN_WORDS.add(word);
    }
  }
  process.title = 'Block ' + PREFIXED.toString(10);
}

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

export function storeLastPoint(value: SequenceValue): void {
  process.title = `Block ${PREFIXED.toString(10)} [${value.join(', ')}]`;
  console.log([PREFIXED, ...value]);
  writeFileSync(LAST_POINT, JSON.stringify(value), 'utf-8');
}

export function storeWords(arrayOfValues: string[][]): void {
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
    if (value.length > 13 && !KNOWN_WORDS.has(value)) {
      console.log(value);
      appendFileSync(WORDS, value + EOL, 'utf-8');
      KNOWN_WORDS.add(value);
      if (value.length > 14) {
        sendMailWord(value);
      }
    }
  }
}

export function getLongestWords() {
  return readFileSync('./longest_words.txt', 'utf8');
}

export function* sequence(
  init: SequenceValue,
): IterableIterator<SequenceValue> {
  const start: SequenceValue = init.slice() as SequenceValue;
  const value: SequenceValue = new Array(15).fill(0) as SequenceValue;

  yield* recurse(0);

  function* recurse(depth: number): IterableIterator<SequenceValue> {
    let i = start[depth];
    start[depth] = 0;
    for (; i < 16; i++) {
      if (includesBefore(depth, i)) {
        continue;
      }
      value[depth] = i;
      if (depth >= 14) {
        yield value.slice() as SequenceValue; // Do not leak internal reference.
      } else {
        yield* recurse(depth + 1);
      }
    }
  }
  function includesBefore(depth: number, search: number): boolean {
    if (search === PREFIXED) {
      return true;
    }
    for (let i = depth - 1; i >= 0; i--) {
      if (value[i] === search) {
        return true;
      }
    }
    return false;
  }
}
