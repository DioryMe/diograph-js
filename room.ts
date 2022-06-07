import { RoomClient } from './clients/roomClient'
import { Diograph } from '.'
import { ConnectionObject } from './types'
import { Connection } from './connection'
import { join } from 'path'
import { Diory } from './diory'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  connections: Connection[] = []
  roomClient: RoomClient
  diograph?: Diograph
  contentUrls: ContentUrls = {}
  loaded: Boolean = false

  constructor(roomClient: RoomClient) {
    this.address = roomClient.address
    this.roomClient = roomClient
    this.diograph = new Diograph(undefined, this)
  }

  retrieveContent = (diory: any) => {
    const contentId = ((diory.data && diory.data[0]) || {}).contentUrl
    const dioryDup = new Diory(diory.toDioryObject())
    dioryDup.contentUrl = this.getContent(contentId)
    return dioryDup
  }

  loadRoom = async () => {
    const roomJsonContents = await this.roomClient.loadRoom()
    const { diographUrl, contentUrls, connections } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    connections.forEach((connectionData: ConnectionObject) => {
      const connection = new Connection({
        id: connectionData.id,
        address: join(this.address, connectionData.address),
        type: connectionData.type,
        contentUrls: connectionData.contentUrls,
      })
      this.addConnection(connection)
    })
    this.diograph = new Diograph(diographUrl, this)
    await this.diograph.loadDiograph()
    this.loaded = true
  }

  addConnection = (connection: Connection) => {
    const existingConnection = this.connections.find(
      (existingConnection) => existingConnection.address === connection.address,
    )
    if (!existingConnection) {
      this.connections.push(connection)
      return connection
    }
    return existingConnection
  }

  getContent = (contentUrl: string) => {
    for (let i = 0; i < this.connections.length; i++) {
      const connection = this.connections[i]
      if (connection.contentUrls[contentUrl]) {
        return join(connection.address, connection.contentUrls[contentUrl].internalPath)
      }
    }
  }

  toRoomObject = () => {
    if (!this.loaded) {
      return {}
    }
    return {
      diographUrl: this.diograph?.diographUrl,
      connections: this.connections.map((connection) =>
        connection.toConnectionObject(this.address),
      ),
    }
  }

  saveRoom = async () => {
    // Connection contentUrls
    const diories: Diory[] = []

    this.connections.forEach((connection) => {
      Object.values(connection.contentUrls).forEach((contentUrl) => diories.push(contentUrl.diory))
    })

    const dioriesWithThumbnails = diories.filter((diory: any) => diory.thumbnailBuffer)

    await Promise.all(
      dioriesWithThumbnails.map(async (diory: any) => {
        if (diory.thumbnailBuffer) {
          const thumbnailPath = await this.roomClient.addThumbnail(diory.thumbnailBuffer, diory.id)
          diory.image = thumbnailPath
        }
      }),
    )

    // Room.json
    await this.roomClient.client.writeItem(
      this.roomClient.roomJsonPath,
      JSON.stringify(this.toRoomObject(), null, 2),
    )

    // Diograph.json
    if (!this.diograph) {
      throw new Error("Can't saveRoom: no this.diograph")
    }
    await this.diograph.saveDiograph()
  }

  deleteRoom = async () => {
    await this.roomClient.deleteRoomJson()
    await this.roomClient.deleteDiographJson()
    // this.roomClient.deleteItem(this.roomClient.imageFolderPath)
  }
}

export { Room }
