import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile, readdir } from 'fs/promises'
import { Client } from './baseClient'
import { makeRelative } from './makeRelative'
import { Diograph } from '../types'

class LocalClient extends Client {
  baseUrl: string
  diograph: Diograph = {}

  constructor(baseUrl: string) {
    super()
    this.baseUrl = baseUrl
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
    // 1. filuista dioreita
    // 2. kansioista dioreita (ilman subfoldereita)
    // 3. linkit rootista dioreihin
    // const diograph = generateDiograph(path)
    // this.diograph.addToDiograph(diograph)

    await writeFile(join(this.baseUrl, 'diograph.json'), JSON.stringify(this.diograph))
  }

  loadOrInitiate = async (path: string = '/') => {
    if (!existsSync(join(this.baseUrl, 'diograph.json'))) {
      // Should check if path already exists? Shouldn't load if not necessary...
      // if (!this.diograph.includes(path)) {
      // Initiate and add diograph.json
      await this.initiate(path)
      // }
    }
    this.diograph = JSON.parse(
      await readFile(join(this.baseUrl, 'diograph.json'), { encoding: 'utf8' }),
    )
  }

  import = async () => {
    return 'diory'
  }

  toJson = () => {
    return {
      address: this.baseUrl,
      contentUrls: {},
    }
  }
}

export { Client, LocalClient }
