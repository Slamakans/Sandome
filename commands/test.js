const Command = require('../classes/Command.js');

module.exports = new Command(['ping'], async message => {
  await message.channel.sendMessage('PONGEZ!');
  return 'Ponge';
});
