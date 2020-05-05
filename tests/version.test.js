const cmd = require('../src/cmds/version')
const { version } = require('../package.json')

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

describe('Version Command', () => {
  test(`version output contains number from package`, () => {
    cmd()
    expect(output.log).toContainEqual(expect.stringContaining(version))
  })
})
