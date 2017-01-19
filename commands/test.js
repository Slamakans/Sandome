exports.aliases = ['ping'];

exports.run = async message => {
  await message.channel.sendMessage('PONGEZ!');
  return 'Ponge';
};
