const cmd = require('../src/cmds/version')
const { version } = require('../package.json')

describe('Version Command', () => {
  // store and reset original output
  const originalLog = () => {}
  afterEach(() => (console.log = originalLog))

  // mock output
  let clgOutput = []
  const mockedLog = (output) => clgOutput.push(output)
  beforeEach(() => (console.log = mockedLog))

  test(`version output contains number from package`, () => {
    cmd()
    expect(clgOutput[0]).toEqual(expect.stringContaining(version))
  })
})
