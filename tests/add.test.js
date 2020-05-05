const add = require('../src/cmds/add')
const db = require('../src/lib/db')
const { cleanDb } = require('./helpers/util')

beforeEach(() => {
  cleanDb()
})

describe('Add Command', () => {
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

  test('new task is returned', () => {
    add(['test', 'add', '1'])
    expect(output.log.length).toEqual(1)
    expect(output.log).toContainEqual(expect.stringContaining('Task 1 inserted.'))
  })

  test('new task error', () => {
    const spy = jest.spyOn(db, 'prepare')
    spy.mockImplementation(() => {
      throw new Error()
    })
    add(['test', 'add', '1'])
    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(2)
  })
})
