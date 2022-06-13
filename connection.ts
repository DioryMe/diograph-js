import { ConnectionObject } from './types'
import { Diory } from './diory'
import { makeRelative } from './utils/makeRelative'
import { Diograph } from './diograph'

export interface ContentUrlPayload {
  diory: any
  internalPath: string
}

export interface ContentUrlObject {
  [key: string]: ContentUrlPayload
}

class Connection {
  id: string
  address: string
  contentClient: string
  contentUrls: ContentUrlObject
  diograph: Diograph

  constructor({ id, address, contentClient, contentUrls, diograph }: ConnectionObject) {
    this.id = id
    this.address = address
    this.contentClient = contentClient
    this.contentUrls = contentUrls || {}
    this.diograph = new Diograph()
    if (diograph) {
      this.diograph.mergeDiograph(diograph)
    }
  }

  load = async () => {}

  addContentUrl = (contentUrl: string, internalPath: string, diory: Diory) => {
    this.contentUrls[contentUrl] = { diory, internalPath }
  }

  toConnectionObject = (roomAddress?: string): ConnectionObject => {
    const contentUrls: any = this.contentUrls
    Object.values(contentUrls).forEach((contentUrl: any) => {
      if (contentUrl.diory.toDioryObject) {
        contentUrl.diory = contentUrl.diory.toDioryObject(false)
      }
    })
    return {
      id: this.id,
      address: roomAddress ? makeRelative(roomAddress, this.address) : this.address,
      contentClient: this.contentClient,
      contentUrls,
      diograph: this.diograph.toDiographObject(),
    }
  }
}

export { Connection }
