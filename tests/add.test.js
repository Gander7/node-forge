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

  test('new task with numbers', () => {
    // minimist returns datatypes as it determines
    const db = new Data()

    add(['test', 'add', 1], db)
    const task = db.getOne(1)

    expect(task).not.toBeNull()
    expect(task.desc).toEqual('test add 1')
  })

  test('new task with boolean', () => {
    // minimist returns datatypes as it determines
    const db = new Data()

    add(['test', 'add', true], db)
    const task = db.getOne(1)

    expect(task).not.toBeNull()
    expect(task.desc).toEqual('test add true')
  })

  test('no task provided', () => {
    add([])

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('null task provided', () => {
    add(null)

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('undefined task provided', () => {
    add(undefined)

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('empty task provided', () => {
    add()

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('new task db error', () => {
    const db = new Data()
    jest.spyOn(db, 'insert').mockImplementation(() => {})

    add(['test', 'add', '1'], db)

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('new task with only tags should fail', () => {
    add(['+tag1', '+tag2'])

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
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

  test('new tasks with plus shouldnt add tag', () => {
    const db = new Data()

    add(['+tag1', 'test', 'add', '1', '+', '2'], db)

    const tagTasks = db.getTasksByTag('tag1')
    const plusTags = db.getTasksByTag('+')
    const blankTags = db.getTasksByTag('')

    expect(tagTasks).toMatchObject([{ rowid: 1, desc: 'test add 1 + 2' }])
    expect(plusTags).toMatchObject([])
    expect(blankTags).toMatchObject([])
  })

  test('new task with project', () => {
    const db = new Data()

    add(['prj:project1', 'test', 'add', '1'], db)
    add(['test', 'add', '2', 'prj:project1'], db)
    add(['test', 'add', '5'], db)
    add(['project:project1', 'test', 'add', '3'], db)
    add(['test', 'add', '6'], db)
    add(['test', 'add', '4', 'project:project1'], db)

    const project1Tasks = db.getTasksByProject('project1')

    expect(project1Tasks.length).toBe(4)
  })

  test('new task with multiple projects should only grab first one', () => {
    const db = new Data()

    add(['prj:project1', 'test', 'add', '1', 'project:project3'], db)

    const project1Tasks = db.getTasksByProject('project1')
    const project3Tasks = db.getTasksByProject('project3')

    expect(project1Tasks.length).toBe(1)
    expect(project3Tasks.length).toBe(0)
  })

  test('new task with empty project', () => {
    const db = new Data()

    add(['project:', 'test', 'add', '1'], db)

    const projectTasks = db.getTasksByTag('')

    expect(projectTasks.length).toBe(0)
  })
})
