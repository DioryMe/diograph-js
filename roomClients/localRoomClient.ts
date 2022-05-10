import { mkdirSync, existsSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { RoomClient } from './baseRoomClient'
import { join } from 'path'
import { Diograph } from '..'
import { dirname } from 'path/posix'
import { makeRelative } from '../roomClients/makeRelative'
import { Connection } from '../connection'
import { Diory } from '../diory'
import { generateDiograph } from '../generators/diograph'

class LocalRoomClient extends RoomClient {
  constructor(config: any, connection?: Connection) {
    super(config, connection)
  }

  verifyAndConnect = async () => {
    if (
      existsSync(this.roomJsonPath) &&
      existsSync(this.diographPath) &&
      existsSync(this.imageFolderPath) &&
      existsSync(this.contentFolderPath)
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
    // Diory Content/ folder
    if (!existsSync(this.contentFolderPath)) {
      mkdirSync(this.contentFolderPath)
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

  getFilePath = (contentUrl: string) => {
    return join(this.address, contentUrl)
  }

  getContentUrl = (diory: string) => {
    // TODO: Derive contentUrl from diory
    return join(this.address, diory)
  }

  addContent = async (fileContent: Buffer | string, diory?: string) => {
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

    await this.writeItem(filePath, fileContent)

    const contentUrl = makeRelative(filePath, this.address)
    this.connection?.addContentUrl(contentUrl, contentUrl, new Diory({ id: '123' }))

    return contentUrl
  }

  writeThumbnail = async (url: string, fileContent: Buffer | string) => {
    return this.writeItem(url, fileContent)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    return writeFile(url, fileContent)
  }

  readContent = async (contentUrl: string) => {
    const filePath: string = this.getFilePath(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return readFile(this.getFilePath(contentUrl))
  }

  deleteContent = async (contentUrl: string) => {
    const filePath: string = this.getFilePath(contentUrl)
    return rm(filePath)
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

  list = async (path: string) => {
    if (!this.connection) {
      throw new Error("Can't do 'list': no connection provided")
    }
    const generatedDiories: Diory[] = await generateDiograph(join(this.connection.address, path))

    generatedDiories.forEach((generatedDiory) => {
      this.connection?.addContentUrl(generatedDiory.id, '123abc', generatedDiory)
    })

    return this.toDiograph(generatedDiories)
  }

  toDiograph = (diories: Diory[]) => {
    const diograph: any = {}
    diories.forEach((diory: Diory) => (diograph[diory.id] = diory.toDioryObject()))
    return diograph
  }
}

export { LocalRoomClient }
