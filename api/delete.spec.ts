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

describe('deleteDiory', () => {
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
    describe('lists and deletes', () => {
      it('single diory', () => {
        const returnValue = diographJson.deleteDiory(diory.id)
        expect(returnValue).toEqual([diory])

        expect(diographJson.get('some-id')).toEqual(undefined)
        expect(diographJson.get('some-other-id')).toEqual(diory2)
      })

      it('diory and its linked diories', () => {
        const returnValue = diographJson.deleteDiory(diory.id, { linkedDiories: true })
        expect(returnValue).toEqual([diory, diory2])

        expect(diographJson.get('some-id')).toEqual(undefined)
        expect(diographJson.get('some-other-id')).toEqual(undefined)
      })
    })
  })

  describe('with dryRun enabled', () => {
    describe("lists but doesn't delete", () => {
      it('single diory', () => {
        const returnValue = diographJson.deleteDiory(diory.id, { dryRun: true })
        expect(returnValue).toEqual([diory])

        expect(diographJson.get('some-id')).toEqual(diory)
        expect(diographJson.get('some-other-id')).toEqual(diory2)
      })

      it('diory and its linked diories', () => {
        const returnValue = diographJson.deleteDiory(diory.id, {
          dryRun: true,
          linkedDiories: true,
        })
        expect(returnValue).toEqual([diory, diory2])

        expect(diographJson.get('some-id')).toEqual(diory)
        expect(diographJson.get('some-other-id')).toEqual(diory2)
      })
    })
  })
})
