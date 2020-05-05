const add = require('../src/cmds/add')
const list = require('../src/cmds/list')
const db = require('../src/lib/db')
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
    list()
    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual('No outstanding tasks found.')
  })

  test('list tasks error', () => {
    const spy = jest.spyOn(db, 'prepare')
    spy.mockImplementation(() => {
      throw new Error()
    })
    list()
    expect(output.error.length).toEqual(2)
  })
})
