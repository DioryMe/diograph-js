import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile, readdir } from 'fs/promises'
import { Client } from './baseClient'
import { makeRelative } from './makeRelative'

class LocalClient extends Client {
  baseUrl: string

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

  list = async () => {
    await readdir(this.baseUrl)
    return []
  }

  load = async () => {
    console.log('client loaded')
    // this.connected = await this.roomClient.verifyAndConnect()
    // if (!this.connected) {
    //   throw new Error("Can't load room before it's connected!")
    // }
    // const roomJsonContents = await this.roomClient.loadRoom()
    // const { diographUrl, contentUrls, clients } = JSON.parse(roomJsonContents)
    // // TODO: Validate JSON with own validator.js (using ajv.js.org)
    // this.contentUrls = contentUrls
    // this.clients = clients.map((config: any) => {
    //   return new LocalClient(config.address)
    // })
    // this.diograph = new DiographJson(diographUrl, this.roomClient)
    // await this.diograph.loadDiograph()
    return 'Not implemented'
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
