const { getPrefix } = require('../../utils/PrefixFunctions.js');
const Command = require('../../classes/Command.js');

module.exports = new Command(async (game, message, args) => {
  const player = game.player(message);
  if (player) return Promise.reject('You already have a character!');
  console.log('MEMES');
  let name, race;
  if (args.length === 2) {
    name = args.shift();
    race = args.shift();
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

    const raceEmbed = new (require('discord.js')).RichEmbed()
      .setDescription('These are the available races');
    game.races.forEach(r => raceEmbed.addField(r.name, r.description || '_No description yet_'));

    await message.sendEmbed(raceEmbed);
    const raceCollector = message.channel.createCollector(async m => {
      if (m.author.id !== message.author.id) return false;

      if (game.races.find(r => r.name.toLowerCase() === m.content.toLowerCase())) {
        return true;
      } else {
        await m.reply('that\'s not a valid race');
        return false;
      }
    }, { time: 20000, maxMatches: 1 });

    race = await new Promise(resolve => raceCollector.on('end', collected => {
      resolve(collected.first());
    }));

    if (!race) return Promise.reject(`No race was chosen, use \`${getPrefix(message.guild)}create\` to try again.`);
  }

  return Promise.resolve({ response: `Created a ${race} named ${name}` });
}, [], { type: 'game' });
