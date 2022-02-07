import { Diograph } from '../types'
import { DiographJson } from '../diograph'

describe('update', () => {
  let diographJson: DiographJson

  beforeEach(() => {
    const diograph: Diograph = {
      'some-id': {
        id: 'some-id',
        text: 'some-text',
        image: 'images/some-id.jpg',
      },
    }
    diographJson = new DiographJson({ path: 'some-path/diograph.json' })
    diographJson.setDiograph(diograph)
    expect(diographJson.get('some-id').text).toEqual('some-text')
  })

  it('works', () => {
    diographJson.update('some-id', { text: 'updated-text' })
    const updatedDiory = diographJson.get('some-id')
    expect(updatedDiory.text).toEqual('updated-text')
    expect(updatedDiory.image).toEqual('images/some-id.jpg')
  })

  // TODO: Spec for "Check that only valid keys are given"
  // => raises error
})
