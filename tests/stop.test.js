const add = require('../src/cmds/add')
const start = require('../src/cmds/start')
const stop = require('../src/cmds/stop')
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

describe('Stop Command', () => {
  test('task is stopped', () => {
    const db = new Data()
    add(['test', 'add', '1'], db)
    start(1, db)
    stop(1, db)
    const log = db.getTimeLogByTask(1)

    expect(output.log.length).toEqual(3)
    expect(output.log[2]).toEqual(expect.stringContaining('Task 1 stopped.'))
    expect(log.length).toEqual(1)
    expect(log[0].startTime).not.toBeNull()
    expect(log[0].endTime).not.toBeNull()
    expect(log[0].endTime).toEqual(expect.stringContaining('Z'))
    expect(new Date(log[0].startTime).getTime()).toBeLessThanOrEqual(
      new Date(log[0].endTime).getTime(),
    )
  })

  test('stop fails', () => {
    const db = new Data()
    jest.spyOn(db, 'stopTask').mockImplementation(() => undefined)

    stop(1, db)
    expect(output.log.length).toEqual(0)
  })
})
