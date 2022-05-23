import { join } from 'path'
import { Connection } from '../connection'
import { Diory } from '../diory'
import { ElectronClient } from './electronClient'
import { ElectronClientMock } from './electronClientMock'

class ContentSourceClient {
  address: string
  connection: Connection
  client: ElectronClient

  constructor(connection: Connection, client?: ElectronClient | ElectronClientMock) {
    this.address = connection.address
    this.connection = connection
    this.client = client || new ElectronClient()
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

    const contentUrl = filePath // makeRelative(filePath, this.address)
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
    return this.client.deleteItem(filePath)
  }
}

export { ContentSourceClient }
