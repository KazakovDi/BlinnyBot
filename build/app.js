"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./utils/constants");
const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const { calculateFish } = require("./utils/calculateFish.js");
const { Fishes, Junks } = require("./utils/constants.js");
const User = require("./MongooseSchemas/UserSchema.js");
const { clearEndZeros } = require("./utils/clearEndZeros.js");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config({ path: "./.env" });
const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
app.get("/interactions", (req, res) => {
    res.send("Hello, this is an Express server running alongside a Discord bot!");
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Express server is running`);
});
client.once("ready", async () => {
    const res = await mongoose.connect("mongodb+srv://Diman:Diman@cluster0.gjm6c.mongodb.net/Blinny");
    // console.log("res", res);
});
client.on("messageCreate", async (message) => {
    if (message.content === "!fish" && !message.author.bot) {
        let resultMsg = "";
        const weight = await calculateFish();
        setTimeout(async () => {
            if (weight) {
                let fishIndex = Math.floor(Math.random() * (Fishes.length - 1));
                fishIndex = fishIndex >= Fishes.length ? Fishes.length - 1 : fishIndex;
                let weightString = "";
                weightString =
                    weight >= 1000
                        ? clearEndZeros((weight / 1000).toFixed(3)) + "kg"
                        : weight + "g";
                const size = Math.random() * 10 < 5
                    ? "What a giant thing!"
                    : "What a tiny little thing";
                resultMsg =
                    `Congrats! You've caught: ${Fishes[fishIndex]}. It's weight: ${weightString}` +
                        " " +
                        size;
                const user = await User.findOne({ userDiscordId: message.author.id });
                if (user) {
                    user.fishes += weight;
                    await user.save();
                }
                else {
                    const doc = new User({
                        username: message.author.username,
                        userDiscordId: message.author.id,
                        globalName: message.author.globalName,
                        fishes: weight,
                    });
                    const res = await doc.save();
                    console.log("check", res);
                }
            }
            else {
                let junkIndex = Math.floor(Math.random() * (Junks.length - 1));
                resultMsg = `Dang it, you've caught only ${Junks[junkIndex]}`;
            }
            message.channel.send(`<@${message.author.id}> ${resultMsg}`);
        }, 115);
    }
    if (message.content === "!totalFish" && !message.author.bot) {
        const user = await User.findOne({ userDiscordId: message.author.id });
        if (!user)
            return;
        message.channel.send(`<@${message.author.id}> You've caught ${clearEndZeros((user.fishes / 1000).toFixed(3))}kg of fish so far`);
    }
    if (message.content.startsWith("!d20") && !message.author.bot) {
        let D20 = Math.floor(Math.random() * 19) + 1;
        setTimeout(() => {
            const specialNumber = Math.floor(Math.random() * 200);
            if (specialNumber === 200)
                message.channel.send("21");
            else if (specialNumber === 0)
                message.channel.send("0");
            else
                message.channel.send(`Your number is: ${D20}`);
        }, 15);
    }
    const BlinRegex = /blin/gi;
    if (BlinRegex.test(message.content) && !message.author.bot) {
        const blinIndex = Math.floor(Math.random() * constants_1.Blins.length);
        message.channel.send(constants_1.Blins[blinIndex]);
    }
    const SwearingRegex = /bl[yei]at/gi;
    if (SwearingRegex.test(message.content) && !message.author.bot) {
        message.channel.send("No swearing!");
    }
    if (message.content.startsWith("!spook")) {
        message.channel.send(`<@${message.author.id}> Dude, I'm not Giga`);
    }
    if (message.content === "!pat") {
        const index = Math.floor(Math.random() * constants_1.PatLines.length);
        message.channel.send(`<@${message.author.id}> ${constants_1.PatLines[index]}`);
    }
});
client.login(process.env.DISCORD_TOKEN);
