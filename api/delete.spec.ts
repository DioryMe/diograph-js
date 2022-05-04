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

describe('deleteDiory', () => {
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
    describe('lists and deletes', () => {
      it('single diory', async () => {
        const returnValue = await diographJson.deleteDiory(diory.id)
        expect(returnValue).toEqual([diory])

        expect(diographJson.getDiory('some-id')).toEqual(undefined)
        expect(diographJson.getDiory('some-other-id')).toEqual(diory2)
      })

      it('diory and its linked diories', async () => {
        const returnValue = await diographJson.deleteDiory(diory.id, { linkedDiories: true })
        expect(returnValue).toEqual([diory, diory2])

        expect(diographJson.getDiory('some-id')).toEqual(undefined)
        expect(diographJson.getDiory('some-other-id')).toEqual(undefined)
      })
    })
  })

  describe('with dryRun enabled', () => {
    describe("lists but doesn't delete", () => {
      it('single diory', async () => {
        const returnValue = await diographJson.deleteDiory(diory.id, { dryRun: true })
        expect(returnValue).toEqual([diory])

        expect(diographJson.getDiory('some-id')).toEqual(diory)
        expect(diographJson.getDiory('some-other-id')).toEqual(diory2)
      })

      it('diory and its linked diories', async () => {
        const returnValue = await diographJson.deleteDiory(diory.id, {
          dryRun: true,
          linkedDiories: true,
        })
        expect(returnValue).toEqual([diory, diory2])

        expect(diographJson.getDiory('some-id')).toEqual(diory)
        expect(diographJson.getDiory('some-other-id')).toEqual(diory2)
      })
    })
  })
})
