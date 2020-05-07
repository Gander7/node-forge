const Data = require('../data/db')

function restore(id, mockDb) {
  const db = mockDb ? mockDb : new Data()
  const info = db.restore(id)

  if (info) {
    if (info.changes > 0)
      console.log(`Task ${id} restored with the todo # ${info.lastInsertRowid}.`)
    else console.log(`Archived task ${id} not found.`)
  }
}

module.exports = restore
