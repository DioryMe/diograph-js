class RoomConnector {
  roomJsonPath: string
  diographJsonPath: string
  imageFolderPath: string

  constructor() {
    this.roomJsonPath = 'fixtures/room.json'
    this.diographJsonPath = 'fixtures/diograph.json'
    this.imageFolderPath = 'fixtures/images'
  }

  loadRoom = async () => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  readDiograph = async () => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  readTextItem = async (url: string) => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  writeTextItem = async (url: string, fileContent: string) => {
    // throw new Error('Not implemented.')
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // throw new Error('Not implemented.')
  }

  deleteThumbnail = async (thumbnailContentUrl: string) => {
    // throw new Error('Not implemented.')
  }
}

export { RoomConnector }
