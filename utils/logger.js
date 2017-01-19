let info = true;
let debug = true;
let warn = true;
let error = true;

module.exports = class Logger {
  /**
   * Disables a certain type of logging.
   * The valid types are: INFO, DEBUG, WARN, ERROR
   * @param {string} type The type to set the status of
   * @param {boolean} enabled Whether it should be enabled or disabled
   */
  static set(type, enabled) {
    if (type === 'INFO') {
      info = enabled;
    } else if (type === 'DEBUG') {
      debug = enabled;
    } else if (type === 'WARN') {
      warn = enabled;
    } else if (type === 'ERROR') {
      error = enabled;
    }
  }

  static info(...args) {
    if (!info) return;
    console.log('[INFO]\t', ...args);
  }

  static debug(...args) {
    if (!debug) return;
    console.log('[DEBUG]\t', ...args);
  }

  static warn(...args) {
    if (!warn) return;
    console.log('[WARN]\t', ...args);
  }

  static error(...args) {
    if (!error) return;
    console.log('[ERROR]\t', ...args);
  }

  static log(...args) { console.log('[LOG]\t', ...args); }
};
