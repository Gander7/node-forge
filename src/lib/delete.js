const db = require('./db')

exports.remove = (id) => {
  try {
    const stmt = db.prepare(`delete from tasks where rowid = ?`)
    const res = stmt.run(id)
    return res
  } catch (err) {
    console.error('ERROR')
    console.error(err)
  }
}
