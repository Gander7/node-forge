const Data = require('../src/data/db')

module.exports = async () => {
  // Make sure that the real db is created before testing
  // One of the db tests relies on it already existing, even if empty.
  new Data()
  process.env.testing = true
}
