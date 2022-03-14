import { readFile, writeFile } from 'fs/promises'
import { RoomConnector } from './baseRoomConnector'

class LocalRoomConnector extends RoomConnector {
  constructor() {
    super()
    console.log('constructed')
  }

  readTextItem = async (url: string) => {
    return readFile(this.roomJsonPath, { encoding: 'utf8' })
  }

  writeTextItem = (url: string, fileContent: string) => {
    return writeFile(url, fileContent).then(() => {
      console.log('writeTextItem', this.diographJsonPath)
    })
  }
}

export { LocalRoomConnector }
