module.exports = class Misc {

  /**
   * Turns a function that takes a callback into an await-compatible function
   * @param {Function} func The function to promisify
   * @returns {Function} A function returning a promise, compatible with await
   */
  static promisify(func) {
    return (...args) => new Promise((resolve, reject) => {
      func(...args, (err, res) => err ? reject(err) : resolve(res));
    });
  }
};
