const { Collection } = require('discord.js');
const EventEmitter = require('events').EventEmitter;

const Race = require('./Race.js');

module.exports = class Game extends EventEmitter {
  constructor(data = {}) {
    super();

    this.players = new Collection();

    this.races = new Collection([
      [0, new Race({
        name: 'Elin',
        forceGender: 'Female',
      })],
      [1, new Race({
        name: 'Elf',
      })],
      [2, new Race({
        name: 'Human',
      })],
    ]);

    Object.assign(this, data);
  }

  player(playerResolvable) {
    return !playerResolvable;
  }
};
