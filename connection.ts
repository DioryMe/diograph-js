import { ConnectionObject } from './types'
import { Diory } from './diory'
import { makeRelative } from './utils/makeRelative'

export interface ContentUrlPayload {
  diory: Diory
  internalPath: string
}

export interface ContentUrlObject {
  [key: string]: ContentUrlPayload
}

class Connection {
  id: string
  address: string
  type: string
  contentUrls: ContentUrlObject

  constructor({ id, address, type, contentUrls }: ConnectionObject) {
    this.id = id
    this.address = address
    this.type = type
    this.contentUrls = contentUrls || {}
  }

  load = async () => {}

  addContentUrl = (contentUrl: string, internalPath: string, diory: Diory) => {
    this.contentUrls[contentUrl] = { diory, internalPath }
  }

  toConnectionObject = (roomAddress?: string): ConnectionObject => {
    const contentUrls: any = this.contentUrls
    Object.values(contentUrls).forEach((contentUrl: any) => {
      if (contentUrl.diory.toDioryObject) {
        contentUrl.diory = contentUrl.diory.toDioryObject()
      }
    })
    return {
      id: this.id,
      address: roomAddress ? makeRelative(roomAddress, this.address) : this.address,
      type: this.type,
      contentUrls,
    }
  }
}

export { Connection }
