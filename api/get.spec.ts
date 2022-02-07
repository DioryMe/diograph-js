import { Diory, Diograph } from '../types'
import { DiographJson } from '../diograph'

describe('get', () => {
  let diographJson: DiographJson
  const diory: Diory = {
    id: 'some-id',
    image: 'images/some-id.jpg',
  }

  beforeEach(() => {
    const diograph: Diograph = {
      'some-id': diory,
    }
    diographJson = new DiographJson({ path: 'some-path/diograph.json' })
    diographJson.setDiograph(diograph)
  })

  it('works', () => {
    expect(diographJson.get('some-id')).toEqual(diory)
  })
})
