const Data = require('../data/db')

function add(args, mockDb) {
  const newTask = {
    desc: args.join(' '),
  }

  const db = mockDb ? mockDb : new Data()
  const info = db.insert(newTask)

  if (info) console.log(`Task ${info.lastInsertRowid} inserted.`)
}

module.exports = add
