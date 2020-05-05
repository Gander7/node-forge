const { insert } = require('../lib/insert')

function add(args) {
  const newTask = {
    desc: args.join(' '),
  }
  const info = insert(newTask)
  if (info) console.log(`Task ${info.lastInsertRowid} inserted.`)
}

module.exports = add
