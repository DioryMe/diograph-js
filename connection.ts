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
  contentUrls: ContentUrlObject
  diograph: IDiograph

  constructor({ address, contentClientType, contentUrls = {}, diograph = {} }: ConnectionObject) {
    if (!address || !contentClientType) {
      throw new Error(
        `Invalid connectionData: address: ${address}, contentClientType: ${contentClientType}`,
      )
    }
    this.address = address // full connection address
    this.contentClientType = contentClientType
    this.contentUrls = contentUrls || {}
    this.diograph = new Diograph()
    if (diograph && Object.keys(diograph).length) {
      this.diograph.mergeDiograph(diograph)
    }
  }

  addContentUrl = (contentId: string) => {
    this.contentUrls[contentId] = contentId
  }

  getContent = (contentUrl: string) => {
    if (this.contentUrls[contentUrl]) {
      return this.contentUrls[contentUrl]
      // return join(this.address, this.contentUrls[contentUrl])
    }
  }

  readContent = async (contentUrl: string, contentClient: any) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return contentClient.readItem(filePath)
  }

  addContent = async (fileContent: Buffer | string, contentId: string, contentClient: any) => {
    await contentClient.writeItem(contentId, fileContent)

    this.addContentUrl(contentId)

    return contentId
  }

  deleteContent = async (contentUrl: string, contentClient: any) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return contentClient.deleteItem(filePath)
  }

  deleteConnection = async (contentClient: any) => {
    // Delete all the content
    await Promise.all(
      Object.keys(this.contentUrls).map((contentUrl) => {
        return this.deleteContent(contentUrl, contentClient)
      }),
    )
    // Delete content folder
    await contentClient.deleteItem(this.address)
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
