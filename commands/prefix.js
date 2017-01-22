const Command = require('../classes/Command.js');
const { setPrefix } = require('../utils/PrefixFunctions.js');

module.exports = new Command(async (message, args) => {
  setPrefix(message.guild, args.shift());
}, [], { permissions: ['MANAGE_CHANNELS'] });
