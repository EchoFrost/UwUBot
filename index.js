const Discord = require("discord.js");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("./config.json"));
const client = new Discord.Client();

const kaomojis = [
  `. ( ^ ω ^)`,
  `. (っ˘ω˘ς )`,
  `. ٩(◕‿◕｡)۶`,
  `. (o･ω･o)`,
  `. (ღ˘⌣˘ღ)`,
  `. ヾ(・ω・)`,
  `. (づ ◕‿◕ )づ`,
  `. (つ≧▽≦)つ`,
  `. (・ω・)ﾉ`,
  `. ( ◡‿◡ *)`,
  `. (✿◠‿◠)`,
  `. (✿◡‿◡)`,
];

const asterisksInjections = [
  `. \\\**cums*\\\*`,
  `. \\\**notices your bulge*\\\*`,
  `. \\\**blushes*\\\*`,
  `. \\\**motions to waitress, "Czech please!"*\\\*`,
  `. \\\**nuzzles you*\\\*`,
  `. \\\**glomp*\\\*`,
];

// Function for uwuing strings.
const uwufy = (message) => {
  // Replace lower case ls and rs with lower case w.
  message = message.replace(/(?:l|r)/g, "w");

  // Replace upper case Ls and Rs with upper case W.
  message = message.replace(/(?:L|R)/g, "W");

  // Replace 'th' with 'ff'.
  message = message.replace(/(?:th )/gi, "ff ");

  // Replace 'fuck' (case insensitive) with 'fucky wucky'.
  message = message.replace(/(?:fuck)/gi, "fucky wucky");

  // Replace bangs with uwu face.
  message = message.replace(/!+/g, "! >w< ");

  // Replace the character 'n' followed by any vowel with 'ny'.
  const nyaExpression = new RegExp(/(?:n[aeiou])/, "g");
  let nyaExpressionMatch;

  while ((nyaExpressionMatch = nyaExpression.exec(message)) !== null) {
    message = message.substring(0, nyaExpressionMatch.index) + "ny" + message.substring(nyaExpressionMatch.index + 1);
  }

  // Replace periods with either asterisks injections or kaomojis.
  const periodExp = new RegExp(/\.+/, "g");
  let periodExpMatch;

  while ((periodExpMatch = periodExp.exec(message)) !== null) {
    let asterisksInjection = Math.random() < 0.5;

    if (asterisksInjection) {
      message =
        message.substring(0, periodExpMatch.index) +
        asterisksInjections[Math.floor(Math.random() * asterisksInjections.length)] +
        message.substring(periodExpMatch.index + 1);
      continue;
    }

    message = message.substring(0, periodExpMatch.index) + kaomojis[Math.floor(Math.random() * kaomojis.length)] + message.substring(periodExpMatch.index + 1);
  }

  // Randome chance to stutter.
  let stutter = Math.random() < 0.5;

  // If we should stutter add a copy of the first character of the message and put a dash after it.
  if (stutter) {
    let firstChar = message.charAt(0);
    message = firstChar + "-" + message;
  }

  return message;
};

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

  // Random chance to uwu the message.
  if (!(Math.random() < 0.05)) {
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
      tts: false,
    })
    .then(() => {
      console.log(`${new Date().toUTCString()}: Uwufy message sent successfully. ${msg.id}`);
    })
    .catch((error) => {
      console.error(`${new Date().toUTCString()}: Failed to send uwufy message. ${error}`);
      return;
    });
});
