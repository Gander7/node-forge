const add = require('../src/cmds/add')
const done = require('../src/cmds/done')
const list = require('../src/cmds/list')
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

describe('Done Command', () => {
  test('task is archived', () => {
    add(['test', 'add', '1'])
    done(1)

    expect(output.log.length).toEqual(2)
    expect(output.log).toContainEqual(expect.stringContaining('Task 1 archived'))

    output.log = []
    list()
    expect(output.log[0]).toEqual(expect.not.stringContaining('test add 1'))
  })

  // test("task to mark as done does't exist", () => {
  //   add(['test', 'add', '1'])
  //   done(1)

  //   expect(output.log.length).toEqual(1)
  //   expect(output.log).toContainEqual(expect.stringContaining('Task not found.'))
  // })

  // test('new task error', () => {
  //   const db = new Data()
  //   add(['test', 'add', '1'], db)

  //   jest.spyOn(db, 'delete').mockImplementation(() => {})
  //   jest.spyOn(db, 'insert').mockImplementation(() => {})

  //   expect(output.log.length).toEqual(0)
  // })
})
