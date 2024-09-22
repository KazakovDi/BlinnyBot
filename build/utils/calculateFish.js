"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFish = void 0;
const calculateFish = async () => {
    let number = Math.floor(Math.random() * 100);
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (number < 95) {
                let value = 0;
                setTimeout(() => {
                    // power = Math.floor(Math.random() * 6) - 3;
                    value = Math.floor(Math.random() * 24999) + 1;
                }, 12);
                setTimeout(() => {
                    let multiplier = 1;
                    const possibility = Math.random() * 150;
                    if (possibility >= 115 && possibility <= 139)
                        multiplier = 10;
                    if (possibility >= 140 && possibility <= 149)
                        multiplier = 100;
                    if (possibility === 150)
                        multiplier * 1000;
                    resolve(multiplier * value);
                }, 50);
            }
            else
                return resolve(null);
        }, 44);
    });
    return promise;
};
exports.calculateFish = calculateFish;
