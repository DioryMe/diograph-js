import { Diory } from '../core/diory'
import { Diograph } from '../core/diograph'

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
    diograph.mergeDiograph({
      'some-id': diory,
      'some-other-id': diory2,
      'some-else-id': diory3,
    })
  })

  describe('without options', () => {
    describe('lists and deletes', () => {
      it('single diory', async () => {
        const returnValue = await diograph.deleteDiory(diory.id)
        const returnValueIds = returnValue.map((diory) => diory.id)
        expect(returnValueIds).toEqual([diory.id])

        expect(() => diograph.getDiory('some-id')).toThrowError()
        expect(diograph.getDiory('some-other-id').id).toEqual(diory2.id)
      })

      it('diory and its linked diories', async () => {
        const returnValue = await diograph.deleteDiory(diory.id, { linkedDiories: true })
        const returnValueIds = returnValue.map((diory) => diory.id)
        expect(returnValueIds).toEqual([diory.id, diory2.id])

        expect(() => diograph.getDiory('some-id')).toThrowError()
        expect(() => diograph.getDiory('some-other-id')).toThrowError()
      })
    })
  })

  describe('with dryRun enabled', () => {
    describe("lists but doesn't delete", () => {
      it('single diory', async () => {
        const returnValue = await diograph.deleteDiory(diory.id, { dryRun: true })
        const returnValueIds = returnValue.map((diory) => diory.id)
        expect(returnValueIds).toEqual([diory.id])

        expect(diograph.getDiory('some-id').id).toEqual(diory.id)
        expect(diograph.getDiory('some-other-id').id).toEqual(diory2.id)
      })

      it('diory and its linked diories', async () => {
        const returnValue = await diograph.deleteDiory(diory.id, {
          dryRun: true,
          linkedDiories: true,
        })
        const returnValueIds = returnValue.map((diory) => diory.id)
        expect(returnValueIds).toEqual([diory.id, diory2.id])

        expect(diograph.getDiory('some-id').id).toEqual(diory.id)
        expect(diograph.getDiory('some-other-id').id).toEqual(diory2.id)
      })
    })
  })
})
