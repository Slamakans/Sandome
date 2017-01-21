module.exports = class Command {
  constructor(aliases, run, options = {}) {
    this.aliases = aliases;
    this.run = run;
    this.permissions = [];
    Object.assign(this, options);
  }

  /**
   * Checks if the GuildMember can
   * @param {GuildMember} member The GuildMember to test
   * @returns {boolean} Whether the executor can run the command or not
   */
  async canRun(member) {
    if (this.permissions.length && !member.hasPermissions(this.permissions)) return false;

    return true;
  }
};
