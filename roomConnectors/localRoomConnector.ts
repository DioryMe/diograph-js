import { readFile, writeFile, rm } from 'fs/promises'
import { RoomConnector } from './baseRoomConnector'
import { join } from 'path'

class LocalRoomConnector extends RoomConnector {
  constructor() {
    super()
    console.log('constructed')
  }

  readTextItem = async (url: string) => {
    return readFile(this.roomJsonPath, { encoding: 'utf8' })
  }

  writeTextItem = (url: string, fileContent: string) => {
    return this.writeItem(url, fileContent)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    return await writeFile(url, fileContent)
  }

  deleteItem = async (url: string) => {
    return rm(url)
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // Writes thumbnail image file to absolute path
    console.log('Thumbnail written to:', join(this.imageFolderPath, thumbnailContentUrl))
    return await this.writeItem(join(this.imageFolderPath, thumbnailContentUrl), thumbnailBuffer)
  }

  deleteThumbnail = async (thumbnailContentUrl: string) => {
    return this.deleteItem(join(this.imageFolderPath, thumbnailContentUrl))
  }
}

export { LocalRoomConnector }
