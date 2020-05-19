const add = require('../src/cmds/add')
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

  test('new tasks with tags', () => {
    const db = new Data()

    add(['+tag1', 'test', 'add', '1'], db)
    add(['test', 'add', '2', '+tag1'], db)
    add(['test', '+tag1', 'add', '3'], db)
    add(['+tag2', 'test', 'add', '4'], db)
    add(['test', 'add', '5'], db)

    const tag1Tasks = db.getTasksByTag('tag1')
    const tag2Tasks = db.getTasksByTag('tag2')

    expect(tag1Tasks).toMatchObject([
      { rowid: 1, desc: 'test add 1' },
      { rowid: 2, desc: 'test add 2' },
      { rowid: 3, desc: 'test add 3' },
    ])
    expect(tag2Tasks).toMatchObject([{ rowid: 4, desc: 'test add 4' }])
  })

  test('new tasks with multiple tags', () => {
    const db = new Data()

    add(['+tag1', '+tag2', 'test', 'add', '1'], db)
    add(['test', 'add', '2', '+tag1'], db)

    const tag1Tasks = db.getTasksByTag('tag1')
    const tag2Tasks = db.getTasksByTag('tag2')

    expect(tag1Tasks).toMatchObject([
      { rowid: 1, desc: 'test add 1' },
      { rowid: 2, desc: 'test add 2' },
    ])
    expect(tag2Tasks).toMatchObject([{ rowid: 1, desc: 'test add 1' }])
  })
})
