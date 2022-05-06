import { join } from 'path'
import { rm, readFile } from 'fs/promises'
import { Client } from './baseClient'
import { generateDiograph, generateDiograph2 } from '../generators/diograph'
import { Connection } from '../connection'

class LocalClient extends Client {
  connection: Connection

  constructor(connection: Connection) {
    super()
    this.connection = connection
    this.connection.load()
  }

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

  // writeItem = async (fileContent: Buffer | string, diory?: string) => {
  //   let filePath
  //   if (diory) {
  //     filePath = this.getContentUrl(diory)
  //     const dirPath = dirname(filePath)
  //     if (!existsSync(dirPath)) {
  //       mkdirSync(dirPath, { recursive: true })
  //     }
  //   } else {
  //     filePath = this.getContentUrl(Date.now().toString())
  //   }

  //   await writeFile(filePath, fileContent)

  //   return makeRelative(this.baseUrl, filePath)
  // }

  deleteItem = async (contentUrl: string) => {
    return rm(this.getFilePath(contentUrl))
  }

  list = async (path: string) => {
    // TODO: Add typings for generateDiograph
    // const diograph: Diory[] = await generateDiograph(join(this.connection.address, path))
    const diograph: any = await generateDiograph(join(this.connection.address, path))
    await this.connection.cacheDiograph(diograph.diograph)
    return Object.values(diograph.diograph).map((diory: any) => diory.text)
  }
}

export { LocalClient }
