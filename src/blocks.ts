import { Blocks } from './types';

export const blocks: Blocks = [
  // red
  Block('goose', 'r', 'e', 'n', 'k', 'y'),
  Block('bear', 't', 'a', 'p', 'e', 4),
  Block('frog', 'q', 'd', 'l', 'i', 's'),
  Block('pear', 'u', 'b', 'l', 'g', 8),
  // blue
  Block('butterfly', 'r', 'b', 'o', 'e', 7),
  Block('fat catapilla', 'p', 'd', 'o', 'e', 't'),
  Block('sun', 'r', 'e', 'm', 'i', 'x'),
  Block('apple catapilla', 'w', 'a', 'o', 'g', 3),
  // green
  Block('blueberry', 'u', 'c', 'o', 'e', 6),
  Block('bird', 'o', 'd', 'm', 'j', 'p'),
  Block('strawberry', 'z', 'a', 's', 'h', 5),
  Block('cat', 't', 'a', 'l', 'e', 1),
  // yellow
  Block('sea horse', 'o', 'e', 'n', 'i', 't'),
  Block('orange', 's', 'c', 'n', 'i', 10),
  Block('lady bird', 'v', 'a', 'n', 'f', 2),
  Block('catapilla', 'u', 'a', 'r', 'i', 9),
];

function Block(
  _: string,
  face1: string,
  face2: string,
  face3: string,
  face4: string,
  face5: string | number,
): string {
  const faces: string[] = [face1, face2, face3, face4];
  if (typeof face5 === 'string') {
    faces.push(face5);
  }
  return `[${faces.join('')}]?`;
}
