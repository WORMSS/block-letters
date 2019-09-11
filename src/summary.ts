import { existsSync, readFileSync } from 'fs';

function readWordsFile(num: number): string[] {
  const p = `./words.${num}.txt`;
  if (!existsSync(p)) {
    return [];
  }
  return readFileSync(p, 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.length > 0);
}

const uniqueWords = new Set<string>();
for (let i = 0; i < 16; i++) {
  const words = readWordsFile(i);
  for (const word of words) {
    uniqueWords.add(word);
  }
}

const sortedWords = [...uniqueWords].sort((a, b) => {
  const lenDiff = b.length - a.length;
  if (lenDiff !== 0) {
    return lenDiff;
  }
  return a.localeCompare(b);
});

// tslint:disable-next-line: no-console
console.log(sortedWords.join('\n'));
