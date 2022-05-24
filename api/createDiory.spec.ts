import { Diory } from '../diory'
import { DioryObject } from '../types'
import { createDiory } from './createDiory'

const dioryObject: DioryObject = {
  id: 'some-id',
  image: 'images/some-id.jpg',
  links: {
    'some-other-id': {
      id: 'some-other-id',
    },
  },
}
const diory = new Diory(dioryObject)

describe('createDiory', () => {
  it('creates diory with new id', () => {
    const createdDiory = createDiory({ text: 'I want some-id' })
    expect(createdDiory.text).toEqual('I want some-id')
    expect(createdDiory.id).toBeDefined()
  })

  it('creates diory with given id', () => {
    const dioryObject = diory.toDioryObject()
    delete dioryObject.id
    delete dioryObject.links
    const createdDiory = createDiory(dioryObject, diory.id, diory.links)
    expect(createdDiory.toDioryObject()).toEqual(diory.toDioryObject())
  })
})
