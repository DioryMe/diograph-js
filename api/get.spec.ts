import { DiographObject } from '../types'
import { Diory } from '../diory'
import { Diograph } from '../diograph'

const diory: Diory = new Diory({
  id: 'some-id',
  image: 'images/some-id.jpg',
  links: {
    'some-other-id': {
      id: 'some-other-id',
    },
  },
})

const diory2: Diory = new Diory({
  id: 'some-other-id',
})

const diory3: Diory = new Diory({
  id: 'some-else-id',
  links: {
    'some-id': {
      id: 'some-id',
    },
  },
})

describe('getDiory', () => {
  let diographJson: Diograph

  beforeEach(() => {
    const diograph: DiographObject = {
      'some-id': diory,
      'some-other-id': diory2,
      'some-else-id': diory3,
    }
    diographJson = new Diograph('some-path/diograph.json')
    diographJson.setDiograph(diograph)
  })

  describe('without options', () => {
    it('returns diory', () => {
      expect(diographJson.getDiory('some-id')).toEqual(diory)
    })
  })

  describe('with options', () => {
    it('returns array of diories', () => {
      expect(diographJson.getDioryWithLinks('some-id', { jee: 'joo' })).toEqual([diory])
    })

    describe('linkedDiories', () => {
      it('returns diory and its linked diories', () => {
        expect(diographJson.getDioryWithLinks('some-id', { linkedDiories: true })).toEqual([
          diory,
          diory2,
        ])
      })
    })

    describe('reverseLinkedDiories', () => {
      it('returns diory and its linked diories', () => {
        expect(diographJson.getDioryWithLinks('some-id', { reverseLinkedDiories: true })).toEqual([
          diory,
          diory3,
        ])
      })
    })

    describe('linkedDiories and reverseLinkedDiories', () => {
      it('returns diory and its linked diories', () => {
        expect(
          diographJson.getDioryWithLinks('some-id', {
            linkedDiories: true,
            reverseLinkedDiories: true,
          }),
        ).toEqual([diory, diory2, diory3])
      })
    })
  })
})
