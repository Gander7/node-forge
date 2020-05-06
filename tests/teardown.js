const { dbPath, dbName } = require('../src/lib/settings')
const rimraf = require('rimraf')

module.exports = async () => {
  rimraf.sync(`${dbPath}/${dbName}`)
  process.env.testing = undefined
}
