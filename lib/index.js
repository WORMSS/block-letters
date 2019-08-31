"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findwords_1 = __importDefault(require("@wormss/findwords"));
const utils_1 = require("./utils");
function* sequence(init) {
    const start = Object.assign([], init);
    const value = new Array(16).fill(0);
    yield* recurse(0);
    function* recurse(depth) {
        let i = start[depth];
        start[depth] = 0;
        for (; i < 16; i++) {
            if (includesBefore(depth, i))
                continue;
            value[depth] = i;
            if (depth >= 15) {
                yield value;
            }
            else {
                yield* recurse(depth + 1);
            }
        }
    }
    function includesBefore(depth, search) {
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
        for (const seqenceValue of sequence(utils_1.getLastPoint())) {
            // console.log(seqenceValue);
            // TODO use each of the sequence values as an index to get the regex of each block face.
            const words = findwords_1.default(seqenceValue.map(c => String.fromCharCode(c + 97)).join('?'));
            if (words.length)
                console.log(words);
            utils_1.storeLastPoint(seqenceValue);
        }
    }
    catch (err) {
        console.error(String(err));
    }
}
main();
