const Discord = require('discord.js');

const { RELEASE_TOKEN, DEV_TOKEN } = require('./data/config/sensitive.json');
const { initCommands, processCommand } = require('./utils/CommandFunctions.js');
const { initPrefixes, savePrefixes } = require('./utils/PrefixFunctions.js');
const Logger = require('./utils/logger.js');
const Game = require('./classes/Game.js');

const client = new Discord.Client();
const game = new Game();

global.DEV = process.argv[2] !== '--release';

client.setInterval(savePrefixes, 60000);

/* Handlers */
client.on('message', async message => {
  try {
    const result = await processCommand(message, game);

    if (result && result.response) {
      const response = await (result.reply ?
        message.reply(result.response) : message.channel.sendMessage(result.response));

      if (result.time) {
        response.delete(result.time);
      }
    }
  } catch (err) {
    if (['Failed Validation', 'Invalid Command'].includes(err.reason)) {
      return;
    }

    if (err.reason) {
      const reason = await message.reply(err.reason);
      reason.delete(7500);
    }

    Logger.error(err.reason || err);
  }
});

client.once('ready', async () => {
  await initCommands(client);
  await initPrefixes();
});

client.on('ready', () => {
  Logger.log(`Bot is logged in and ready as ${client.user.username}`);
});

client.ws.on('close', e => `${e.code}: ${e.reason}\n\tClean: ${e.wasClean}`);

client.on('reconnecting', () => console.log('RECONNECTING'));

/* Log in */
client.login(DEV ? DEV_TOKEN : RELEASE_TOKEN); // eslint-disable-line

client.on('error', Logger.error);
client.on('warn', Logger.warn);
// client.on('debug', Logger.debug);
