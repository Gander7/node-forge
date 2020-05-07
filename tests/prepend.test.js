const prepend = require('../src/cmds/prepend')
const add = require('../src/cmds/add')
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

describe('Prepend Command', () => {
  test('task desc is prepended', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    list({}, db)
    prepend(1, ['prepended', 'to', 'task'], db)
    list({}, db)

    expect(output.log.length).toEqual(4)
    expect(output.log[2]).toEqual(expect.stringContaining('Task 1 updated.'))
    expect(output.log[3]).toEqual(expect.stringContaining('prepended to task test add 1'))
  })

  test('get task not found', () => {
    prepend(1, ['test', 'that', 'doesnt', 'exist'])
    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual(expect.stringContaining('Task not found.'))
  })

  test('update task not found', () => {
    const db = new Data()
    jest.spyOn(db, 'getOne').mockImplementation(() => {
      return { desc: '' }
    })
    prepend(1, ['test', 'that', 'doesnt', 'exist'], db)
    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual(expect.stringContaining('Task not found.'))
  })

  test('update fails', () => {
    const db = new Data()
    jest.spyOn(db, 'update').mockImplementation(() => undefined)
    jest.spyOn(db, 'getOne').mockImplementation(() => {
      return { desc: '' }
    })
    prepend(1, ['test', 'that', 'doesnt', 'exist'], db)
    expect(output.log.length).toEqual(0)
  })
})
