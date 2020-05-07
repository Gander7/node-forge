const Data = require('../data/db')

function modify(id, args, mockDb) {
  const db = mockDb ? mockDb : new Data()

  const task = db.getOne(id)
  if (!task) {
    console.log(`Task not found.`)
    return
  }

  const updatedTask = {
    id,
    desc: `${task.desc} ${args.join(' ')}`,
  }

  const info = db.update(updatedTask)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} updated.`)
    else console.log(`Task not found.`)
  }
}

module.exports = modify
