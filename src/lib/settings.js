module.exports = (args) => {
  const homedir = require('os').homedir()
  const dbPath = `${homedir}/.taskforge`

  if (!process.env.testing || (args && args.mockLive)) {
    return {
      dbPath,
      dbName: 'taskforge.db',
    }
  } else {
    return {
      dbPath,
      dbName: ':memory:',
    }
  }
}
