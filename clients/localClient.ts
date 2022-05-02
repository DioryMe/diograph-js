import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile, readdir } from 'fs/promises'
import { Client } from './baseClient'
import { makeRelative } from './makeRelative'
import { ClientData, Diograph } from '../types'
import { generateDiograph } from '../generators/diograph'

class LocalClient extends Client {
  baseUrl: string
  cachePath: string
  diograph: Diograph = {}

  constructor(baseUrl: string, cachePath: string) {
    super()
    this.baseUrl = baseUrl
    this.cachePath = cachePath
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

  list = async (path?: string) => {
    await this.loadOrInitiate(path)
    if (!path) {
      return this.diograph
    }
    // Somehow should list only diograph/diories from given folder path...
    return this.diograph //[path]
  }

  initiate = async (path?: string) => {
    const diograph = await generateDiograph(path ? join(this.baseUrl, path) : this.baseUrl)

    const diographJson = {
      diograph: {
        ...this.diograph,
        ...diograph.diograph,
      },
      rootId: 'root123',
    }
    this.diograph = diographJson.diograph
    await writeFile(join(this.cachePath, 'diograph.json'), JSON.stringify(diographJson, null, 2))
  }

  loadOrInitiate = async (path: string = '/') => {
    // Load existing diograph if available
    if (existsSync(join(this.cachePath, 'diograph.json'))) {
      this.diograph = JSON.parse(
        await readFile(join(this.cachePath, 'diograph.json'), { encoding: 'utf8' }),
      ).diograph
      // return // <--- This will prevent duplicates when using CLI
    }
    // Should check if path already exists? Shouldn't load if not necessary...
    // if (!this.diograph.includes(path)) {
    // Initiate and add diograph.json
    await this.initiate(path)
    // }
  }

  import = async () => {
    return 'diory'
  }

  toJson = (): ClientData => {
    return {
      address: this.baseUrl,
      contentUrls: [],
    }
  }
}

export { Client, LocalClient }
