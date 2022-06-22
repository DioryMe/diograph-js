import { Room } from './room'
import { ConnectionObject, RoomObject } from '../types'
import { Connection } from './connection'

const roomObject: RoomObject = {
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
}

describe('Connection', () => {
  let connection: Connection

  beforeEach(async () => {
    const room = new Room()
    room.initiateRoom(roomObject)
    connection = room.connections[0]
  })

  describe('toObject', () => {
    let connectionObject: ConnectionObject
    beforeEach(() => {
      connectionObject = connection.toObject()
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
