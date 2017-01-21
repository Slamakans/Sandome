const { Collection } = require('discord.js');
const EventEmitter = require('events').EventEmitter;

const Class = require('./Class.js');

module.exports = class Game extends EventEmitter {
  constructor(data = {}) {
    super();

    this.players = new Collection();

    this.races = new Collection(
      [0, new Class({
        name: 'Elin',
        forceGender: 'Female',
      })],
      [1, new Class({
        name: 'Elf',
      })],
      [2, new Class({
        name: 'Human',
      })]
    );

    Object.assign(this, data);
  }
};
