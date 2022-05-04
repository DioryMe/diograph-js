import { Diory } from '../diory'
import { Diograph } from '../diograph'

const diory = new Diory({
  id: 'some-id',
  image: 'images/some-id.jpg',
  links: {
    'some-other-id': {
      id: 'some-other-id',
    },
  },
})

const diory2 = new Diory({
  id: 'some-other-id',
})

const diory3 = new Diory({
  id: 'some-else-id',
  links: {
    'some-id': {
      id: 'some-id',
    },
  },
})

describe('getDiory', () => {
  let diograph: Diograph

  beforeEach(() => {
    diograph = new Diograph('some-path/diograph.json')
    diograph.setDiograph({
      'some-id': diory,
      'some-other-id': diory2,
      'some-else-id': diory3,
    })
  })

  describe('without options', () => {
    it('returns diory', () => {
      expect(diograph.getDiory('some-id')).toMatchObject(diory)
    })
  })

  describe('with options', () => {
    it('returns array of diories', () => {
      expect(diograph.getDioryWithLinks('some-id', { jee: 'joo' })).toMatchObject([diory])
    })

    describe('linkedDiories', () => {
      it('returns diory and its linked diories', () => {
        expect(diograph.getDioryWithLinks('some-id', { linkedDiories: true })).toMatchObject([
          diory,
          diory2,
        ])
      })
    })

    describe('reverseLinkedDiories', () => {
      it('returns diory and its linked diories', () => {
        expect(diograph.getDioryWithLinks('some-id', { reverseLinkedDiories: true })).toEqual([
          diory,
          diory3,
        ])
      })
    })

    describe('linkedDiories and reverseLinkedDiories', () => {
      it('returns diory and its linked diories', () => {
        expect(
          diograph.getDioryWithLinks('some-id', {
            linkedDiories: true,
            reverseLinkedDiories: true,
          }),
        ).toEqual([diory, diory2, diory3])
      })
    })
  })
})
