const Data = require('../data/db')

function view(args, mockDb) {
  const db = mockDb ? mockDb : new Data()

  const info = db.getOne(args.id)

  if (!info) {
    console.log('Task not found.')
    return
  }

  const output = `
    =================================================
    Todo #:   ${info.rowid}
    Actual #: ${info.id}
    Desc:
      ${info.desc}
    =================================================
  `
  console.log(output)
}

module.exports = view
