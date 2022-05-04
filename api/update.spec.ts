import { DiographObject } from '../types'
import { Diograph } from '../diograph'

describe('update', () => {
  let diographJson: Diograph

  beforeEach(() => {
    const diograph: DiographObject = {
      'some-id': {
        id: 'some-id',
        text: 'some-text',
        image: 'images/some-id.jpg',
      },
    }
    diographJson = new Diograph('some-path/diograph.json')
    diographJson.setDiograph(diograph)
    expect(diographJson.getDiory('some-id').text).toEqual('some-text')
  })

  it('works', () => {
    diographJson.update('some-id', { text: 'updated-text' })
    const updatedDiory = diographJson.getDiory('some-id')
    expect(updatedDiory.text).toEqual('updated-text')
    expect(updatedDiory.image).toEqual('images/some-id.jpg')
  })

  // TODO: Spec for "Check that only valid keys are given"
  // => raises error
})
