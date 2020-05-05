const deleteTask = require('../src/cmds/delete')
const add = require('../src/cmds/add')
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

describe('Delete Command', () => {
  // store and reset original output
  test('task is deleted', () => {
    add(['test', 'add', '1'])
    deleteTask(1)
    expect(output.log).toContainEqual(expect.stringContaining('Task 1 deleted.'))
  })

  test('test to delete not found with no tests', () => {
    deleteTask(1)
    expect(output.log).toContainEqual(expect.stringContaining('Task not found.'))
  })

  test('test to delete not found with tests', () => {
    add(['test', 'add', '1'])
    deleteTask(99)
    expect(output.log).toContainEqual(expect.stringContaining('Task not found.'))
  })

  test('delete task error', () => {
    add(['test', 'add', '1'])
    const spy = jest.spyOn(db, 'prepare')
    spy.mockImplementation(() => {
      throw new Error()
    })
    deleteTask(1)
    expect(output.log.length).toEqual(1) // One for the add
    expect(output.error.length).toEqual(2)
  })
})
