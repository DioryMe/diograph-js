import { Room } from './room'
import { Connection } from './connection'
import { ConnectionObject } from '../types'

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

describe('Connection', () => {
  let connection: Connection

  beforeEach(async () => {
    const mockRoomClient: any = {
      loadRoom: () => roomJsonContents,
      readDiograph: () => diographContents,
    }
    const room = new Room(mockRoomClient)
    await room.loadRoom()
    connection = room.connections[0]
  })

  describe('toConnectionObject', () => {
    let connectionObject: ConnectionObject
    beforeEach(() => {
      connectionObject = connection.toConnectionObject()
    })
    it('includes contentUrls', async () => {
      expect(connectionObject.contentUrls).toEqual({
        bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji:
          '/Generic content/some-video.mov',
      })
    })
    it('includes diograph', async () => {
      expect(connectionObject.diograph).toEqual({
        'some-id': {
          id: 'some-id',
          text: 'some-diory',
        },
      })
    })
    it('includes contentClient', async () => {
      expect(connectionObject.contentClient).toEqual('local')
    })
  })
})
