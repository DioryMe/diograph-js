import { join } from 'path'
import { ConnectionObject, DiographObject } from './types'
import { Room } from '.'
import { LocalRoomClient } from './roomClients'

export interface ContentUrlPayload {
  diory: object
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

  addContentUrl = (contentUrl: string, internalPath: string, diory: object) => {
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
