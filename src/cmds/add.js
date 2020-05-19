const Data = require('../data/db')

function add(args = [], mockDb) {
  const db = mockDb ? mockDb : new Data()

  let tags = []
  const desc = args
    .filter((word) => {
      if (word[0] === '+') tags.push(word.slice(1))
      return word[0] !== '+'
    })
    .join(' ')

  if (!desc) {
    console.error('add failed. no task provided.')
    return
  }

  const newTask = {
    desc,
    tags,
  }

  const info = db.insert(newTask)

  if (info) console.log(`Task ${info.lastInsertRowid} inserted.`)
  else console.error('add failed. TODO:ERROR LOG FOR REPORTING')
}

module.exports = add
