const Data = require('../data/db')

function remove(id, mockDb) {
  const db = mockDb ? mockDb : new Data()
  const info = db.removeTask(id)

  if (info && info.changes > 0) console.log(`Task ${id} removed.`)
  else if (info) console.log(`Task not found.`)
  else console.error('error')
}

module.exports = remove
