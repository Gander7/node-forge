const Data = require('../data/db')

function modify(id, args, mockDb) {
  if (!args || args.length === 0) {
    console.error('modify failed. no modifications provided.')
    return
  }
  const db = mockDb ? mockDb : new Data()
  const oldTask = db.getOne(id)

  let tags = []
  const desc = args
    ? args
        .filter((word) => {
          if (word[0] === '+') tags.push(word.slice(1))
          return word[0] !== '+'
        })
        .join(' ')
    : ''

  const task = {
    id,
    desc: desc ? desc : oldTask.desc,
    tags,
  }

  const info = db.update(task)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} updated.`)
    else console.log(`Task not found.`)
  }
}

module.exports = modify
