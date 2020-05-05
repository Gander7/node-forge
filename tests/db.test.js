const fs = require('fs')
const { dbPath, dbName } = require('../src/lib/settings')

const dbLocation = `${dbPath}/${dbName}.db`
const output = { log: [] }
const logger = (info) => output.log.push(info)

beforeEach(() => {
  output.log = []
  console.log = logger
})
describe('DB', () => {
  test('db can be created', () => {
    fs.unlinkSync(dbLocation)
    require('../src/lib/db')
    expect(output.log.length).toEqual(2)
    expect(output.log).toContainEqual(expect.stringContaining('WARNING'))
    expect(output.log).toContainEqual(expect.stringContaining('database initialized'))
  })
})
