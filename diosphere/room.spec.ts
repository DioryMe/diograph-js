import { Room } from './room'

// TODO: Replace with authentic demo-content-room content
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
    {
      address: 'some-other-address',
      contentClientType: 'S3Client',
      contentUrls: {
        bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu: '/my-pic.jpg',
      },
      diograph: {
        '/my-pic.jpg': {
          id: '/my-pic.jpg',
          image: 'data:image/jpeg;base64,/9j/2wBDZ/9k=',
          latlng: '43.464455N, 11.881478333333334E',
          date: '2022-11-06T11:38:08.713Z',
          data: [
            {
              '@context': 'https://schema.org',
              '@type': 'ImageObject',
              contentUrl: 'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu',
              cid: 'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu',
              encodingFormat: 'image/png',
              height: 480,
              width: 640,
            },
          ],
          created: '2008-10-22T17:00:07Z',
          modified: '2022-11-06T11:38:08.714Z',
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

class MockS3Client extends MockLocalClient {
  type = 'S3Client'
  address = 'some-other-address'
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
    await room.loadRoom({ LocalClient: MockLocalClient, S3Client: MockS3Client })
  })

  it('builds from object', () => {
    const duplicateRoom = new Room()
    duplicateRoom.initiateRoom(
      { LocalClient: MockLocalClient, S3Client: MockS3Client },
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

    it('finds content from second connection', async () => {
      const myPicCID = 'bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu'
      const result = await room.readContent(myPicCID)
      expect(result).toEqual(Buffer.from('/my-pic.jpg'))
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
})
