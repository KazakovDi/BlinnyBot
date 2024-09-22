import { Client, GatewayIntentBits, InteractionCollector } from "discord.js";
import mongoose from "mongoose";
import { calculateFish } from "./utils/calculateFish.js";
import { Fishes, Junks } from "./utils/constants.js";
import { User } from "./MongooseSchemas/UserSchema.js";
import { clearEndZeros } from "./utils/clearEndZeros.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", async () => {
  const res = await mongoose.connect(
    "mongodb+srv://Diman:Diman@cluster0.gjm6c.mongodb.net/Blinny"
  );
  // console.log("res", res);
});

client.on("messageCreate", async (message) => {
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

  if (message.content === "!d20" && !message.author.bot) {
    let D20 = Math.floor(Math.random() * 19) + 1;

    setTimeout(() => {
      const specialNumber = Math.floor(Math.random() * 200);
      if (specialNumber === 200) message.channel.send("21");
      else if (specialNumber === 0) message.channel.send("0");
      else message.channel.send(`Your number is: ${D20}`);
    }, 15);
  }

  if (message.content === "!blin" && !message.author.bot) {
    message.channel.send(`Blin for real`);
  }
});

client.login(process.env.DISCORD_TOKEN);
