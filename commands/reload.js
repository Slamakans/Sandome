const Command = require('../classes/Command.js');
const { reloadCommand } = require('../utils/CommandFunctions.js');

module.exports = new Command(
  async (message, args) => {
    await reloadCommand(args.join(' '));
    return { response: `_reloaded ${args.join(' ')}_`, time: 2500 };
  },
  [],
  { whitelist: ['114758367905447939'] }
);
