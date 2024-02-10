import { IDioryObject } from '../types'
import { allKeysExist, allMatchToQuery } from './utils'

describe('allKeysExist()', () => {
  describe('given text query', () => {
    let allKeysExistWithTextQuery: (dioryObject: IDioryObject) => boolean
    beforeEach(() => {
      const query = { text: 'some-text' }
      allKeysExistWithTextQuery = allKeysExist(query)
    })

    it('returns true with text prop', () => {
      const diory = { id: 'some-id', text: 'other-text' }
      const result = allKeysExistWithTextQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false without text prop', () => {
      const diory = { id: 'some-id' }
      const result = allKeysExistWithTextQuery(diory)

      expect(result).toBe(false)
    })
  })
})
describe('allMatchToQuery()', () => {
  describe('given query with id and text', () => {
    let allMatchToQueryWithTextQuery: (dioryObject: IDioryObject) => boolean
    beforeEach(() => {
      const query = { id: 'some-id', text: 'some-text' }
      allMatchToQueryWithTextQuery = allMatchToQuery(query)
    })

    it('returns true if id and text matches', () => {
      const diory = { id: 'some-id', text: 'some-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false if only text matches', () => {
      const diory = { id: 'other-id', text: 'some-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(false)
    })
  })

  describe('given query with text only', () => {
    let allMatchToQueryWithTextQuery: (dioryObject: IDioryObject) => boolean
    beforeEach(() => {
      const query = { text: 'some-text' }
      allMatchToQueryWithTextQuery = allMatchToQuery(query)
    })

    it('returns true if text matches', () => {
      const diory = { id: 'some-id', text: 'some-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(true)
    })

    it("returns false if text doesn't match", () => {
      const diory = { id: 'some-id', text: 'other-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(false)
    })
  })
})
