const Data = require('../data/db')

function add(args = [], mockDb) {
  if (!args || args.length === 0) {
    console.error('modify failed. no modifications provided.')
    return
  }

  const db = mockDb ? mockDb : new Data()

  let tags = []
  let project = ''
  const desc = args
    .filter((word) => {
      word = typeof word !== 'string' ? word.toString() : word
      if (word[0] === '+' && word.length > 1) {
        tags.push(word.slice(1))
        return false
      } else if (word.startsWith('prj:') || word.startsWith('project:')) {
        project = project === '' ? word.slice(word.indexOf(':') + 1) : project
        return false
      }
      return true
    })
    .join(' ')

  if (!desc) {
    console.error('add failed. no task provided.')
    return
  }

  const newTask = {
    desc,
    tags,
    project,
  }

  const info = db.insert(newTask)

  if (info) console.log(`Task ${info.lastInsertRowid} inserted.`)
  else console.error('add failed.')
}

module.exports = add
