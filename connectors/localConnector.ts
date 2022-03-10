import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile } from 'fs/promises'
import { Connector } from './base'

class LocalConnector extends Connector {
  baseUrl: string
  diographJsonPath: string
  imageFolderPath: string
  relativeImageFolderPath: string
  roomJsonPath: string

  constructor(baseUrl: string) {
    super()
    this.baseUrl = baseUrl
    this.diographJsonPath = join(baseUrl, 'diograph.json')

    this.relativeImageFolderPath = 'images'
    this.imageFolderPath = join(baseUrl, this.relativeImageFolderPath)
    this.roomJsonPath = join(baseUrl, 'room.json')
  }

  addThumbnail = async (thumbnailBuffer: Buffer, thumbnailContentUrl: string) => {
    // Writes thumbnail image file to absolute path
    console.log('Thumbnail written to:', join(this.imageFolderPath, thumbnailContentUrl))
    await this.writeItem(join(this.imageFolderPath, thumbnailContentUrl), thumbnailBuffer)
    // Returns relative thumbnail image path to be set as diory.image
    return join(this.relativeImageFolderPath, thumbnailContentUrl)
  }

  deleteThumbnail = async (thumbnailFileName: string) => {
    return this.deleteItem(join(this.imageFolderPath, thumbnailFileName))
  }

  readDiograph = async () => {
    return this.readTextItem(this.diographJsonPath)
  }

  writeDiograph = (fileContent: string) => {
    return this.writeItem(this.diographJsonPath, fileContent).then(() => {
      console.log(`diograph.save(): Saved diograph.json to ${this.diographJsonPath}`)
    })
  }

  loadRoom = async () => {
    return this.readTextItem(this.roomJsonPath)
  }

  getDataobject = (contentUrl: string) => {
    return this.readItem(contentUrl)
  }

  // TODO: writeDataobject ei ota contentUrlia, vaan sen pitäisi luoda se...
  writeDataobject = async (contentUrl: string, sourceFileContent: Buffer) => {
    return this.writeItem(contentUrl, sourceFileContent)
  }

  deleteDataobject = async (contentUrl: string) => {
    return this.deleteItem(contentUrl)
  }

  // -----

  getFilePath = (contentUrl: string) => {
    return join(this.baseUrl, contentUrl)
  }

  readItem = async (contentUrl: string) => {
    const filePath: string = this.getFilePath(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return readFile(this.getFilePath(contentUrl))
  }

  readTextItem = async (contentUrl: string) => {
    return readFile(this.getFilePath(contentUrl), { encoding: 'utf8' })
  }

  writeItem = async (contentUrl: string, fileContent: Buffer | string) => {
    const filePath = this.getFilePath(contentUrl)
    const dirPath = dirname(filePath)
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }

    return writeFile(filePath, fileContent)
  }

  deleteItem = async (contentUrl: string) => {
    return rm(this.getFilePath(contentUrl))
  }
}

export { Connector, LocalConnector }
