import { Diory, Diograph } from '../types'
import { DiographJson } from '../diograph'

describe('deleteDiory', () => {
  const diory: Diory = {
    id: 'some-id',
  }

  const diory2: Diory = {
    id: 'some-other-id',
  }

  describe('delete', () => {
    let diographJson: DiographJson

    beforeEach(() => {
      const diograph: Diograph = {
        'some-id': diory,
        'some-other-id': diory2,
      }
      diographJson = new DiographJson({ path: 'some-path/diograph.json' })
      diographJson.setDiograph(diograph)
    })

    it('works', () => {
      const returnValue = diographJson.deleteDiory('some-id')
      expect(returnValue).toEqual(true)

      expect(diographJson.get('some-id')).toEqual(undefined)
      expect(diographJson.get('some-other-id')).toEqual(diory2)
      expect(diographJson.diograph['some-id']).toEqual(undefined)
      expect(diographJson.diograph['some-other-id']).toEqual(diory2)
    })
  })
})
