const add = require('../src/cmds/add')
const done = require('../src/cmds/done')
const restore = require('../src/cmds/restore')
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

describe('Restore Command', () => {
  test('completed task is restored', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    add(['test', 'add', '2'], db)
    add(['test', 'add', '3'], db)
    done(1, db)
    restore(1, db)
    list({}, db)

    expect(output.log.length).toEqual(6)
    expect(output.log[4]).toEqual(expect.stringContaining('Task 1 restored'))
    expect(output.log[5]).toEqual(expect.stringContaining('test add 1'))
  })

  test('task to restore not found', () => {
    restore(1)

    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual(expect.stringContaining(`Archived task ${1} not found`))
  })

  test('restore fails', () => {
    const db = new Data()
    jest.spyOn(db, 'restore').mockImplementation(() => undefined)
    restore(1, db)
    expect(output.log.length).toEqual(0)
  })
})
