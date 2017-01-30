const Command = require('../classes/Command.js');

module.exports = new Command(async message => {
  await message.channel.sendMessage('PONGEZ!');
  return 'Ponge';
}, ['ping'], {
  description: 'Test command',
});
