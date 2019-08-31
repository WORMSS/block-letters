"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f', g = 'g', h = 'h', i = 'i', j = 'j', k = 'k', l = 'l', m = 'm', n = 'n', o = 'o', p = 'p', q = 'q', r = 'r', s = 's', t = 't', u = 'u', v = 'v', w = 'w', x = 'x', y = 'y', z = 'z';
exports.blocks = [
    // Red
    Block('', a, b, c, d, 1),
    Block('', e, f, g, h, 1),
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    // Green
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    // Blue
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    // Green
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
    Block('', a, b, c, d, 1),
];
function Block(_pic, face1, face2, face3, face4, face5) {
    const faces = [face1, face2, face3, face4];
    if (typeof face5 === 'string') {
        faces.push(face5);
    }
    return `[${faces.join('')}]?`;
}