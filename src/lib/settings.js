const homedir = require('os').homedir()

const dbPath = `${homedir}/.taskforge`
let dbName = `taskforge`

console.warn(process.env)

module.exports = {
  dbPath,
  dbName,
  dbOutput: null,
}
