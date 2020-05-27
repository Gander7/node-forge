const add = require('../src/cmds/add')
const start = require('../src/cmds/start')
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

describe('Start Command', () => {
  test('task is started', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    start(1, db)
    const log = db.getTimeLogByTask(1)

    expect(output.log.length).toEqual(2)
    expect(output.log[1]).toEqual(expect.stringContaining('Task 1 started.'))
    expect(log.length).toEqual(1)
    expect(log[0].startTime).not.toBeNull()
    expect(log[0].endTime).toBeNull()
  })

  test('start fails', () => {
    const db = new Data()
    jest.spyOn(db, 'startTask').mockImplementation(() => undefined)

    start(1, db)
    expect(output.log.length).toEqual(0)
  })
})
