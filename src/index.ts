import findwords from '@wormss/findwords';
import { blocks } from './blocks';
import { SequenceValue } from './types';
import {
  getLastPoint,
  getLongestWords,
  storeLastPoint,
  storeWords,
} from './utils';

const prefixed = parseInt(process.argv[2], 10);
if (isNaN(prefixed)) {
  throw new Error('argument is is NaN');
}
if (prefixed > 15) {
  throw new Error('argument is greater than 15');
}
if (prefixed < 0) {
  throw new Error('argument is less than zero');
}

console.log('prefixed', prefixed);

let close: boolean = false;
function* sequence(init: SequenceValue): IterableIterator<SequenceValue> {
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
    if (search === prefixed) {
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
async function main() {
  try {
    let count = 0;
    const longestWords = getLongestWords();
    const foundWords: RegExpMatchArray[] = [];
    for (const seqenceValue of sequence(getLastPoint(prefixed))) {
      const regex = [prefixed, ...seqenceValue]
        .map((index) => blocks[index])
        .join('');
      foundWords.push(findwords(regex, longestWords));

      if (close) {
        console.log('stopped work due to close');
        break;
      } else if (count > 500) {
        console.log([prefixed, ...seqenceValue]);
        storeWords(prefixed, foundWords);
        storeLastPoint(prefixed, seqenceValue);
        foundWords.length = 0;
        count = 0;
        await delay();
      } else {
        ++count;
      }
    }
  } catch (err) {
    console.error(String(err));
  }
}
function delay() {
  return new Promise((r) => setImmediate(r));
}
function onCloseSignal(signal: NodeJS.Signals) {
  console.log('preparing to close', signal);
  close = true;
}
process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
process.on('SIGUSR1', onCloseSignal);
process.on('SIGUSR2', onCloseSignal);
main();
