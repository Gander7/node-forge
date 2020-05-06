const fs = require('fs')
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
  })

  test("directory is created if it doesn't exist", () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false)
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})

    new Data(new Database(':memory:'), fs, true)

    expect(output.log.length).toEqual(2)
    expect(output.log).toContainEqual(expect.stringContaining('WARNING'))
    expect(output.log).toContainEqual(expect.stringContaining('database initialized'))
  })
})
