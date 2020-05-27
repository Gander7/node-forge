const Data = require('../data/db')

function prepend(id, args, mockDb) {
  const db = mockDb ? mockDb : new Data()

  const task = db.getOne(id)
  if (!task) {
    console.log(`Task not found.`)
    return
  }

  const updatedTask = {
    id,
    desc: `${args.join(' ')} ${task.desc}`,
  }

  const info = db.updateTask(updatedTask)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} updated.`)
    else console.log(`Task not found.`)
  }
}

module.exports = prepend
