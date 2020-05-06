const Data = require('../src/data/db')

module.exports = async () => {
  process.env.testing = true
  const db = new Data()
}
