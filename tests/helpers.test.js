const db = require('../src/lib/db')
const { cleanDb } = require('./helpers/util')

const output = {
  error: [],
}
const mockedError = (info) => output.error.push(info)

beforeEach(() => {
  output.error = []
  console.error = mockedError
})

describe('Test Helpers', () => {
  test('cleanDB can throw errors', () => {
    const spy = jest.spyOn(db, 'prepare')
    spy.mockImplementation(() => {
      throw new Error()
    })
    cleanDb()
    expect(output.error.length).toEqual(2)
  })
})
