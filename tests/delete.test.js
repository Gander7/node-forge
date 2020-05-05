const deleteTask = require('../src/cmds/delete')
const add = require('../src/cmds/add')
const { cleanDb } = require('./helpers/util')

beforeEach(() => {
  cleanDb()
})

describe('Delete Command', () => {
  // store and reset original output
  const originalLog = () => {}
  afterEach(() => (console.log = originalLog))

  let clgOutput = []
  const mockedLog = (output) => clgOutput.push(output)
  beforeEach(() => (console.log = mockedLog))

  test('task is deleted', () => {
    add(['test', 'add', '1'])
    deleteTask(1)
    expect(clgOutput).toContainEqual(expect.stringContaining('Task 1 deleted.'))
  })

  test('test to delete not found with no tests', () => {
    deleteTask(1)
    expect(clgOutput).toContainEqual(expect.stringContaining('Task not found.'))
  })

  test('test to delete not found with tests', () => {
    add(['test', 'add', '1'])
    deleteTask(99)
    expect(clgOutput).toContainEqual(expect.stringContaining('Task not found.'))
  })
})
