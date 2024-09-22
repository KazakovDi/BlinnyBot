"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePower = void 0;
const calculatePower = (number) => {
    let power = 0;
    while (number >= 1) {
        number = number / 10;
        power++;
    }
    return power;
};
exports.calculatePower = calculatePower;
