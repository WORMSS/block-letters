import { SequenceValue } from './types';
import findwords from '@wormss/findwords';
import { storeLastPoint, getLastPoint } from './utils';
import { blocks } from './blocks';

function* sequence(init: SequenceValue): IterableIterator<SequenceValue> {
  const start: SequenceValue = Object.assign([], init);
  const value: SequenceValue = new Array(16).fill(0) as SequenceValue;

  yield* recurse(0);

  function* recurse(depth: number): IterableIterator<SequenceValue> {
    let i = start[depth];
    start[depth] = 0;
    for (; i < 16; i++) {
      if (includesBefore(depth, i)) continue;
      value[depth] = i;
      if (depth >= 15) {
        yield value;
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
    for (const seqenceValue of sequence(getLastPoint())) {
      const words = findwords(seqenceValue.map(index => blocks[index]).join(''));
      if (words.length) console.log(words);
      storeLastPoint(seqenceValue);
    }
  } catch (err) {
    console.error(String(err));
  }
}
main();
