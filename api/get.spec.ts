import { Diory, Diograph } from '../types'
import { DiographJson } from '../diograph'

const diory: Diory = {
  id: 'some-id',
  image: 'images/some-id.jpg',
}

describe('getDiory', () => {
  let diographJson: DiographJson

  beforeEach(() => {
    const diograph: Diograph = {
      'some-id': diory,
    }
    diographJson = new DiographJson({ path: 'some-path/diograph.json' })
    diographJson.setDiograph(diograph)
  })

  describe('without options', () => {
    it('returns diory', () => {
      expect(diographJson.get('some-id')).toEqual(diory)
    })
  })

  describe('with options', () => {
    it('returns array of diories', () => {
      expect(diographJson.get('some-id', { jee: 'joo' })).toEqual([diory])
    })
  })
})
