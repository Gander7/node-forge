const fs = require('fs')
const add = require('../src/cmds/add')
const Data = require('../src/data/db')
const Database = require('better-sqlite3')

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

describe('DB', () => {
  test('schema executes on empty database', () => {
    const sqlite = new Database(':memory:')

    jest.spyOn(sqlite, 'prepare').mockImplementation(() => {
      return {
        get: () => undefined,
      }
    })
    jest.spyOn(sqlite, 'exec').mockImplementation(() => {})

    new Data(sqlite, undefined, true)

    expect(output.log.length).toEqual(2)
    expect(output.log).toContainEqual(expect.stringContaining('WARNING'))
    expect(output.log).toContainEqual(expect.stringContaining('database initialized'))

    jest.clearAllMocks()
  })

  test("directory is created if it doesn't exist", () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false)
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
    const { dbPath } = require('../src/lib/settings')()
    Data.prototype.getPath = jest.fn().mockImplementation(() => {
      return {
        dbName: '',
        dbPath: '',
        dbFullPath: `${dbPath}/test.db`,
      }
    })

    new Data(new Database(), fs, true)

    expect(output.log.length).toEqual(2)
    expect(output.log).toContainEqual(expect.stringContaining('WARNING'))
    expect(output.log).toContainEqual(expect.stringContaining('database initialized'))

    jest.clearAllMocks()
  })

  test('directory is not created if it does exist', () => {
    const { dbPath, dbName } = require('../src/lib/settings')({ mockLive: true })
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true)
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
    Data.prototype.getPath = jest.fn().mockImplementation(() => {
      return {
        dbName: '',
        dbPath: '',
        dbFullPath: `${dbPath}/${dbName}`,
      }
    })

    new Data(undefined, undefined, true)

    expect(output.log.length).toEqual(0)

    jest.clearAllMocks()
  })

  test('no message when database is already initialized', () => {
    const db = new Database(':memory:')
    jest.spyOn(db, 'prepare').mockImplementation(() => {
      return {
        get: () => 'this is a value that is defined',
      }
    })

    new Data(db)

    expect(output.log.length).toEqual(0)
    expect(output.error.length).toEqual(0)
  })

  test('creation messages output only when database created', () => {
    const db = new Data(new Database(':memory:'), undefined, true)

    add(['test 1'], db)
    add(['test 2'], db)

    expect(output.log.length).toEqual(4)
  })
})
