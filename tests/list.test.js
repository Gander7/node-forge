const add = require('../src/cmds/add')
const list = require('../src/cmds/list')
const { cleanDb } = require('./helpers/util')

beforeEach(() => {
  cleanDb()
  add(['test', 'add', '1'])
  add(['test', 'add', '2'])
  clgOutput = []
})

describe('List Command', () => {
  // store and reset original output
  const originalLog = () => {}
  afterEach(() => (console.log = originalLog))

  let clgOutput = []
  const mockedLog = (output) => clgOutput.push(output)
  beforeEach(() => (console.log = mockedLog))

  test('list', () => {
    list()
    expect(clgOutput.length).toEqual(1)
    expect(clgOutput[0]).toEqual(expect.stringContaining('test add 1'))
    expect(clgOutput[0]).toEqual(expect.stringContaining('test add 2'))
  })
})
