const modify = require('../src/cmds/modify')
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

describe('Modify Command', () => {
  test('task desc is modified', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    list({}, db)
    modify(1, ['test', 'modify'], db)
    list({}, db)

    expect(output.log.length).toEqual(4)
    expect(output.log[2]).toEqual(expect.stringContaining('Task 1 updated.'))
    expect(output.log[3]).toEqual(expect.stringContaining('test modify'))
  })

  test('task not found', () => {
    modify(1, ['test', 'that', 'doesnt', 'exist'])
    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual(expect.stringContaining('Task not found.'))
  })

  test('update fails', () => {
    const db = new Data()
    jest.spyOn(db, 'update').mockImplementation(() => undefined)
    modify(1, ['test', 'that', 'doesnt', 'exist'], db)
    expect(output.log.length).toEqual(0)
  })
})
