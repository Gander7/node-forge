const remove = require('../src/cmds/remove')
const add = require('../src/cmds/add')
const Data = require('../src/data/db')

const output = {
  log: [],
  error: [],
}

const mockedLog = (info) => output.log.push(info)
const mockedError = (info) => output.error.push(info)

beforeEach(() => {
  output.log = []
  output.error = []
  console.log = mockedLog
  console.error = mockedError
})

describe('Remove Command', () => {
  // store and reset original output
  test('task is removed', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    remove(1, db)
    expect(output.log).toContainEqual(expect.stringContaining('Task 1 removed.'))
  })

  test('test to remove not found with no tests', () => {
    const db = new Data()
    remove(1, db)
    expect(output.log).toContainEqual(expect.stringContaining('Task not found.'))
  })

  test('test to remove not found with tests', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    remove(99, db)
    expect(output.log).toContainEqual(expect.stringContaining('Task not found.'))
  })

  test('remove task error', () => {
    const db = new Data()
    jest.spyOn(db, 'remove').mockImplementation(() => undefined)

    remove(1, db)

    expect(output.log.length).toEqual(0)
  })
})
