const homedir = require('os').homedir()

const dbPath = `${homedir}/.taskforge`
let dbName = process.env.testing ? `task-testing.db` : `taskforge.db`

module.exports = {
  dbPath,
  dbName,
  dbOutput: null,
}
