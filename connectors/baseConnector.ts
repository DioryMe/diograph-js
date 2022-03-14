import { join } from 'path'

class Connector {
  imageFolderPath: string

  constructor() {
    this.imageFolderPath = 'images'
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // Writes thumbnail image file to absolute path
    console.log('Thumbnail written to:', join(this.imageFolderPath, thumbnailContentUrl))
    return await this.writeItem(thumbnailBuffer, join(this.imageFolderPath, thumbnailContentUrl))
  }

  deleteThumbnail = async (thumbnailFileName: string) => {
    return this.deleteItem(join(this.imageFolderPath, thumbnailFileName))
  }

  getDataobject = (contentUrl: string) => {
    return this.readItem(contentUrl)
  }

  writeDataobject = async (sourceFileContent: Buffer, diory: string) => {
    return this.writeItem(sourceFileContent, diory)
  }

  deleteDataobject = async (contentUrl: string) => {
    return this.deleteItem(contentUrl)
  }

  // -----------------

  readItem = async (contentUrl: string): Promise<Buffer> => {
    // throw new Error('Not implemented.')
    return Buffer.from('string')
  }

  readTextItem = async (contentUrl: string) => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  writeItem = async (fileContent: Buffer | string, diory?: string) => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  deleteItem = async (contentUrl: string) => {
    // throw new Error('Not implemented.')
  }
}

export { Connector }
