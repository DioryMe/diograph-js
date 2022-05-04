import { DioryObject, Diograph } from '../types'
import { DiographJson } from '../diograph'

const diory: DioryObject = {
  id: 'some-id',
  image: 'images/some-id.jpg',
  links: {
    'some-other-id': {
      id: 'some-other-id',
    },
  },
}

const diory2: DioryObject = {
  id: 'some-other-id',
}

const diory3: DioryObject = {
  id: 'some-else-id',
  links: {
    'some-id': {
      id: 'some-id',
    },
  },
}

describe('deleteDiory', () => {
  let diographJson: DiographJson

  beforeEach(() => {
    const diograph: Diograph = {
      'some-id': diory,
      'some-other-id': diory2,
      'some-else-id': diory3,
    }
    diographJson = new DiographJson('some-path/diograph.json')
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
