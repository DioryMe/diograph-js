import { join } from 'path'
import { ConnectionObject, DiographObject } from './types'
import { Room } from '.'
import { LocalRoomClient } from './roomClients'

class Connection {
  address: string
  type: string
  contentUrls: string[]
  cacheRoom: Room

  constructor({ address, type, contentUrls }: ConnectionObject, cachePath: string) {
    this.address = address
    this.type = type
    this.contentUrls = contentUrls || []
    this.cacheRoom = new Room(join(cachePath), new LocalRoomClient({ address: cachePath }))
  }

  load = async () => {
    return this.cacheRoom.loadOrInitiateRoom()
  }

  cacheDiograph = async (diographObject: DiographObject) => {
    if (!this.cacheRoom.diograph) {
      throw new Error("Can't cacheDiograph: diograph/room is not loaded")
    }
    this.cacheRoom.diograph.mergeDiograph(diographObject)
    return this.cacheRoom.diograph.saveDiograph()
  }

  toConnectionObject = (): ConnectionObject => {
    return {
      address: this.address,
      type: this.type,
      contentUrls: [],
    }
  }
}

export { Connection }
