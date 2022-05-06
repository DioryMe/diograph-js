import { join } from 'path'
import { rm, readFile } from 'fs/promises'
import { Client } from './baseClient'
import { generateDiograph, generateDiograph2 } from '../generators/diograph'
import { Connection } from '../connection'
import { Diory } from '../diory'

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
    const generatedDiories: Diory[] = await generateDiograph2(join(this.connection.address, path))
    console.log(generatedDiories.map((diory: any) => diory.text))
    generatedDiories.forEach((generatedDiory) =>
      this.connection.cacheRoom.diograph?.addDiory(generatedDiory),
    )
    await this.connection.cacheRoom.diograph?.saveDiograph()
    return this.connection.cacheRoom.diograph?.diories.map((diory: any) => diory.text)
  }
}

export { LocalClient }
