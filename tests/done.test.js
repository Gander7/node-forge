const add = require('../src/cmds/add')
const done = require('../src/cmds/done')
const list = require('../src/cmds/list')
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

describe('Done Command', () => {
  test('task is archived', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    done(1, db)

    expect(output.log.length).toEqual(2)
    expect(output.log).toContainEqual(expect.stringContaining('Task 1 archived'))

    output.log = []
    list()
    expect(output.log[0]).toEqual(expect.not.stringContaining('test add 1'))
  })

  test("task to mark as done does't exist", () => {
    done(1)

    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual(expect.stringContaining('Task 1 not found.'))
  })

  test('new task error', () => {
    const db = new Data()
    jest.spyOn(db, 'removeTask').mockImplementation(() => {})
    jest.spyOn(db, 'insert').mockImplementation(() => {})

    add(['test', 'add', '1'], db)

    expect(output.log.length).toEqual(0)
  })
})
