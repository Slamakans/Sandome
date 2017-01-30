const Logger = require('../utils/Logger.js');

module.exports = class Command {
  constructor(run, aliases = [], options = {}) {
    this.run = run;

    this.aliases = aliases;

    this.permissions = [];

    this.whitelist = [];

    this.type = 'normal';

    Object.assign(this, options);

    Logger.debug(require('util').inspect(this));
  }

  /**
   * Checks if the GuildMember can
   * @param {GuildMember} member The GuildMember to test
   * @returns {boolean} Whether the executor can run the command or not
   */
  async canRun(member) {
    if (this.permissions.length && !member.hasPermissions(this.permissions)) return false;
    if (this.whitelist.length && !this.whitelist.includes(member.id)) return false;

    return true;
  }

  get helpLine() {
    return `**${this.requirePath.split('/').pop().slice(0, -3)}:** ${this.description || 'No description added yet.'}`;
  }
};
