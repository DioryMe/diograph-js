import { join } from 'path'

class Connector {
  baseUrl: string
  diographJsonPath: string
  imageFolderPath: string
  roomJsonPath: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.diographJsonPath = 'diograph.json'

    this.imageFolderPath = 'images'
    this.roomJsonPath = 'room.json'
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // Writes thumbnail image file to absolute path
    console.log('Thumbnail written to:', join(this.imageFolderPath, thumbnailContentUrl))
    return await this.writeItem(thumbnailBuffer, join(this.imageFolderPath, thumbnailContentUrl))
  }

  deleteThumbnail = async (thumbnailFileName: string) => {
    return this.deleteItem(join(this.imageFolderPath, thumbnailFileName))
  }

  readDiograph = async () => {
    return this.readTextItem(this.diographJsonPath)
  }

  writeDiograph = (fileContent: string) => {
    return this.writeItem(fileContent, this.diographJsonPath).then(() => {
      console.log(`diograph.save(): Saved diograph.json to ${this.diographJsonPath}`)
    })
  }

  loadRoom = async () => {
    return this.readTextItem(this.roomJsonPath)
  }

  getDataobject = (contentUrl: string) => {
    return this.readItem(contentUrl)
  }

  // TODO: writeDataobject ei pitäisi tarvita fileNamea, vaan sen pitäisi pystyä luomaan contentUrl itse
  writeDataobject = async (sourceFileContent: Buffer, diory: string) => {
    return this.writeItem(sourceFileContent, diory)
  }

  deleteDataobject = async (contentUrl: string) => {
    return this.deleteItem(contentUrl)
  }

  // -----------------

  getFilePath = (contentUrl: string) => {
    // throw new Error('Not implemented.')
    return 'string'
  }

  getContentUrl = (diory: string) => {
    // throw new Error('Not implemented.')
    return 'string'
  }

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
