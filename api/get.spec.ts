import { Diory, Diograph } from '../types'
import { DiographJson } from '../diograph'

const diory: Diory = {
  id: 'some-id',
  image: 'images/some-id.jpg',
  links: {
    'some-other-id': {
      id: 'some-other-id',
    },
  },
}

const diory2: Diory = {
  id: 'some-other-id',
}

describe('getDiory', () => {
  let diographJson: DiographJson

  beforeEach(() => {
    const diograph: Diograph = {
      'some-id': diory,
      'some-other-id': diory2,
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

    describe('linkedDiories', () => {
      it('returns diory and its linked diories', () => {
        expect(diographJson.get('some-id', { linkedDiories: true })).toEqual([diory, diory2])
      })
    })
  })
})
