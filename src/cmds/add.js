const Data = require('../data/db')

function add(args = undefined, mockDb) {
  const db = mockDb ? mockDb : new Data()

  let tags = []
  const desc = args
    ? args
        .filter((word) => {
          if (word[0] === '+' && word.length > 1) {
            tags.push(word.slice(1))
            return false
          }
          return true
        })
        .join(' ')
    : ''

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
