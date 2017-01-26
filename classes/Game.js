const { Collection } = require('discord.js');
const EventEmitter = require('events').EventEmitter;

const Class = require('./Class.js');

module.exports = class Game extends EventEmitter {
  constructor(data = {}) {
    super();

    this.players = new Collection();

    this.classes = new Collection([
      [0, new Class({ name: 'Guardian' })],
      [1, new Class({ name: 'Megumin' })],
    ]);

    Object.assign(this, data);
  }

  player(playerResolvable) {
    return !playerResolvable;
  }
};
