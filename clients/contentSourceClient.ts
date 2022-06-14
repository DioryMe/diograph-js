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

  getContentUrl = (diory: string) => {
    // TODO: Derive contentUrl from diory
    return join(this.address, diory)
  }

  addContent = async (fileContent: Buffer | string, diory: Diory) => {
    const contentUrl = Date.now().toString()
    const filePath = this.getFilePath(contentUrl)

    await this.client.writeItem(filePath, fileContent)

    // const contentUrl = filePath // makeRelative(filePath, this.address)
    this.connection?.addContentUrl(contentUrl, contentUrl)

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
