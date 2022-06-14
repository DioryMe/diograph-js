import { ConnectionObject } from './types'
import { makeRelative } from './utils/makeRelative'
import { Diograph } from './diograph'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export interface ContentUrlObject {
  // "CID <-> internalPath" pairs
  [key: string]: string
}

class Connection {
  id: string
  address: string
  contentClient: string
  contentUrls: ContentUrlObject
  diograph: Diograph

  constructor({ id, address, contentClient, contentUrls, diograph }: ConnectionObject) {
    this.id = id || uuidv4()
    this.address = address
    this.contentClient = contentClient
    this.contentUrls = contentUrls || {}
    this.diograph = new Diograph()
    if (diograph) {
      this.diograph.mergeDiograph(diograph)
    }
  }

  getContent = (contentUrl: string) => {
    if (this.contentUrls[contentUrl]) {
      return join(this.address, this.contentUrls[contentUrl])
    }
  }

  addContentUrl = (CID: string, internalPath: string) => {
    this.contentUrls[CID] = internalPath
  }

  toConnectionObject = (roomAddress?: string): ConnectionObject => ({
    id: this.id,
    address: roomAddress ? makeRelative(roomAddress, this.address) : this.address,
    contentClient: this.contentClient,
    contentUrls: this.contentUrls,
    diograph: this.diograph.toDiographObject(),
  })
}

export { Connection }
