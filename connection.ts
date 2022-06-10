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

  toDiograph = () => {
    const diograph = new Diograph()
    const dioryArray = Object.entries(this.contentUrls).map(([key, { diory, internalPath }]) => ({
      [diory.id]: { contentUrl: internalPath, ...diory },
    }))
    diograph.mergeDiograph(dioryArray.reduce((cum, current) => ({ ...current, ...cum }), {}))
    return diograph
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
      type: this.type,
      contentUrls,
    }
  }
}

export { Connection }
