const Data = require('../data/db')

function modify(id, args, mockDb) {
  const db = mockDb ? mockDb : new Data()

  const task = {
    id,
    desc: args.join(' '),
  }

  const info = db.update(task)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} updated.`)
    else console.log(`Task not found.`)
  }
}

module.exports = modify
