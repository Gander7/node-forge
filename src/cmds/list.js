const Data = require('../data/db')
const asTable = require('as-table')

module.exports = (mockDb) => {
  const db = mockDb ? mockDb : new Data()
  const data = db.getAll()

  if (data && data.length > 0) console.log(asTable(data))
  else if (data) console.log('No outstanding tasks found.')
}
