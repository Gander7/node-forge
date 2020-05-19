const Data = require('../data/db')

function modify(id, args = [], mockDb) {
  if (!args || args.length === 0) {
    console.error('modify failed. no modifications provided.')
    return
  }
  const db = mockDb ? mockDb : new Data()
  const oldTask = db.getOne(id)

  let tags = []
  let tagsToRemove = []

  const newDesc = args
    .filter((word) => {
      if (word[0] === '+' && word.length > 1) {
        tags.push(word.slice(1))
        return false
      } else if (word[0] === '-' && word.length > 1) {
        tagsToRemove.push(word.slice(1))
        return false
      }
      return true
    })
    .join(' ')

  const task = {
    id,
    desc: newDesc ? newDesc : oldTask.desc,
    tags,
    tagsToRemove,
  }

  const info = db.update(task)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} updated.`)
    else console.log(`Task not found.`)
  }
}

module.exports = modify
