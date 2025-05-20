const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  plugins: [new YtDlpPlugin()],
  leaveOnEmpty: true,
  emitNewSongOnly: true,
});

client.on("ready", () => {
  console.log(`🎵 Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  const args = message.content.split(" ");
  if (args[0] === "!play") {
    const query = args.slice(1).join(" ");
    if (!message.member.voice.channel)
      return message.reply("🎧 Voice channel এ join হও আগে!");
    distube.play(message.member.voice.channel, query, {
      textChannel: message.channel,
      member: message.member,
    });
  }
  if (args[0] === "!stop") {
    distube.stop(message);
    message.channel.send("🛑 গান বন্ধ করা হলো!");
  }
  if (args[0] === "!skip") {
    distube.skip(message);
    message.channel.send("⏭️ পরবর্তী গান চালানো হলো!");
  }
  if (args[0] === "!queue") {
    const queue = distube.getQueue(message);
    if (!queue) return message.channel.send("😕 কোনো গান নেই queue তে!");
    message.channel.send(
      `🎶 Queue:\n${queue.songs
        .map((song, i) => `${i + 1}. ${song.name} - ${song.formattedDuration}`)
        .join("\n")}`
    );
  }
});

client.login(process.env.TOKEN);
