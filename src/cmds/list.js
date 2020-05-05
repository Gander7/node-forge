const asTable = require('as-table')
const list = require('../lib/list')

module.exports = () => {
  const data = list()
  if (data.length > 0) console.log(asTable(list()))
  else console.log('No outstanding tasks found.')
}
