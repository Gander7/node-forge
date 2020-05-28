const Data = require('../data/db')
const asTable = require('as-table')

module.exports = (args = {}, mockDb) => {
  let emptyMsg = 'No outstanding tasks found.'
  const db = mockDb ? mockDb : new Data()
  let data
  if (args.d || args.done) {
    data = db.getArchived()
  } else {
    if (args._ && args._[0] == 'tags') {
      data = db.getTagList()
      emptyMsg = 'No tag data found.'
    } else if (args._ && args._[0] == 'projects') {
      const prjs = db.getProjects()
      const todo = db.getProjectsByOutstanding()
      const done = db.getProjectsByCompleted()

      data = prjs
        .map((prj) => {
          const todoCount = todo.find((task) => task.project === prj.project)
          const doneCount = done.find((task) => task.project === prj.project)
          prj.done = doneCount ? doneCount.count : 0
          prj.todo = todoCount ? todoCount.count : 0
          prj.total = prj.done + prj.todo
          prj.vs = `${prj.done}/${prj.total}`
          prj.percentage = Math.floor((prj.done / prj.total) * 100)
          return prj
        })
        .sort((a, b) => (a.percentage > b.percentage ? 1 : -1))
      emptyMsg = 'No project data found.'
    } else {
      data = db.getAll()
    }
  }

  if (data && data.length > 0) console.log(asTable(data))
  else if (data) console.log(emptyMsg)
}
