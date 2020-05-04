const homedir = require('os').homedir()

const dbPath = `${homedir}/.taskforge`
let dbName = `taskforge`

module.exports = {
  dbPath,
  dbName,
  dbOutput: null,
}
