const db = require('../../src/lib/db')

exports.cleanTable = (tableName) => {
  db.prepare(`delete from ${tableName}`).run()
}

exports.cleanDb = () => {
  try {
    db.prepare(`delete from tasks`).run()
    db.prepare(`delete from projects`).run()
    db.prepare(`delete from timelog`).run()
  } catch (e) {
    console.error('ERROR')
    console.error(e)
  }
}
