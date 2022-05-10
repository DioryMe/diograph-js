import { ConnectionObject } from './types'
import { Diory } from './diory'

export interface ContentUrlPayload {
  diory: Diory
  internalPath: string
}

export interface ContentUrlObject {
  [key: string]: ContentUrlPayload
}

class Connection {
  address: string
  type: string
  contentUrls: ContentUrlObject

  constructor({ address, type, contentUrls }: ConnectionObject) {
    this.address = address
    this.type = type
    this.contentUrls = contentUrls || {}
  }

  load = async () => {}

  addContentUrl = (contentUrl: string, internalPath: string, diory: Diory) => {
    this.contentUrls[contentUrl] = { diory, internalPath }
  }

  toConnectionObject = (): ConnectionObject => {
    return {
      address: this.address,
      type: this.type,
      contentUrls: this.contentUrls,
    }
  }
}

export { Connection }
