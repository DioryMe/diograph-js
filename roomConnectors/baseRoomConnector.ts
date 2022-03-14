class RoomConnector {
  roomJsonPath: string
  diographJsonPath: string
  imageFolderPath: string

  constructor() {
    this.roomJsonPath = 'room.json'
    this.diographJsonPath = 'diograph.json'
    this.imageFolderPath = 'images'
  }

  loadRoom = async () => {
    return this.readTextItem(this.roomJsonPath)
  }

  readDiograph = async () => {
    return this.readTextItem(this.diographJsonPath)
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
