import { Diory } from '../types'
import { join } from 'path/posix'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile } from 'fs/promises'
import { Connector } from './base'

class LocalConnector extends Connector {
  baseUrl: string
  diographJsonPath: string
  imageFolderPath: string
  roomJsonPath: string

  constructor(baseUrl: string) {
    super()
    this.baseUrl = baseUrl
    this.diographJsonPath = join(baseUrl, 'diograph.json')
    this.imageFolderPath = join(baseUrl, 'images')
    this.roomJsonPath = join(baseUrl, 'room.json')
  }

  addThumbnail = (thumbnailBuffer: Buffer, diory: Diory) => {
    if (!existsSync(this.imageFolderPath)) {
      mkdirSync(this.imageFolderPath)
    }
    return writeFile(join(this.imageFolderPath, `${diory.id}.jpg`), thumbnailBuffer)
  }

  deleteThumbnail = (thumbnailFileName: string) => {
    return rm(join(this.imageFolderPath, thumbnailFileName))
  }

  readDiograph = () => {
    return readFile(this.diographJsonPath, { encoding: 'utf8' })
  }

  writeDiograph = (fileContent: string) => {
    return writeFile(this.diographJsonPath, fileContent).then(() => {
      console.log(`diograph.save(): Saved diograph.json to ${this.diographJsonPath}`)
    })
  }

  loadRoom = () => {
    return readFile(this.roomJsonPath, { encoding: 'utf8' })
  }

  getFilePath = (contentUrl: string) => {
    return join(this.baseUrl, contentUrl)
  }

  getDataobject = (contentUrl: string) => {
    const filePath: string | undefined = this.getFilePath(contentUrl)
    if (!filePath) {
      throw new Error('Dataobject not found!')
    }
    return readFile(filePath)
  }

  writeDataobject = (contentUrl: string, sourceFileContent: Buffer) => {
    return writeFile(this.getFilePath(contentUrl), sourceFileContent)
  }

  deleteDataobject = (contentUrl: string) => {
    const filePath: string = this.getFilePath(contentUrl)
    return rm(filePath)
  }
}

export { Connector, LocalConnector }