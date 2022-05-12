import { mkdirSync, existsSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { RoomClient } from '../baseRoomClient'
import { join } from 'path'
import { Diograph } from '../..'
import { Connection } from '../../connection'

class LocalRoomClient extends RoomClient {
  constructor(config: any, connection?: Connection) {
    super(config, connection)
  }

  verifyAndConnect = async () => {
    if (
      existsSync(this.roomJsonPath) &&
      existsSync(this.diographPath) &&
      existsSync(this.imageFolderPath)
    ) {
      return true
    }
    throw new Error("No room or invalid room, can't connect!")
  }

  initiateRoom = async (roomJsonContents: string, diographContents: Diograph) => {
    // room.json
    if (!existsSync(this.roomJsonPath)) {
      await this.writeTextItem(this.roomJsonPath, roomJsonContents)
    }
    // diograph.json
    if (!existsSync(this.diographPath)) {
      await this.writeTextItem(this.diographPath, diographContents.toJson())
    }
    // images/ folder
    if (!existsSync(this.imageFolderPath)) {
      mkdirSync(this.imageFolderPath)
    }

    return true
  }

  loadRoom = async () => {
    return this.readTextItem(this.roomJsonPath)
  }

  readDiograph = async () => {
    return this.readTextItem(this.diographPath)
  }

  saveDiograph = async (diographFileContents: string) => {
    return this.writeTextItem(this.diographPath, diographFileContents)
  }

  readTextItem = async (url: string) => {
    return readFile(url, { encoding: 'utf8' })
  }

  writeTextItem = async (url: string, fileContent: string) => {
    return this.writeItem(url, fileContent)
  }

  writeThumbnail = async (url: string, fileContent: Buffer | string) => {
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
    await this.writeThumbnail(join(this.imageFolderPath, thumbnailContentUrl), thumbnailBuffer)
    return `images/${thumbnailContentUrl}`
  }

  deleteThumbnail = async (thumbnailContentUrl: string) => {
    return this.deleteItem(join(this.imageFolderPath, thumbnailContentUrl))
  }
}

export { LocalRoomClient }
