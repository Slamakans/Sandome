const { getPrefix } = require('../../utils/PrefixFunctions.js');
const Command = require('../../classes/Command.js');

module.exports = new Command(async (game, message, args) => {
  const player = game.player(message);
  if (player) return Promise.reject('You already have a character!');
  console.log('MEMES');
  let name, type;
  if (args.length === 2) {
    name = args.shift();
    type = args.shift();
  } else {
    await message.reply(`choose a name (cannot contain spaces)`);
    const nameCollector = message.channel.createCollector(async m => {
      if (m.author.id !== message.author.id) return false;

      if (!m.content.includes(' ')) {
        return true;
      } else {
        await m.reply('name cannot contain spaces');
        return false;
      }
    }, { time: 20000, maxMatches: 1 });

    name = await new Promise(resolve => nameCollector.on('end', collected => {
      resolve(collected.first());
    }));

    if (!name) return Promise.reject(`No name was chosen, use \`${getPrefix(message.guild)}create\` to try again.`);

    const classEmbed = new (require('discord.js')).RichEmbed()
      .setDescription('These are the available classes');
    game.classes.forEach(c => classEmbed.addField(c.name, c.description || '_No description yet_'));

    await message.sendEmbed(classEmbed);
    const typeCollector = message.channel.createCollector(async m => {
      if (m.author.id !== message.author.id) return false;

      if (game.classes.find(c => c.name.toLowerCase() === m.content.toLowerCase())) {
        return true;
      } else {
        await m.reply('that\'s not a valid class');
        return false;
      }
    }, { time: 20000, maxMatches: 1 });

    type = await new Promise(resolve => typeCollector.on('end', collected => {
      resolve(collected.first());
    }));

    if (!type) return Promise.reject(`No class was chosen, use \`${getPrefix(message.guild)}create\` to try again.`);

    game.createCharacter(message, type, name);
  }

  return Promise.resolve({ response: `Created a ${type} named ${name}` });
}, [], { type: 'game' });
