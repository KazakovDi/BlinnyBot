"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearEndZeros = void 0;
const clearEndZeros = (str) => {
    console.log("str", str);
    let target = 0;
    for (let index = str.length - 1; index >= 0; index--) {
        if (str[index] == "0") {
            target = index;
            continue;
        }
        if (str[index] === ".") {
            target = index;
            continue;
        }
        break;
    }
    console.log("res", target, str.slice(0, target));
    return str.slice(0, target || str.length);
};
exports.clearEndZeros = clearEndZeros;
