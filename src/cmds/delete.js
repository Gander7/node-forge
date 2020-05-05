const { remove } = require('../lib/delete')

function deleteTask(id) {
  const info = remove(id)
  if (info.changes === 0) console.log(`Task not found.`)
  else console.log(`Task ${id} deleted.`)
}

module.exports = deleteTask
