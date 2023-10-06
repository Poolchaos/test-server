// env-loader.js
module.exports = function (source) {
  const env = process.argv.reduce((result, arg) => {
    const match = arg.match(/--env=(\w+)/);
    if (match) {
      result = match[1];
    }
    return result;
  }, 'production');
  return env;
};
