const Discord = require('discord.js');
const { TOKEN } = require('./data/config/sensitive.json');
const { initCommands, processCommand } = require('./utils/command-parsing-functions.js');
const { initPrefixes } = require('./utils/prefix-functions.js');

const Logger = require('./utils/logger.js');

const client = new Discord.Client();

/* Handlers */
client.on('message', async message => {
  try {
    const result = await processCommand(message);
    if (result) Logger.info(result);
  } catch (err) {
    if (['Failed Validation'].includes(err)) return;
    Logger.error(err);
  }
});

client.on('ready', async () => {
  await initCommands();
  await initPrefixes();
  Logger.log(`Bot is logged in and ready as ${client.user.username}`);
});

/* Log in */
client.login(TOKEN);
