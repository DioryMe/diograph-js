import { join } from 'path'
import { ConnectionObject, DiographObject } from './types'
import { Room } from '.'
import { LocalRoomClient } from './roomClients'

export interface ContentUrlObject {
  [key: string]: string
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

  addContentUrl = (contentUrl: string, internalPath: string) => {
    this.contentUrls[contentUrl] = internalPath
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
