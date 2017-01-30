const fs = require('fs');
const { Collection } = require('discord.js');

const Logger = require('./logger.js');
const { getPrefix } = require('./PrefixFunctions.js');
const { promisify } = require('./misc.js');

const commands = new Collection();

module.exports = class CommandFunctions {

  /**
   * Whether or not the message starts with the correct prefix and is not from a bot account
   * @param {Message} message The message to validate
   * @returns {boolean} Whether the message passed or not
   */
  static validateCommand(message) {
    if (!message.member) return false;
    if (message.author.bot) return false;

    const { content, guild } = message;

    return content.toLowerCase().startsWith(getPrefix(guild));
  }

  /**
   * Parses a message, splitting it into the command used and the arguments passed and return them as an object
   * @param {Message} message The message to parse
   * @returns {Object} An object with properties: command, args
   */
  static parseCommand(message) {
    const { content, guild } = message;
    const prefix = getPrefix(guild);
    const command = content.toLowerCase().split(' ').shift()
      .replace(prefix, '');
    const args = content.replace(new RegExp(prefix, 'i'), '')
      .replace(new RegExp(command, 'i'), '')
      .trim()
      .split(' ');

    return { command, args };
  }

  /**
   * Validates, parses and runs a command if it's valid
   * @param {Message} message The message to process
   * @param {Game} game This will be passed to the run function of a GameCommand
   * @returns {Promise} The result of running the command, useful for debug/info logging.
   */
  static async processCommand(message, game) {
    if (CommandFunctions.validateCommand(message)) {
      const { command, args } = CommandFunctions.parseCommand(message);
      try {
        Logger.debug('Command: ', command);
        Logger.debug('Args: ', args);
        const commandObject = CommandFunctions.getCommandObject(command);

        if (!commandObject) return Promise.reject({ reason: 'Invalid Command' });

        if (commandObject.canRun(message.member)) {
          if (commandObject.type === 'game') {
            return await commandObject.run(game, message, args);
          } else {
            return await commandObject.run(message, args);
          }
        } else {
          return Promise.reject({ reason: 'Insufficient Permissions' });
        }
      } catch (err) {
        if (command !== 'eval') {
          if (err.reason) return Promise.reject(err);

          await message.client.channels.get('273476607354863617')
            .sendMessage(`${'```'}asciidoc\n${err.stack.slice(0, 1950)}${'```'}`);

          return Promise.reject({
            reason: `error: ${err.message}\n\nThis error message has been sent to the developer(s).`,
          });
        } else {
          return await message.channel.sendMessage(`${'```'}asciidoc\n${err.stack.slice(0, 1950)}${'```'}`);
        }
      }
    } else {
      return Promise.reject({ reason: 'Failed Validation' });
    }
  }

  /**
   * @param {string} command The filename or one of the aliases of a command
   * @returns {Object} The command object
   */
  static getCommandObject(command) {
    return commands.get(command) || commands.find(c => c.aliases.includes(command));
  }

  /**
   * @param {string} command The filename or one of the aliases of a command
   */
  static reloadCommand(command) {
    const cmd = CommandFunctions.getCommandObject(command);
    if (cmd) {
      delete require.cache[require.resolve(`.${cmd.requirePath}`)];

      const reloadedCommand = require(`.${cmd.requirePath}`);
      reloadedCommand.requirePath = cmd.requirePath;
      commands.set(cmd.requirePath.split('/').pop().slice(0, -3), reloadedCommand);

      Logger.info(`Reloaded .${cmd.requirePath}`);
    } else {
      throw new Error('No such command exists');
    }
  }

  /**
   * Initializes all the command files in the commands folder and its subfolders etc.
   * and assigns the collection of commands to the passed Client.
   * @param {Client} client The Client object to assign the Collection<name, Command> to (client.commands)
   * @returns {Promise}
   */
  static async initCommands(client) {
    const files = [];

    const recurse = async dir => {
      const result = await promisify(fs.readdir)(dir);
      const directories = result.filter(file => !file.endsWith('.js'));

      files.push(...result.filter(file => file.endsWith('.js')).map(file => `${dir}/${file}`));

      const promises = [];
      for (const directory of directories) {
        promises.push(recurse(`${dir}/${directory}`));
      }

      return Promise.all(promises);
    };

    await recurse('commands');

    files.forEach(file => {
      const cmd = require(`../${file}`);
      cmd.requirePath = `./${file}`;
      // Logger.debug('cmd (line 80 command-parsing-functions.js): ', cmd);

      commands.set(file.split('/').pop().slice(0, -3), cmd);
    });

    Logger.debug('List of commands:\n', files.join('\n'));
    Logger.info('Initialized commands');

    client.commands = commands;

    return Promise.resolve();
  }
};
