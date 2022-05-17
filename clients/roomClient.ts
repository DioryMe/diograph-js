import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { Diograph } from '..'
import { Connection } from '../connection'
import { LocalClient } from './local/localClient'

class RoomClient {
  address: string
  roomJsonPath: string
  diographPath: string
  imageFolderPath: string
  connection?: Connection
  client: LocalClient

  constructor(config: any, connection?: Connection, client?: LocalClient) {
    if (!config.address) {
      throw new Error('No address given to room')
    }
    this.address = config.address
    this.roomJsonPath = join(this.address, 'room.json')
    this.diographPath = join(this.address, 'diograph.json')
    this.imageFolderPath = join(this.address, 'images')
    this.connection = connection
    this.client = client || new LocalClient()
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
      await this.client.writeItem(this.roomJsonPath, roomJsonContents)
    }
    // diograph.json
    if (!existsSync(this.diographPath)) {
      await this.client.writeItem(this.diographPath, diographContents.toJson())
    }
    // images/ folder
    if (!existsSync(this.imageFolderPath)) {
      mkdirSync(this.imageFolderPath)
    }

    return true
  }

  loadRoom = async () => {
    return this.client.readTextItem(this.roomJsonPath)
  }

  readDiograph = async () => {
    return this.client.readTextItem(this.diographPath)
  }

  saveDiograph = async (diographFileContents: string) => {
    return this.client.writeItem(this.diographPath, diographFileContents)
  }

  writeThumbnail = async (url: string, fileContent: Buffer | string) => {
    return this.client.writeItem(url, fileContent)
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // Writes thumbnail image file to absolute path
    console.log('Thumbnail written to:', join(this.imageFolderPath, thumbnailContentUrl))
    await this.writeThumbnail(join(this.imageFolderPath, thumbnailContentUrl), thumbnailBuffer)
    return `images/${thumbnailContentUrl}`
  }

  deleteThumbnail = async (thumbnailContentUrl: string) => {
    return this.client.deleteItem(join(this.imageFolderPath, thumbnailContentUrl))
  }

  deleteRoomJson = async () => {
    return this.client.deleteItem(this.roomJsonPath)
  }

  deleteDiographJson = async () => {
    return this.client.deleteItem(this.diographPath)
  }
}

export { RoomClient }
