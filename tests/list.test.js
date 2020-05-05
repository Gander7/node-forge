const add = require('../src/cmds/add')
const list = require('../src/cmds/list')
const { cleanDb } = require('./helpers/util')
const Data = require('../src/data/db')

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

describe('List Command', () => {
  test('basic list', () => {
    add(['test', 'add', '1'])
    add(['test', 'add', '2'])
    list()
    expect(output.log.length).toEqual(3)
    expect(output.log[2]).toEqual(expect.stringContaining('test add 1'))
    expect(output.log[2]).toEqual(expect.stringContaining('test add 2'))
  })

  test('Nothing to output', () => {
    const db = new Data()
    const spy = jest.spyOn(db, 'getAll')
    spy.mockImplementation(() => [])

    list(db)

    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual('No outstanding tasks found.')
  })

  test('list tasks erro', () => {
    const db = new Data()
    const spy = jest.spyOn(db, 'getAll')
    spy.mockImplementation(() => {})

    list(db)

    expect(output.log.length).toEqual(0)
  })
})
