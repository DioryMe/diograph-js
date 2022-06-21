import { DiographObject } from '../types'
import { Diograph } from './diograph'
import { Room } from './room'

const roomJsonContents = JSON.stringify({
  diographUrl: 'diograph.json',
  connections: [
    {
      address: 'some-address',
      contentClient: 'local',
      contentUrls: {
        bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji:
          '/Generic content/some-video.mov',
      },
      diograph: {
        'some-id': {
          id: 'some-id',
          text: 'some-diory',
        },
      },
    },
  ],
})

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
    const mockRoomClient: any = {
      loadRoom: () => roomJsonContents,
      readDiograph: () => diographContents,
    }
    const room = new Room(mockRoomClient)
    await room.loadRoom()
    diograph = room.diograph
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
