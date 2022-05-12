import { mkdirSync, existsSync, lstatSync } from 'fs'
import { readFile, writeFile, rm, readdir } from 'fs/promises'
import { ContentSourceClient } from '../baseContentSourceClient'
import { join } from 'path'
import { dirname } from 'path/posix'
import { makeRelative } from './makeRelative'
import { Connection } from '../../connection'
import { Diory } from '../../diory'
import { getPath, isFile, isFolder, isValid } from './dirent-utils'

class LocalContentSourceClient extends ContentSourceClient {
  constructor(config: any, connection?: Connection) {
    super(config, connection)
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

export { LocalContentSourceClient }
