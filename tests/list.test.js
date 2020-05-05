const add = require('../src/cmds/add')
const list = require('../src/cmds/list')
const { cleanDb } = require('./helpers/util')

let clgOutput = []
const originalLog = () => {}
const mockedLog = (output) => clgOutput.push(output)

beforeEach(() => {
  cleanDb()
  clgOutput = []
  console.log = mockedLog
})

afterEach(() => (console.log = originalLog))

describe('List Command', () => {
  test('basic list', () => {
    add(['test', 'add', '1'])
    add(['test', 'add', '2'])
    list()
    expect(clgOutput.length).toEqual(3)
    expect(clgOutput[2]).toEqual(expect.stringContaining('test add 1'))
    expect(clgOutput[2]).toEqual(expect.stringContaining('test add 2'))
  })

  test('Nothing to output', () => {
    list()
    expect(clgOutput.length).toEqual(1)
    expect(clgOutput[0]).toEqual('No outstanding tasks found.')
  })
})
