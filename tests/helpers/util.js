const Data = require('../../src/data/db')

exports.cleanDb = () => {
  const db = new Data()
  db.cleanTable('tasks')
  db.cleanTable('projects')
  db.cleanTable('timelog')
}
