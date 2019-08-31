"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const findwords_1 = __importDefault(require("@wormss/findwords"));
const utils_1 = require("./utils");
const blocks_1 = require("./blocks");
let close = false;
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
function main() {
    try {
        for (const seqenceValue of sequence(utils_1.getLastPoint())) {
            const regex = seqenceValue.map((index) => blocks_1.blocks[index]).join('');
            const words = findwords_1.default(regex);
            utils_1.storeWords(words);
            utils_1.storeLastPoint(seqenceValue);
            if (close) {
                console.log('stopped work due to close');
                break;
            }
        }
    }
    catch (err) {
        console.error(String(err));
    }
    finally {
        utils_1.closeWords();
    }
}
process.on('SIGINT', (_signal) => {
    console.log('preparing to close');
    close = true;
});
main();
