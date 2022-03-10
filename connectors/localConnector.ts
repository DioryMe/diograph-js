import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile } from 'fs/promises'
import { Connector } from './base'
import { makeRelative } from './makeRelative'

class LocalConnector extends Connector {
  baseUrl: string
  diographJsonPath: string
  imageFolderPath: string
  roomJsonPath: string

  constructor(baseUrl: string) {
    super()
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

  // -----

  getFilePath = (contentUrl: string) => {
    return join(this.baseUrl, contentUrl)
  }

  getContentUrl = (diory: string) => {
    // TODO: Derive contentUrl from diory
    return join(this.baseUrl, diory)
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

  writeItem = async (fileContent: Buffer | string, diory?: string) => {
    let filePath
    if (diory) {
      filePath = this.getContentUrl(diory)
      const dirPath = dirname(filePath)
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }
    } else {
      filePath = this.getContentUrl(Date.now().toString())
    }

    await writeFile(filePath, fileContent)

    return makeRelative(this.baseUrl, filePath)
  }

  deleteItem = async (contentUrl: string) => {
    return rm(this.getFilePath(contentUrl))
  }
}

export { Connector, LocalConnector }
