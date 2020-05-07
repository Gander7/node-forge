const add = require('../src/cmds/add')
const view = require('../src/cmds/view')
const Data = require('../src/data/db')

const output = {
  log: [],
  error: [],
}

const mockedLog = (info) => output.log.push(info)
const mockedError = (info) => output.error.push(info)

beforeEach(() => {
  output.log = []
  output.error = []
  console.log = mockedLog
  console.error = mockedError
})

describe('View Command', () => {
  test('view task', () => {
    const db = new Data()
    add(['test', 'add', '5'], db)
    view({ id: 1 }, db)
    expect(output.log.length).toEqual(2)
    expect(output.log[1]).toEqual(expect.stringContaining('1'))
    expect(output.log[1]).toEqual(expect.stringContaining('test add 5'))
    expect(output.log[1]).toEqual(expect.not.stringContaining('undefined'))
  })

  test('task not found', () => {
    view({ id: 1 })
    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual('Task not found.')
  })
})
