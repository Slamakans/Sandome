const fs = require('fs');

const Logger = require('./logger.js');
const { getPrefix } = require('./prefix-functions.js');
const { promisify } = require('./misc.js');

const { Collection } = require('discord.js');
const commands = new Collection();

module.exports = class CommandParsingFunctions {

  /**
   * Whether or not the message starts with the correct prefix and is not from a bot account
   * @param {Message} message The message to validate
   * @returns {boolean} Whether the message passed or not
   */
  static validateCommand(message) {
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
      .replace(new RegExp(command, 'i'), '');

    return { command, args };
  }

  /**
   * Validates, parses and runs a command if it's valid
   * @param {Message} message The message to process
   * @returns {Promise} The result of running the command, useful for debug/info logging.
   */
  static async processCommand(message) {
    if (CommandParsingFunctions.validateCommand(message)) {
      const { command, args } = CommandParsingFunctions.parseCommand(message);
      try {
        Logger.debug('Command: ', command);
        Logger.debug('Args: ', args);
        return Promise.resolve(
          CommandParsingFunctions.getCommandObject(command).run(message, args)
        );
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject('Failed Validation');
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
    const cmd = CommandParsingFunctions.getCommandObject(command);
    if (cmd) {
      delete require.cache[require.resolve(`.${cmd.requirePath}`)];
      require(`.${cmd.requirePath}`);
      Logger.info(`Reloaded ${cmd.requirePath}`);
    } else {
      throw new Error('No such command exists');
    }
  }

  /**
   * Initializes all the command files in the commands folder and its subfolders etc.
   * @returns {Promise}
   */
  static async initCommands() {
    const files = [];

    const recurse = async dir => {
      const result = await promisify(fs.readdir)(dir);
      const directories = result.filter(file => !file.endsWith('.js'));

      files.push(...result.filter(file => file.endsWith('.js')).map(file => `${dir}/${file}`));

      for (const directory of directories) {
        await recurse(`${dir}/${directory}`);
      }
    };

    await recurse('commands');

    files.forEach(file => {
      const cmd = require(`../${file}`);
      Logger.debug('cmd (line 80 command-parsing-functions.js): ', cmd);
      cmd.requirePath = `./${file}`;

      commands.set(file.split('/').pop().slice(0, -3), cmd);
    });

    Logger.debug('List of commands:\n', files.join('\n'));
    Logger.info('Initialized commands');

    return Promise.resolve();
  }
};
