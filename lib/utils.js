"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const LAST_POINT = './last-point.json';
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
        if (!lastPoint.every(v => typeof v === 'number')) {
            throw new Error(`${LAST_POINT} is invalid, values are not numbers`);
        }
        if (!lastPoint.every((v, index, array) => array.indexOf(v) === index)) {
            throw new Error(`${LAST_POINT} is invalid, not unique`);
        }
        return lastPoint;
    }
    return new Array(16).fill(undefined).map((_, i) => i);
}
exports.getLastPoint = getLastPoint;
function storeLastPoint(value) {
    fs_1.writeFileSync(LAST_POINT, JSON.stringify(value), 'utf-8');
}
exports.storeLastPoint = storeLastPoint;
