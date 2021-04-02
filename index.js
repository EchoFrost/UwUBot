const Discord = require("discord.js");
const fs = require("fs");
const uwufy = require("uwufy");

const config = JSON.parse(fs.readFileSync("./config.json"));
const client = new Discord.Client();

// Check our config data before proceeding.
if (!config.loginToken) {
  console.error(`${new Date().toUTCString()}: Invalid login token. Please check your config.`);
  process.exit(9);
}

// Logs the client in, establishing a websocket connection to Discord.
client.login(config.loginToken);

// Emitted when the client becomes ready to start working.
client.on("ready", () => {
  console.log(`${new Date().toUTCString()}: Logged in as ${client.user.tag}. Ready to begin processing feedback.`);
});

// Emitted whenever the client tries to reconnect to the WebSocket.
client.on("reconnecting", () => {
  console.log(`${new Date().toUTCString()}: Client attempting to reconnect to the WebSocket.`);
});

// Emitted whenever a WebSocket resumes.
client.on("resume", (replayed) => {
  console.log(`${new Date().toUTCString()}: WebSocket resumed, ${replayed} replays.`);
});

// Emitted for general debugging information.
client.on("debug", (info) => {
  console.log(`${new Date().toUTCString()}: Info: ${info}`);
});

// Emitted for general warnings.
client.on("warn", (info) => {
  console.log(`${new Date().toUTCString()}: Warn: ${info}`);
});

// Emitted when the client encounters an error.
client.on("error", (error) => {
  console.error(`${new Date().toUTCString()}: Client's WebSocket encountered a connection error. ${error}`);
});

// Emitted when the client hits a rate limit while making a request.
client.on("rateLimit", (rateLimitInfo) => {
  console.log(`${new Date().toUTCString()}: Client is rate limited. Timeout: ${rateLimitInfo.timeout}`);
});

// Emitted whenever a message is created.
client.on("message", (msg) => {
  // If the message author is a bot (including ourself) do not do anything.
  if (msg.author.bot) {
    return;
  }

  // UwUify the message.
  const uwuReply = uwufy(msg.content);

  // If something went wrong with uwufy do nothing/
  if (!uwuReply) {
    console.error(`${new Date().toUTCString()}: Failed to uwufy the message.`);
    return;
  }

  // Reply with uwu'd message.
  msg.channel
    .send(uwuReply, {
      tts: true,
    })
    .then(() => {
      console.log(`${new Date().toUTCString()}: Uwufy message sent successfully. ${msg.id}`);
    })
    .catch((error) => {
      console.error(`${new Date().toUTCString()}: Failed to send uwufy message. ${error}`);
      return;
    });
});
