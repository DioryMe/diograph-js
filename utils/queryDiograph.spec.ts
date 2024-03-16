import { queryDiograph } from './queryDiograph'

describe('queryDiograph()', () => {
  describe('given text query', () => {
    it('returns diograph with matching text', () => {
      const result = queryDiograph(
        { text: 'some-text' },
        { 'some-id': { id: 'some-id', text: 'some-text' } },
      )

      expect(result).toStrictEqual({ 'some-id': { id: 'some-id', text: 'some-text' } })
    })

    it('does not return diograph with non-matching text', () => {
      const result = queryDiograph(
        { text: 'other-text' },
        { 'some-id': { id: 'some-id', text: 'some-text' } },
      )

      expect(result).toStrictEqual({})
    })
  })
})
