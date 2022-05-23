import { join } from 'path'
import { Connection } from '../connection'
import { ElectronClient } from './electronClient'
import { ElectronClientMock } from './electronClientMock'

class RoomClient {
  address: string
  roomJsonPath: string
  diographPath: string
  imageFolderPath: string
  connection?: Connection
  client: ElectronClient

  constructor(config: any, connection?: Connection, client?: ElectronClient | ElectronClientMock) {
    if (!config.address) {
      throw new Error('No address given to room')
    }
    this.address = config.address
    this.roomJsonPath = join(this.address, 'room.json')
    this.diographPath = join(this.address, 'diograph.json')
    this.imageFolderPath = join(this.address, 'images')
    this.connection = connection
    this.client = client || new ElectronClient()
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
