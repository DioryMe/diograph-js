import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

class RoomClient {
  address: string
  roomJsonPath: string
  diographJsonPath: string
  imageFolderPath: string

  constructor(config: any) {
    if (!config.address) {
      throw new Error('No address given to room')
    }
    this.address = config.address
    this.roomJsonPath = join(this.address, 'room.json')
    this.diographJsonPath = join(this.address, 'diograph.json')
    this.imageFolderPath = join(this.address, 'images')
    if (!existsSync(this.imageFolderPath)) {
      mkdirSync(this.imageFolderPath)
    }
  }

  loadRoom = async () => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  readDiograph = async () => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  saveDiograph = async (diographFileContents: string) => {
    // throw new Error('Not implemented.')
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

export { RoomClient }