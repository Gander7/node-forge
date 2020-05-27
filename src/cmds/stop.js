const Data = require('../data/db')

function stop(id, mockDb) {
  const db = mockDb ? mockDb : new Data()

  const info = db.stopTask(id)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} stopped.`)
    else console.log(`Task not found.`)
  }
}

module.exports = stop
