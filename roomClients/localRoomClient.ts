import { readFile, writeFile, rm } from 'fs/promises'
import { RoomClient } from './baseRoomClient'
import { join } from 'path'

class LocalRoomClient extends RoomClient {
  constructor(config: any) {
    super(config)
  }

  loadRoom = async () => {
    return this.readTextItem(this.roomJsonPath)
  }

  readDiograph = async () => {
    return this.readTextItem(this.diographJsonPath)
  }

  saveDiograph = async (diographFileContents: string) => {
    return this.writeTextItem(this.diographJsonPath, diographFileContents)
  }

  readTextItem = async (url: string) => {
    return readFile(url, { encoding: 'utf8' })
  }

  writeTextItem = async (url: string, fileContent: string) => {
    return this.writeItem(url, fileContent)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    return writeFile(url, fileContent)
  }

  deleteItem = async (url: string) => {
    return rm(url)
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // Writes thumbnail image file to absolute path
    console.log('Thumbnail written to:', join(this.imageFolderPath, thumbnailContentUrl))
    return this.writeItem(join(this.imageFolderPath, thumbnailContentUrl), thumbnailBuffer)
  }

  deleteThumbnail = async (thumbnailContentUrl: string) => {
    return this.deleteItem(join(this.imageFolderPath, thumbnailContentUrl))
  }
}

export { LocalRoomClient }
