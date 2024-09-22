import {
  Blins,
  damagePhrases,
  eatWarningPhrases,
  PatLines,
  Phrases,
} from "./utils/constants";
import { generateDamage } from "./utils/generateDanage";

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
  const res = await mongoose.connect(
    "mongodb+srv://Diman:Diman@cluster0.gjm6c.mongodb.net/Blinny"
  );
  // console.log("res", res);
});

client.on("messageCreate", async (message: any) => {
  if (message.content === "!fish" && !message.author.bot) {
    let resultMsg = "";
    const weight: number = await calculateFish();
    setTimeout(async () => {
      if (weight) {
        let fishIndex = Math.floor(Math.random() * (Fishes.length - 1));
        fishIndex = fishIndex >= Fishes.length ? Fishes.length - 1 : fishIndex;

        let weightString = "";
        weightString =
          weight >= 1000
            ? clearEndZeros((weight / 1000).toFixed(3)) + "kg"
            : weight + "g";

        const size =
          Math.random() * 10 < 5
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
        } else {
          const doc = new User({
            username: message.author.username,
            userDiscordId: message.author.id,
            globalName: message.author.globalName,
            fishes: weight,
          });
          const res = await doc.save();
          console.log("check", res);
        }
      } else {
        let junkIndex = Math.floor(Math.random() * (Junks.length - 1));
        resultMsg = `Dang it, you've caught only ${Junks[junkIndex]}`;
      }
      message.channel.send(`<@${message.author.id}> ${resultMsg}`);
    }, 115);
  }

  if (message.content === "!totalFish" && !message.author.bot) {
    const user = await User.findOne({ userDiscordId: message.author.id });
    if (!user) return;
    message.channel.send(
      `<@${message.author.id}> You've caught ${clearEndZeros(
        (user.fishes / 1000).toFixed(3)
      )}kg of fish so far`
    );
  }

  if (message.content.startsWith("!d20") && !message.author.bot) {
    let D20 = Math.floor(Math.random() * 19) + 1;

    setTimeout(() => {
      const specialNumber = Math.floor(Math.random() * 200);
      if (specialNumber === 200) message.channel.send("21");
      else if (specialNumber === 0) message.channel.send("0");
      else message.channel.send(`Your number is: ${D20}`);
    }, 15);
  }

  const BlinRegex = /blin/gi;
  if (BlinRegex.test(message.content) && !message.author.bot) {
    const blinIndex = Math.floor(Math.random() * Blins.length);
    message.channel.send(Blins[blinIndex]);
  }

  const SwearingRegex = /bl[yei]at/gi;
  if (SwearingRegex.test(message.content) && !message.author.bot) {
    message.channel.send("No swearing!");
  }

  if (message.content.startsWith("!spook")) {
    message.channel.send(`<@${message.author.id}> Dude, I'm not Giga`);
  }

  if (message.content === "!pat") {
    const index = Math.floor(Math.random() * PatLines.length);

    message.channel.send(`<@${message.author.id}> ${PatLines[index]}`);
  }

  if (message.content.startsWith("!eat")) {
    const author = message.author;

    const targetKey = message.mentions.users.keys().next().value;
    const targetedUser = message.mentions.users.get(targetKey);

    const Attacker = await User.findOne({ userDiscordId: author.id });

    if (targetedUser.id === "1285707174970130522") {
      const index = Math.floor(Math.random() * eatWarningPhrases.length);
      const promise = new Promise<void>((resolve) => {
        setTimeout(() => {
          const possibility = Math.floor(Math.random() * 10);
          if (possibility === 0) {
            Attacker.health = 0;
            Attacker.isEaten = true;
            Attacker.eatenCounter++;
            Attacker.save();
            message.channel.send(
              `You are not eating Blinny, Blinny eats you. <@${author.id}> was eaten`
            );
            resolve();
          } else {
            message.channel.send(`<@${author.id}> ${eatWarningPhrases[index]}`);
            resolve();
          }
        }, 10);
      });
      await promise;
      return;
    }

    if (Attacker.isEaten)
      if (
        Date.now() - Attacker.eatenTime < 900000 &&
        Attacker.eatenTime !== null
      ) {
        Attacker.health = 100;
        Attacker.isEaten = false;
      } else {
        message.channel.send(
          `<@${author.id}> Sorry dude, you're eaten yourself already`
        );
      }

    const gap = Date.now() - Attacker.lastTimeEat;
    if (gap <= 7000 && Attacker.lastTimeEat !== null) {
      message.channel.send(
        `<@${message.author.id}> Wait ${gap / 1000}s before another bite`
      );
    } else {
      let Victim = await User.findOne({ userDiscordId: targetedUser.id });

      if (Victim === null) {
        Victim = new User({
          username: targetedUser.username,
          userDiscordId: targetedUser.id,
          globalName: targetedUser.globalName,
          fishes: 0,
        });
        await Victim.save();
      }

      if (Victim.isEaten) {
        if (
          Date.now() - Victim.eatenTime < 900000 &&
          Victim.eatenTime !== null
        ) {
          Victim.health = 100;
          Victim.isEaten = false;
        } else {
          message.channel.send(
            `<@${author.id}> The dude is already eaten, live them`
          );
        }
      } else {
        const damage = await generateDamage();

        Victim.health -= damage;

        if (Victim.health <= 0) {
          Victim.isEaten = true;
          Victim.eatenCounter++;
          Attacker.lastTimeEat = Date.now();
          Attacker.ateCounter++;
          Attacker.health;

          const phraseIndex = Math.floor(Math.random() * Phrases.length);

          Victim.save();
          Attacker.save();

          message.channel.send(
            `<@${author.id}> ate <@${targetedUser.id}> ${Phrases[phraseIndex]}. <@${author.id}> ate ${Attacker.ateCounter} person(s) and <@${targetedUser.id}> was eaten ${Victim.eatenCounter} time(s)`
          );
        } else {
          const phraseIndex = Math.floor(Math.random() * damagePhrases.length);
          const phrase = damagePhrases[phraseIndex];

          Attacker.lastTimeEat = Date.now();

          Attacker.save();
          Victim.save();

          message.channel.send(
            `<@${author.id}> bit <@${targetedUser.id}> and dealt ${damage}. <@${targetedUser.id}> got only ${Victim.health}hp left. ${phrase}`
          );
        }
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
