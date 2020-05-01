const add = require('../src/cmds/add')

describe('Add Command', () => {
  test('new task is returned', () => {
    const expected = { desc: 'test add 1' }
    const actual = add(['test', 'add', '1'])
    expect(expected).toEqual(actual)
  })
})
