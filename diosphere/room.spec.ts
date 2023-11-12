import { Room } from './room'

const roomJsonContents = JSON.stringify({
  connections: [
    {
      address: 'some-address',
      contentClientType: 'LocalClient',
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

class MockLocalClient {
  type = 'LocalClient'
  address = 'some-address'
  constructor() {}
  readTextItem = jest.fn()
  readItem = jest.fn()
  readToStream = jest.fn()
  verify = jest.fn()
  exists = jest.fn()
  writeTextItem = jest.fn()
  writeItem = jest.fn()
  deleteItem = jest.fn()
  deleteFolder = jest.fn()
  list = jest.fn()
}

describe('Room', () => {
  let room: Room

  beforeEach(async () => {
    const mockRoomClient: any = {
      readRoomJson: () => roomJsonContents,
      readDiograph: () => diographContents,
      client: () => {
        return new MockLocalClient()
      },
    }
    room = new Room(mockRoomClient)
    await room.loadRoom({ LocalClient: MockLocalClient })
  })

  it('builds from object', () => {
    const duplicateRoom = new Room()
    duplicateRoom.initiateRoom(
      { LocalClient: MockLocalClient },
      room.connections.map((c) => c.toObject()),
      room.diograph.toObject(),
    )
    expect(duplicateRoom.toObject()).toEqual(room.toObject())
    expect(duplicateRoom.diograph.toObject()).toEqual(room.diograph.toObject())
  })

  describe('loadRoom', () => {
    it('loads connections', async () => {
      expect(room.connections[0].contentUrls).toEqual({
        bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji:
          '/Generic content/some-video.mov',
      })
    })
  })

  describe('toObject', () => {
    it('includes connections', async () => {
      expect(room.toObject().connections[0].contentUrls).toEqual({
        bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji:
          '/Generic content/some-video.mov',
      })
    })
  })

  describe('getContent', () => {
    it('returns link', () => {
      const linkToContent = room.getContent(
        'bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji',
      )
      expect(linkToContent).toEqual('some-address/Generic content/some-video.mov')
    })
  })
})
