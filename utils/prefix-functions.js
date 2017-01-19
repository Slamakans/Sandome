const Logger = require('./logger.js');
const { promisify } = require('./misc.js');
const fs = require('fs');
const prefixes = new Map();

module.exports = class PrefixFunctions {

  /**
   * Prefix cannot contain spaces
   * @param {Guild|string} guildOrID The guild to change the prefix for
   * @param {string} prefix The new prefix
   * @returns {string|boolean} Error message or false if successful
   */
  static setPrefix(guildOrID, prefix = PrefixFunctions.DEFAULT_PREFIX) {
    if (prefix.includes(' ')) return `Prefixes can't have spaces in them: \`${prefix}\``;

    prefixes.set(guildOrID.id || guildOrID, prefix.toLowerCase());
    Logger.info(`Set the prefix of '${guildOrID.id || guildOrID} to ${prefix.toLowerCase()}'`);

    return false;
  }

  /**
   * @param {Guild|string} guildOrID The guild to get the prefix for
   * @returns {string} The prefix
   */
  static getPrefix(guildOrID) {
    const prefix = prefixes.get(guildOrID.id || guildOrID);
    if (!prefix) PrefixFunctions.setPrefix(guildOrID);
    return prefix || PrefixFunctions.DEFAULT_PREFIX;
  }

  /**
   * Should only be called once
   * Reads all prefixes from ./data/config/prefixes.json and stores them internally
   * They can be accessed/modified using {@link PrefixFunctions#getPrefix} and {@link PrefixFunctions#setPrefix}
   * @returns {Promise}
   */
  static async initPrefixes() {
    if (prefixes.size) return Promise.reject('Prefixes have already been initiated.');

    const data = await promisify(fs.readFile)('./data/config/prefixes.json', 'utf8');
    const keys = Object.keys(data);

    keys.forEach(key => prefixes.set(key, data[key]));
    Logger.info('Initialized prefixes');

    return Promise.resolve();
  }


  /**
   * Saves all prefixes to ./data/config/prefixes.json
   * @returns {Promise}
   */
  static async save() {
    await promisify(fs.writeFile)('./data/config/prefixes.json', JSON.stringify(prefixes, null, 2));
    Logger.info('Saved prefixes');

    return Promise.resolve();
  }

  static get DEFAULT_PREFIX() { return '!'; }
};
