const Data = require('../data/db')

function done(id, mockDb) {
  const db = mockDb ? mockDb : new Data()
  const archivedId = db.archive(id)
  if (archivedId) console.log(`Task ${id} archived with id ${archivedId}.`)
  else console.log(`Task ${id} not found.`)
}

module.exports = done
