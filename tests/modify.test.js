const modify = require('../src/cmds/modify')
const add = require('../src/cmds/add')
const list = require('../src/cmds/list')
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

describe('Modify Command', () => {
  test('task desc is modified', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    list({}, db)
    modify(1, ['test', 'modify'], db)
    list({}, db)

    expect(output.log.length).toEqual(4)
    expect(output.log[2]).toEqual(expect.stringContaining('Task 1 updated.'))
    expect(output.log[3]).toEqual(expect.stringContaining('test modify'))
  })

  test('no mods provided', () => {
    modify(1, [])

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('null mods provided', () => {
    modify(1, null)

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('undefined mods provided', () => {
    modify(1, undefined)

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(1)
  })

  test('task not found', () => {
    modify(1, ['test', 'that', 'doesnt', 'exist'])
    expect(output.log.length).toEqual(1)
    expect(output.log[0]).toEqual(expect.stringContaining('Task not found.'))
  })

  test('db update error', () => {
    const db = new Data()
    jest.spyOn(db, 'updateTask').mockImplementation(() => undefined)
    modify(1, ['test', 'that', 'doesnt', 'exist'], db)
    expect(output.log.length).toEqual(0)
  })

  test('update tasks with tag', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    const tasksBefore = db.getTasksByTag('tag1')

    modify(1, ['+tag1'], db)

    const tasksAfter = db.getTasksByTag('tag1')
    const tagCount = db.getTags(1)

    expect(tagCount.length).toEqual(1)
    expect(tasksBefore.length).toEqual(0)
    expect(tasksAfter).toMatchObject([{ rowid: 1, desc: 'test add 1' }])
  })

  test('update tasks with duplicate tag', () => {
    const db = new Data()
    add(['+tag1', 'test', 'add', '1'], db)
    const tasksBefore = db.getTasksByTag('tag1')

    modify(1, ['+tag1'], db)

    const tasksAfter = db.getTasksByTag('tag1')
    const tagCount = db.getTags(1)

    expect(tagCount.length).toEqual(1)
    expect(tasksBefore.length).toEqual(1)
    expect(tasksAfter).toMatchObject([{ rowid: 1, desc: 'test add 1' }])
  })

  test('modify task with plus shouldnt add tag', () => {
    const db = new Data()

    add(['+tag1', 'test', 'add', '1'], db)
    modify(1, ['test', 'add', '1', '+', '2'], db)

    const tagTasks = db.getTasksByTag('tag1')
    const plusTags = db.getTasksByTag('+')
    const blankTags = db.getTasksByTag('')

    expect(tagTasks).toMatchObject([{ rowid: 1, desc: 'test add 1 + 2' }])
    expect(plusTags).toMatchObject([])
    expect(blankTags).toMatchObject([])
  })

  test('update task with minus to remove tag', () => {
    const db = new Data()
    add(['+tag1', '+tag2', 'test', 'add', '1'], db)
    const tag1Before = db.getTasksByTag('tag1')
    const tag2Before = db.getTasksByTag('tag2')
    const tagCountBefore = db.getTags(1)

    modify(1, ['-tag2'], db)

    const tag1After = db.getTasksByTag('tag1')
    const tag2After = db.getTasksByTag('tag2')
    const tagCountAfter = db.getTags(1)
    expect(tag1Before.length).toEqual(1)
    expect(tag2Before.length).toEqual(1)
    expect(tagCountBefore.length).toEqual(2)

    expect(tag1After.length).toEqual(1)
    expect(tag2After.length).toEqual(0)
    expect(tagCountAfter.length).toEqual(1)
  })

  test('project can be changed', () => {
    const db = new Data()

    add(['project:project1', 'test', 'add', '1'], db)
    modify(1, ['project:project', 'test', 'add', '1', 'modified'], db)
    const projectTasks = db.getTasksByProject('project')
    const project1Tasks = db.getTasksByProject('project1')

    expect(project1Tasks.length).toBe(0)
    expect(projectTasks.length).toBe(1)
  })

  test('project can be removed', () => {
    const db = new Data()

    add(['project:project1', 'test', 'add', '1'], db)
    modify(1, ['project:', 'test', 'add', '1', 'modified'], db)
    const project1Tasks = db.getTasksByProject('project1')

    expect(project1Tasks.length).toBe(0)
  })
})
