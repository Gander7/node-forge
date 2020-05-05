const asTable = require('as-table')
const list = require('../lib/list')

module.exports = (args) => {
  console.log(asTable(list()))
}
