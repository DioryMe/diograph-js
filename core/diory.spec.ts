import { Room } from './room'
import { Diory } from './diory'
import { DioryObject } from '../types'
import { Diograph } from './diograph'

const diographContents = JSON.stringify({
  rootId: 'some-id',
  diograph: {
    'some-id': {
      id: 'some-id',
      text: 'some-diory',
    },
  },
})

describe('Diory', () => {
  let diory: Diory

  beforeEach(async () => {
    const diograph = new Diograph()
    diograph.mergeDiograph(JSON.parse(diographContents).diograph)
    diory = diograph.diories[0]
  })

  it('builds from object', () => {
    const duplicateDiory = new Diory(diory.toObject())
    expect(duplicateDiory.toObject()).toEqual(diory.toObject())
  })

  describe('DioryAttributes', () => {
    it('access with dot notation', () => {
      expect(diory.text).toEqual('some-diory')
    })
  })

  describe('toObject', () => {
    let dioryObject: DioryObject
    beforeEach(() => {
      dioryObject = diory.toObject()
    })
    it('works', async () => {
      expect(dioryObject).toEqual({
        id: 'some-id',
        text: 'some-diory',
      })
    })
  })
})
