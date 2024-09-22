"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDamage = void 0;
const generateDamage = async () => {
    const damage = Math.floor(Math.random() * 10) + 15;
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const critical = Math.floor(Math.random() * 50);
            if (critical === 50)
                resolve(100);
            else if (critical === damage)
                resolve(damage + 25);
            else
                resolve(damage);
        }, 5);
    });
    return promise;
};
exports.generateDamage = generateDamage;
