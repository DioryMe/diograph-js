import { DiographObject } from '../types'
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

describe('Diograph', () => {
  let diograph: Diograph

  beforeEach(async () => {
    diograph = new Diograph()
    diograph.mergeDiograph(JSON.parse(diographContents).diograph)
    expect(diograph.diories.length).toEqual(1)
  })

  describe('mergeDiograph', () => {
    it('adds diograph', async () => {
      const oneDioryDiograph = {
        'some-other-id': {
          id: 'some-other-id',
          text: 'some-other-diory',
        },
      }
      diograph.mergeDiograph(oneDioryDiograph)
      expect(diograph.diories.length).toEqual(2)
    })

    it("diograph doesn't change if two identical diographs are merged", async () => {
      const identicalDiographObject = JSON.parse(diographContents).diograph
      diograph.mergeDiograph(identicalDiographObject)
      expect(diograph.diories.length).toEqual(1)
      expect(diograph.toDiographObject()).toEqual(identicalDiographObject)
    })
  })

  describe('toDiographObject', () => {
    let diographObject: DiographObject
    beforeEach(() => {
      diographObject = diograph.toDiographObject()
    })
    it("doesn't include rootId", async () => {
      expect(diographObject.rootId).toBeUndefined()
    })
    it('includes diograph', async () => {
      expect(diographObject).toEqual({
        'some-id': {
          id: 'some-id',
          text: 'some-diory',
        },
      })
    })
  })

  describe('toJson', () => {
    let diographJson: string
    beforeEach(() => {
      diographJson = diograph.toJson()
    })
    it('includes rootId', async () => {
      expect(JSON.parse(diographJson).rootId).toEqual('some-id')
    })
    it('includes diograph', async () => {
      expect(JSON.parse(diographJson).diograph).toEqual({
        'some-id': {
          id: 'some-id',
          text: 'some-diory',
        },
      })
    })
  })
})
