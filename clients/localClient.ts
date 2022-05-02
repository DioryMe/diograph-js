import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile, readdir } from 'fs/promises'
import { Client } from './baseClient'
import { makeRelative } from './makeRelative'
import { Diograph } from '../types'
import { generateDiograph } from '../generators/diograph'
import { Connection } from '../connection'

class LocalClient extends Client {
  diograph: Diograph = {}
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

  list = async (path: string) => {
    const diograph = await generateDiograph(join(this.connection.address, path))
    await this.connection.cacheDiograph(diograph)
    return diograph
  }
}

export { LocalClient }
