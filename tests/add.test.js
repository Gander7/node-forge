const add = require('../src/cmds/add')
const Data = require('../src/data/db')
const { cleanDb } = require('./helpers/util')

const output = {
  log: [],
  error: [],
}

const mockedLog = (info) => output.log.push(info)
const mockedError = (info) => output.error.push(info)

beforeEach(() => {
  cleanDb()
  output.log = []
  output.error = []
  console.log = mockedLog
  console.error = mockedError
})

describe('Add Command', () => {
  test('new task is returned', () => {
    add(['test', 'add', '1'])

    expect(output.log.length).toEqual(1)
    expect(output.log).toContainEqual(expect.stringContaining('Task 1 inserted.'))
  })

  test('new task error', () => {
    const db = new Data()
    const spy = jest.spyOn(db, 'insert')
    spy.mockImplementation(() => {})

    add(['test', 'add', '1'], db)

    expect(output.log.length).toEqual(0)
  })
})
