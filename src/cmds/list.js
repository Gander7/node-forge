const asTable = require('as-table')
const list = require('../lib/list')

module.exports = () => {
  const data = list()

  if (data && data.length > 0) console.log(asTable(list()))
  else if (data) console.log('No outstanding tasks found.')
}
