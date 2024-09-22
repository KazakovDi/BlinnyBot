import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
