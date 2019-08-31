"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f', g = 'g', h = 'h', i = 'i', j = 'j', k = 'k', l = 'l', m = 'm', n = 'n', o = 'o', p = 'p', q = 'q', r = 'r', s = 's', t = 't', u = 'u', v = 'v', w = 'w', x = 'x', y = 'y', z = 'z';
exports.blocks = [
    //red
    Block('goose', r, e, n, k, y),
    Block('bear', t, a, p, e, 4),
    Block('frog', q, d, l, i, s),
    Block('pear', u, b, l, g, 8),
    //blue
    Block('butterfly', r, b, o, e, 7),
    Block('fat catapilla', p, d, o, e, t),
    Block('sun', r, e, m, i, x),
    Block('apple catapilla', w, a, o, g, 3),
    //green
    Block('blueberry', u, c, o, e, 6),
    Block('bird', o, d, m, j, p),
    Block('strawberry', z, a, s, h, 5),
    Block('cat', t, a, l, e, 1),
    //yellow
    Block('sea horse', o, e, n, i, t),
    Block('orange', s, c, n, i, 10),
    Block('lady bird', v, a, n, f, 2),
    Block('catapilla', u, a, r, i, 9),
];
function Block(_pic, face1, face2, face3, face4, face5) {
    const faces = [face1, face2, face3, face4];
    if (typeof face5 === 'string') {
        faces.push(face5);
    }
    return `[${faces.join('')}]?`;
}
