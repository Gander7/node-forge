const Data = require('../data/db')

function start(id, mockDb) {
  const db = mockDb ? mockDb : new Data()

  const info = db.startTask(id)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} started.`)
    else console.log(`Task not found.`)
  }
}

module.exports = start
