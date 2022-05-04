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

describe('deleteDiory', () => {
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
    describe('lists and deletes', () => {
      it('single diory', async () => {
        const returnValue = await diograph.deleteDiory(diory.id)
        expect(returnValue).toEqual([diory])

        expect(diograph.getDiory('some-id')).toEqual(undefined)
        expect(diograph.getDiory('some-other-id')).toEqual(diory2)
      })

      it('diory and its linked diories', async () => {
        const returnValue = await diograph.deleteDiory(diory.id, { linkedDiories: true })
        expect(returnValue).toEqual([diory, diory2])

        expect(diograph.getDiory('some-id')).toEqual(undefined)
        expect(diograph.getDiory('some-other-id')).toEqual(undefined)
      })
    })
  })

  describe('with dryRun enabled', () => {
    describe("lists but doesn't delete", () => {
      it('single diory', async () => {
        const returnValue = await diograph.deleteDiory(diory.id, { dryRun: true })
        expect(returnValue).toEqual([diory])

        expect(diograph.getDiory('some-id')).toEqual(diory)
        expect(diograph.getDiory('some-other-id')).toEqual(diory2)
      })

      it('diory and its linked diories', async () => {
        const returnValue = await diograph.deleteDiory(diory.id, {
          dryRun: true,
          linkedDiories: true,
        })
        expect(returnValue).toEqual([diory, diory2])

        expect(diograph.getDiory('some-id')).toEqual(diory)
        expect(diograph.getDiory('some-other-id')).toEqual(diory2)
      })
    })
  })
})
