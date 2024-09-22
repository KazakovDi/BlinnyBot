"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    userDiscordId: {
        type: String,
        required: true,
        unique: true,
    },
    globalName: String,
    fishes: {
        type: Number,
        required: true,
        default: 0,
    },
    health: {
        default: 100,
        type: Number,
    },
    lastTimeEat: {
        type: Number,
        default: null,
    },
    ateCounter: {
        type: Number,
        default: 0,
    },
    eatenCounter: {
        type: Number,
        default: 0,
    },
    isEaten: {
        type: Boolean,
        default: false,
    },
    eatenTime: {
        type: Number,
        default: null,
    },
}, {
    timestamps: true,
});
module.exports = mongoose_1.default.model("User", userSchema);
