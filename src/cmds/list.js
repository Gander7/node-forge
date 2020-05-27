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
      data = db.getProjectList()
      emptyMsg = 'No project data found.'
    } else {
      data = db.getAll()
    }
  }

  if (data && data.length > 0) console.log(asTable(data))
  else if (data) console.log(emptyMsg)
}
