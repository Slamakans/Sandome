const { Collection } = require('discord.js');

const { writeCollection, readCollection } = require('./CollectionFunctions.js');
const Logger = require('./logger.js');

/* Discord.Collection */
let prefixes;

module.exports = class PrefixFunctions {

  /**
   * Prefix cannot contain spaces
   * @param {Guild|string} guildOrID The guild to change the prefix for
   * @param {string} prefix The new prefix
   * @returns {string|boolean} Error message or false if successful
   */
  static setPrefix(guildOrID, prefix = PrefixFunctions.DEFAULT_PREFIX) {
    if (prefix.includes(' ')) throw new Error(`Prefixes can't have spaces in them: \`${prefix}\``);

    prefixes.set(guildOrID.id || guildOrID, prefix.toLowerCase());
    Logger.info(`Set the prefix of '${guildOrID.id || guildOrID}' to ${prefix.toLowerCase()}`);

    return false;
  }

  /**
   * @param {Guild|string} guildOrID The guild to get the prefix for
   * @returns {string} The prefix
   */
  static getPrefix(guildOrID) {
    const prefix = prefixes.get(guildOrID.id || guildOrID);
    return prefix || PrefixFunctions.DEFAULT_PREFIX;
  }

  /**
   * Should only be called once
   * Reads all prefixes from ./data/config/prefixes.json and stores them internally
   * They can be accessed/modified using {@link PrefixFunctions#getPrefix} and {@link PrefixFunctions#setPrefix}
   * @returns {Promise}
   */
  static async initPrefixes() {
    if (prefixes && prefixes.size) return Promise.reject('Prefixes have already been initiated.');

    try {
      prefixes = await readCollection('./data/config/prefixes.json');
    } catch (err) {
      prefixes = new Collection();
    }

    Logger.info('Initialized prefixes');

    return Promise.resolve();
  }


  /**
   * Saves all prefixes to ./data/config/prefixes.json
   * @returns {Promise}
   */
  static async savePrefixes() {
    await writeCollection('./data/config/prefixes.json', prefixes);
    Logger.info('Saved prefixes');

    return Promise.resolve();
  }

  static get DEFAULT_PREFIX() { return '!'; }
};
