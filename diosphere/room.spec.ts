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
        '/Generic content/some-video.mov': {
          id: '/Generic content/some-video.mov',
          text: 'some-video.mov',
          image: 'data:image/jpeg;base64,9k=',
          date: '2019-05-23T16:56:02.000000Z',
          created: '2022-06-01T07:30:07.991Z',
          modified: '2022-06-01T07:30:08.003Z',
          data: [
            {
              '@context': 'https://schema.org',
              '@type': 'VideoObject',
              contentUrl: 'bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji',
              cid: 'bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji',
              duration: '00:00:31.32',
              encodingFormat: '',
            },
          ],
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
  readItem = async (path: string) => {
    return Buffer.from(path)
  }
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

  describe('readContent', () => {
    it('finds content from first connection', async () => {
      const someMovCID = 'bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji'
      const result = await room.readContent(someMovCID)
      expect(result).toEqual(Buffer.from('/Generic content/some-video.mov'))
    })

    // it('finds content from second connection', async () => {
    //   const myPicCID = 'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu'
    //   expect(room.readContent(myPicCID)).toEqual({})
    // })
  })

  describe('toObject', () => {
    it('includes connections', async () => {
      expect(room.toObject().connections[0].contentUrls).toEqual({
        bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji:
          '/Generic content/some-video.mov',
      })
    })
  })
})
