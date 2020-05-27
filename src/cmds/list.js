const Data = require('../data/db')
const asTable = require('as-table')

module.exports = (args = {}, mockDb) => {
  const db = mockDb ? mockDb : new Data()
  let data
  if (args.d || args.done) {
    data = db.getArchived()
  } else {
    if (args._ && args._[0] == 'tags') {
      data = db.getTagList()
    } else {
      data = db.getAll()
    }
  }

  if (data && data.length > 0) console.log(asTable(data))
  else if (data) console.log('No outstanding tasks found.')
}
