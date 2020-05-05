const remove = require('../src/cmds/remove')
const add = require('../src/cmds/add')
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

describe('Delete Command', () => {
  // store and reset original output
  test('task is removed', () => {
    add(['test', 'add', '1'])
    remove(1)
    expect(output.log).toContainEqual(expect.stringContaining('Task 1 deleted.'))
  })

  test('test to remove not found with no tests', () => {
    remove(1)
    expect(output.log).toContainEqual(expect.stringContaining('Task not found.'))
  })

  test('test to remove not found with tests', () => {
    add(['test', 'add', '1'])
    remove(99)
    expect(output.log).toContainEqual(expect.stringContaining('Task not found.'))
  })

  test('remove task error', () => {
    const db = new Data()
    const spy = jest.spyOn(db, 'delete')
    spy.mockImplementation(() => undefined)

    remove(1, db)

    expect(output.log.length).toEqual(0)
  })
  // test('delete task error', () => {
  //   add(['test', 'add', '1'])
  //   const spy = jest.spyOn(db, 'prepare')
  //   spy.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   deleteTask(1)
  //   expect(output.log.length).toEqual(1) // One for the add
  //   expect(output.error.length).toEqual(2)
  // })
})
