const { getPrefix } = require('../../utils/PrefixFunctions.js');
const Command = require('../../classes/Command.js');

module.exports = new Command(async (game, message, args) => {
  const character = game.character(message);

  if (character) return Promise.reject({ reason: 'you already have a character' });

  if (args.length === 0) return Promise.reject(`\`${getPrefix(message.guild)}create <name>\``);

  const name = args.shift();

  const responses = message.channel.awaitMessages(r => r.author.id === message.author.id &&
    r.content.toLowerCase() === 'cancel', {
      time: 5000,
      max: 1,
    });

  if (responses.size === 1) return Promise.reject({ reason: `cancelled character creation` });

  game.createCharacter(message.author, name);

  return Promise.resolve({ response: `character created` });
}, [], {
  type: 'game',
  description: `${'`create <name>`'} Create a character, you can only have one at a time.`,
});
