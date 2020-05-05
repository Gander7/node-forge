const db = require('./db')

const insert = (task) => {
  try {
    const stmt = db.prepare(`insert into tasks values (:desc)`)
    const res = stmt.run(task)
    return res
  } catch (err) {
    console.error('ERROR')
    console.error(err)
  }
}

module.exports = {
  insert,
}
