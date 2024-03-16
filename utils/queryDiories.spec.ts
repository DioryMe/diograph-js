import { queryDiories } from './queryDiories'

describe('queryDiories()', () => {
  describe('given text query', () => {
    it('returns diories with matching text', () => {
      const result = queryDiories(
        { text: 'some-text' },
        { 'some-id': { id: 'some-id', text: 'some-text' } },
      )

      expect(result).toStrictEqual({ 'some-id': { id: 'some-id', text: 'some-text' } })
    })

    it('does not return diories with non-matching text', () => {
      const result = queryDiories(
        { text: 'other-text' },
        { 'some-id': { id: 'some-id', text: 'some-text' } },
      )

      expect(result).toStrictEqual({})
    })
  })
})
