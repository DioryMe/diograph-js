import { ConnectionObject, IDiograph, IDiographObject } from './types'
import { Diograph } from './diograph'
import { join } from 'path-browserify'

export interface ContentUrlObject {
  // "CID <-> internalPath" pairs
  [key: string]: string
}

class Connection {
  address: string
  contentClientType: string
  contentUrls: ContentUrlObject = {}
  diograph: IDiograph = new Diograph()
  client: any // TODO: Define baseClient

  constructor(connectionClient: any) {
    this.address = connectionClient.address // full connection address
    this.contentClientType = connectionClient.type
    this.client = connectionClient
  }

  initiateConnection({ contentUrls = {}, diograph = {} }: ConnectionObject) {
    this.contentUrls = contentUrls || {}
    if (diograph && Object.keys(diograph).length) {
      this.diograph.mergeDiograph(diograph)
    }
  }

  addContentUrl = (contentId: string) => {
    this.contentUrls[contentId] = contentId
  }

  getContent = (contentUrl: string) => {
    if (this.contentUrls[contentUrl]) {
      return join(this.address, this.contentUrls[contentUrl])
    }
  }

  readContent = async (contentUrl: string) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return this.client.readItem(filePath)
  }

  addContent = async (fileContent: Buffer | string, contentId: string) => {
    await this.client.writeItem(contentId, fileContent)

    this.addContentUrl(contentId)

    return contentId
  }

  deleteContent = async (contentUrl: string) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return this.client.deleteItem(filePath)
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

  toObject = (roomAddress?: string): ConnectionObject => ({
    // TODO: Make some kind of exception for relative paths (for demo-content-room which can't have absolute paths...)
    // address: roomAddress ? makeRelative(roomAddress, this.address) : this.address,
    // - but connection shouldn't know anything about the room...
    address: this.address,
    contentClientType: this.contentClientType,
    contentUrls: this.contentUrls,
    diograph: this.diograph.toObject(),
  })
}

export { Connection }
