const { Collection } = require('discord.js');
const fs = require('fs');

const { promisify } = require('./misc.js');

/* Does not work for a Collection with Collections in it. */
module.exports = {
  writeCollection: async (location, collection) => {
    return promisify(fs.writeFile)(location, JSON.stringify([...collection]))
  },
  readCollection: async location => {
    const json = await promisify(fs.readFile)(location);
    return new Collection(JSON.parse(json));
  },
/*  isNested: collection => {

  },
  unravel: collection => {

  }*/
};
