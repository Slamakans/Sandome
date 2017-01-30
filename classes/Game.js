const { Collection } = require('discord.js');
const EventEmitter = require('events').EventEmitter;

const Character = require('./Character.js');

module.exports = class Game extends EventEmitter {
  constructor(data = {}) {
    super();

    this.characters = new Collection();

    Object.assign(this, data);
  }

  /* Anything with an id property or an author property with an id property (Message) */
  character(characterResolvable) {
    const { id } = characterResolvable.author || characterResolvable;

    return this.characters.get(id);
  }

  createCharacter(user, name) {
    this.characters.set(user.id, new Character(name));
  }
};
