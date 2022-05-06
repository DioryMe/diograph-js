import { Diograph } from '../diograph'

describe('update', () => {
  let diograph: Diograph

  beforeEach(() => {
    diograph = new Diograph('some-path/diograph.json')
    diograph.setDiograph({
      'some-id': {
        id: 'some-id',
        text: 'some-text',
        image: 'images/some-id.jpg',
      },
    })
    expect(diograph.getDiory('some-id').text).toEqual('some-text')
  })

  it('works', () => {
    diograph.update('some-id', { text: 'updated-text' })
    const updatedDiory = diograph.getDiory('some-id')
    expect(updatedDiory.text).toEqual('updated-text')
    expect(updatedDiory.image).toEqual('images/some-id.jpg')
  })

  // TODO: Spec for "Check that only valid keys are given"
  // => raises error
})
