"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const LAST_POINT = './last-point.json';
const WORDS = './words.txt';
let fdWords = null;
function getLastPoint() {
    if (fs_1.existsSync(LAST_POINT)) {
        const tmp_str = fs_1.readFileSync(LAST_POINT, 'utf-8');
        if (tmp_str === '') {
            throw new Error(`${LAST_POINT} is empty`);
        }
        const lastPoint = JSON.parse(tmp_str);
        if (!Array.isArray(lastPoint)) {
            throw new Error(`${LAST_POINT} is invalid, not array`);
        }
        if (lastPoint.length !== 16) {
            throw new Error(`${LAST_POINT} is invalid, array not 16 in length`);
        }
        if (!isArrayOfNumbers(lastPoint)) {
            throw new Error(`${LAST_POINT} is invalid, values are not numbers`);
        }
        if (!lastPoint.every((v) => v >= 0 && v < 16)) {
            throw new Error(`${LAST_POINT} is invalid, number out of range`);
        }
        if (!lastPoint.every((v, index, array) => array.indexOf(v) === index)) {
            throw new Error(`${LAST_POINT} is invalid, not unique`);
        }
        return lastPoint;
    }
    return new Array(16).fill(undefined).map((_, i) => i);
    function isArrayOfNumbers(array) {
        return array.every((v) => typeof v === 'number');
    }
}
exports.getLastPoint = getLastPoint;
function storeLastPoint(value) {
    fs_1.writeFileSync(LAST_POINT, JSON.stringify(value), 'utf-8');
}
exports.storeLastPoint = storeLastPoint;
function storeWords(values) {
    if (values.length === 0) {
        return;
    }
    if (fdWords === null) {
        fdWords = fs_1.openSync(WORDS, 'as');
    }
    for (const value of values) {
        fs_1.appendFileSync(fdWords, value, 'utf-8');
    }
}
exports.storeWords = storeWords;
function closeWords() {
    if (fdWords === null) {
        return;
    }
    fs_1.closeSync(fdWords);
}
exports.closeWords = closeWords;
