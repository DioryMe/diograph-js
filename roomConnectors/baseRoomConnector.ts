class RoomConnector {
  roomJsonPath: string
  diographJsonPath: string

  constructor() {
    this.roomJsonPath = 'room.json'
    this.diographJsonPath = 'diograph.json'
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
}

export { RoomConnector }
