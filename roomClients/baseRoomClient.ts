import { join } from 'path'
import { Diograph } from '..'

class RoomClient {
  address: string
  roomJsonPath: string
  diographPath: string
  imageFolderPath: string
  contentFolderPath: string

  constructor(config: any) {
    if (!config.address) {
      throw new Error('No address given to room')
    }
    this.address = config.address
    this.roomJsonPath = join(this.address, 'room.json')
    this.diographPath = join(this.address, 'diograph.json')
    this.imageFolderPath = join(this.address, 'images')
    this.contentFolderPath = join(this.address, 'Diory Content')
  }

  verifyAndConnect = async () => {
    // throw new Error('Not implemented.')
    return true
  }

  initiateRoom = async (roomJsonContents: string, diographContents: Diograph) => {
    // throw new Error('Not implemented.')
    return true
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

  writeItem = async (url: string, fileContent: Buffer | string) => {
    // throw new Error('Not implemented.')
  }

  deleteItem = async (url: string) => {
    // throw new Error('Not implemented.')
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // throw new Error('Not implemented.')
    return 'Not implemented.'
  }

  deleteThumbnail = async (thumbnailContentUrl: string) => {
    // throw new Error('Not implemented.')
  }

  readContent = (contentUrl: string) => {
    // return this.readItem(contentUrl)
  }

  writeContent = async (sourceFileContent: Buffer, diory?: string) => {
    // Not implemented
    return 'Not implemented'
  }

  deleteContent = async (contentUrl: string) => {}
}

export { RoomClient }
