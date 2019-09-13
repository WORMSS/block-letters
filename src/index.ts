import findwords from '@wormss/findwords';
import { blocks } from './blocks';
import {
  getLastPoint,
  getLongestWords,
  sequence,
  setup,
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
setup(prefixed);

let close: boolean = false;

async function main() {
  try {
    let count = 0;
    const longestWords = getLongestWords();
    const foundWords: RegExpMatchArray[] = [];
    for (const seqenceValue of sequence(getLastPoint())) {
      const regex = [prefixed, ...seqenceValue]
        .map((index) => blocks[index])
        .join('');
      foundWords.push(findwords(regex, longestWords));

      if (close) {
        console.log('stopped work due to close');
        break;
      } else if (count > 500) {
        storeWords(foundWords);
        storeLastPoint(seqenceValue);
        foundWords.length = 0; // Empty the list.
        count = 0; // Reset counter
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
