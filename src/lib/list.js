const db = require('./db')

module.exports = (task) => {
  try {
    const stmt = db.prepare(`select rowid, desc from tasks`)
    const res = stmt.all()
    return res
  } catch (err) {
    console.error('ERROR')
    console.error(err)
  }
}
