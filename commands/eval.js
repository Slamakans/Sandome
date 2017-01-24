const { inspect } = require('util');
const { promisify } = require('../utils/misc.js'); // eslint-disable-line

const Command = require('../classes/Command.js');

module.exports = new Command(async (message, args) => {
  const depth = args[0].startsWith('depth=') ? args.shift().match(/\d+/)[0] : 0;

  const code = args.join(' ');

  if (!code) {
    return Promise.reject({ reason: 'where\'s my code?' });
  } else {
    // Error is handled in CommandFunctions.js#76
    const result = await eval(`(async () => {${code}})()`);

    let response = inspect(result, { depth });
    if (response.includes(message.client.token)) {
      response = response.replace(new RegExp(message.client.token, 'g'), 'REDACTED MY MAN');
    }

    response = `${'```'}\n${response.replace(/(\\r)?\\n/g, '\n')}${'```'}`;

    return Promise.resolve({ response });
  }
}, [], { whitelist: ['114758367905447939'] });
