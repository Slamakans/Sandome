const Command = require('../classes/Command.js');
const { setPrefix, DEFAULT_PREFIX } = require('../utils/PrefixFunctions.js');

module.exports = new Command(async (message, args) => {
  const newPrefix = args.shift();
  setPrefix(message.guild, newPrefix);

  if (!newPrefix) return Promise.resolve({ response: `Reset the prefix to the default: \`${DEFAULT_PREFIX}\`` });
  else return Promise.resolve({ response: `Set the prefix to \`${newPrefix}\`` });
}, [], { permissions: ['MANAGE_CHANNELS'] });
