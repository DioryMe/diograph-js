import { ConnectionClient, ConnectionData, IDiograph } from '../types'
import { Diograph } from '../diograph/diograph'
import { join } from 'path-browserify'

export interface ContentUrlObject {
  // "CID <-> internalPath" pairs
  [key: string]: string
}

class ContentNotFoundError extends Error {}

class Connection {
  address: string
  contentClientType: string
  contentUrls: ContentUrlObject = {}
  diograph: IDiograph = new Diograph()
  client: ConnectionClient

  constructor(connectionClient: ConnectionClient, connectionData?: ConnectionData) {
    this.address = connectionClient.address // full connection address
    this.contentClientType = connectionClient.type
    this.client = connectionClient

    const { contentUrls, diograph } = connectionData || { contentUrls: {}, diograph: {} }
    this.contentUrls = contentUrls || {}
    if (diograph) {
      this.diograph.initialise(diograph)
    }
  }

  getInternalPath = (contentId: string) => {
    if (this.contentUrls[contentId]) {
      return join(this.address, this.contentUrls[contentId])
    }
  }

  readContent = async (contentUrl: string) => {
    if (!this.contentUrls[contentUrl]) {
      throw new ContentNotFoundError('Nothing found with that contentUrl!')
    }
    return this.client.readItem(this.contentUrls[contentUrl])
  }

  addContent = async (fileContent: ArrayBuffer | string, contentId: string) => {
    await this.client.writeItem(contentId, fileContent)

    this.addContentUrl(contentId)

    return contentId
  }

  addContentUrl = (contentId: string, contentInternalUrl?: string) => {
    this.contentUrls[contentId] = contentInternalUrl || contentId
  }

  removeContentUrl = (contentId: string) => {
    delete this.contentUrls[contentId]
  }

  deleteContent = async (contentId: string) => {
    const filePath: string | undefined = this.getInternalPath(contentId)
    if (!filePath) {
      throw new Error('Nothing found with that contentId!')
    }
    return this.client.deleteItem(filePath).then(() => {
      this.removeContentUrl(contentId)
    })
  }

  deleteConnection = async () => {
    // Delete all the content
    await Promise.all(
      Object.keys(this.contentUrls).map((contentUrl) => {
        return this.deleteContent(contentUrl)
      }),
    )
    // Delete content folder
    await this.client.deleteFolder('')
  }

  toObject = (): ConnectionData => ({
    address: this.address,
    contentClientType: this.contentClientType,
    contentUrls: this.contentUrls,
    diograph: this.diograph.toObject(),
  })
}

export { Connection, ContentNotFoundError }
