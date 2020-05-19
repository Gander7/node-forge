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

describe('Add Command', () => {
  test('new task is returned', () => {
    const db = new Data()

    add(['test', 'add', '1'], db)
    const task = db.getOne(1)

    expect(task).not.toBeNull()
    expect(task.desc).toEqual('test add 1')
  })

  test('new task error', () => {
    const db = new Data()
    jest.spyOn(db, 'insert').mockImplementation(() => {})

    add(['test', 'add', '1'], db)

    expect(output.log.length).toEqual(0)
  })

  test('new task with tag at start', () => {
    const db = new Data()

    add(['+tag1', 'test', 'add', '1'], db)
    const tasks = db.getTasksByTag('tag1')

    expect(tasks).toMatchObject([
      {
        rowid: 1,
        desc: 'test add 1',
      },
    ])
  })
})
