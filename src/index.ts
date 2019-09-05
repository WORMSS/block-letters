import findwords from '@wormss/findwords';
import { blocks } from './blocks';
import { SequenceValue } from './types';
import {
  closeWords,
  getLastPoint,
  getLongestWords,
  storeLastPoint,
  storeWords,
} from './utils';

let close: boolean = false;
function* sequence(init: SequenceValue): IterableIterator<SequenceValue> {
  const start: SequenceValue = init.slice() as SequenceValue;
  const value: SequenceValue = new Array(16).fill(0) as SequenceValue;

  yield* recurse(0);

  function* recurse(depth: number): IterableIterator<SequenceValue> {
    let i = start[depth];
    start[depth] = 0;
    for (; i < 16; i++) {
      if (includesBefore(depth, i)) {
        continue;
      }
      value[depth] = i;
      if (depth >= 15) {
        yield value.slice() as SequenceValue; // Do not leak internal reference.
      } else {
        yield* recurse(depth + 1);
      }
    }
  }
  function includesBefore(depth: number, search: number): boolean {
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
    const longestWords = getLongestWords();
    for (const seqenceValue of sequence(getLastPoint())) {
      const regex = seqenceValue.map((index) => blocks[index]).join('');
      const words = findwords(regex, longestWords);
      storeWords(words);
      storeLastPoint(seqenceValue);
      if (close) {
        console.log('stopped work due to close');
        break;
      } else {
        await delay();
      }
    }
  } catch (err) {
    console.error(String(err));
  } finally {
    closeWords();
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
