import { mkdirSync, existsSync, lstatSync } from 'fs'
import { readFile, writeFile, rm, readdir } from 'fs/promises'
import { join } from 'path'
import { dirname } from 'path/posix'
import { makeRelative } from './local/makeRelative'
import { Connection } from '../connection'
import { Diory } from '../diory'
import { getPath, isFile, isFolder, isValid } from './local/dirent-utils'
import { LocalClient } from './local/localClient'

class ContentSourceClient {
  address: string
  connection?: Connection
  client: LocalClient

  constructor(config: any, connection?: Connection, client?: LocalClient) {
    if (!config.address) {
      throw new Error('No address given to room')
    }
    this.address = config.address
    this.connection = connection
    this.client = client || new LocalClient()
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
    } else {
      filePath = this.getContentUrl(Date.now().toString())
    }

    await this.client.writeItem(filePath, fileContent)

    const contentUrl = makeRelative(filePath, this.address)
    this.connection?.addContentUrl(contentUrl, contentUrl, new Diory({ id: '123' }))

    return contentUrl
  }

  readContent = async (contentUrl: string) => {
    const filePath: string = this.getFilePath(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return this.client.readItem(filePath)
  }

  deleteContent = async (contentUrl: string) => {
    const filePath: string = this.getFilePath(contentUrl)
    return this.deleteItem(filePath)
  }

  deleteItem = async (url: string) => {
    return rm(url)
  }

  getFileAndSubfolderPaths = async (folderPath: string) => {
    if (!(existsSync(folderPath) && lstatSync(folderPath).isDirectory())) {
      throw new Error(`Path is not folder ${folderPath}`)
    }
    const dirents = await readdir(folderPath, { withFileTypes: true })
    return {
      filePaths: dirents.filter(isFile).filter(isValid).map(getPath(folderPath)),
      subfolderPaths: dirents.filter(isFolder).filter(isValid).map(getPath(folderPath)),
    }
  }

  list = async (path: string) => {
    if (!this.connection) {
      throw new Error("Can't do 'list': no connection provided")
    }
    const absolutePath = join(this.connection.address, path)
    const { filePaths, subfolderPaths } = (await this.getFileAndSubfolderPaths(absolutePath)) || {}

    return {
      filePaths,
      subfolderPaths,
      absolutePath,
    }
  }
}

export { ContentSourceClient }
