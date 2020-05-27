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
  let project = ''
  let projectToRemove = ''

  const newDesc = args
    .filter((word) => {
      word = typeof word !== 'string' ? word.toString() : word
      if (word[0] === '+' && word.length > 1) {
        tags.push(word.slice(1))
        return false
      } else if (word[0] === '-' && word.length > 1) {
        tagsToRemove.push(word.slice(1))
        return false
      } else if (word.startsWith('prj:') || word.startsWith('project:')) {
        const parsedProject = word.slice(word.indexOf(':') + 1)
        projectToRemove = oldTask.project !== '' ? oldTask.project : ''
        project = project === '' ? parsedProject : project
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
    project,
    projectToRemove,
  }

  const info = db.updateTask(task)

  if (info) {
    if (info.changes > 0) console.log(`Task ${id} updated.`)
    else console.log(`Task not found.`)
  }
}

module.exports = modify
