const add = require('../src/cmds/add')
const { cleanDb } = require('./helpers/util')

beforeEach(() => {
  cleanDb()
})

describe('Add Command', () => {
  // store and reset original output
  const originalLog = () => {}
  afterEach(() => (console.log = originalLog))

  let clgOutput = []
  const mockedLog = (output) => clgOutput.push(output)
  beforeEach(() => (console.log = mockedLog))

  test('new task is returned', () => {
    add(['test', 'add', '1'])
    expect(clgOutput).toContainEqual(expect.stringContaining('Task 1 inserted.'))
  })
})
