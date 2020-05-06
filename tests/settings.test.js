describe('Settings', () => {
  test('regular settings', () => {
    const { dbName, dbPath } = require('../src/lib/settings')({ mockLive: true })

    expect(dbName).not.toBe(':memory:')
    expect(dbPath).not.toBe('')
  })
  test('testing settings', () => {
    const { dbName } = require('../src/lib/settings')()

    expect(dbName).toBe(':memory:')
  })
})
