const { remove } = require('../lib/delete')

function deleteTask(id) {
  const info = remove(id)
  if (info && info.changes > 0) console.log(`Task ${id} deleted.`)
  else if (info) console.log(`Task not found.`)
}

module.exports = deleteTask
