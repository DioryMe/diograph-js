import { Diory, Diograph } from '../types'
import { DiographJson } from '../diograph'

const diory: Diory = {
  id: 'some-id',
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
    it('deletes single diory', () => {
      const returnValue = diographJson.deleteDiory(diory.id)
      expect(returnValue).toEqual([diory])

      expect(diographJson.get('some-id')).toEqual(undefined)
      expect(diographJson.get('some-other-id')).toEqual(diory2)
    })
  })

  describe('with dryRun enabled', () => {
    it("doesn't delete single diory", () => {
      const returnValue = diographJson.deleteDiory(diory.id, { dryRun: true })
      expect(returnValue).toEqual([diory])

      expect(diographJson.get('some-id')).toEqual(diory)
      expect(diographJson.get('some-other-id')).toEqual(diory2)
    })
  })
})
