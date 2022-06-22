import { Room } from './room'

const roomJsonContents = JSON.stringify({
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

describe('Room', () => {
  let room: Room

  beforeEach(async () => {
    const mockRoomClient: any = {
      readRoomJson: () => roomJsonContents,
      readDiograph: () => diographContents,
    }
    room = new Room(mockRoomClient)
    await room.loadRoom()
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
