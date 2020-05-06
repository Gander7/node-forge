const homedir = require('os').homedir()

const dbPath = `${homedir}/.taskforge`
let dbName = `taskforge.db`

module.exports = {
  dbPath,
  dbName,
  dbOutput: null,
}
