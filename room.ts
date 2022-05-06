import { RoomClient } from './roomClients'
import { Diograph } from '.'
import { ConnectionObject } from './types'
import { Connection } from './connection'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  connected: boolean
  connections: Connection[] = []
  connectionData: ConnectionObject[] = []
  roomClient: RoomClient
  diograph?: Diograph
  contentUrls: ContentUrls = {}

  constructor(address: string, roomClient: RoomClient) {
    this.address = address
    this.connected = false
    this.roomClient = roomClient
  }

  loadOrInitiateRoom = async () => {
    try {
      await this.roomClient.verifyAndConnect()
      this.connected = true
      await this.loadRoom()
    } catch (e) {
      await this.initiateRoom()
    }
  }

  loadRoom = async () => {
    this.connected = await this.roomClient.verifyAndConnect()
    if (!this.connected) {
      throw new Error("Can't load room before it's connected!")
    }
    const roomJsonContents = await this.roomClient.loadRoom()
    const { diographUrl, contentUrls, clients } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    this.connectionData = clients
    this.diograph = new Diograph(diographUrl, this)
    await this.diograph.loadDiograph()
  }

  initiateRoom = async () => {
    const defaultRoomJson = JSON.stringify({
      diographUrl: 'diograph.json',
      clients: [],
    })

    const defaultDiograph = new Diograph()
    defaultDiograph.setDiograph({
      'some-diory-id': {
        id: 'some-diory-id',
        text: 'Root diory',
      },
    })

    await this.roomClient.initiateRoom(defaultRoomJson, defaultDiograph)
    await this.loadRoom()
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

  saveRoom = async () => {
    // TODO: Make RoomJson an object with .toJson()
    // Room.json
    const roomJson = {
      diographUrl: this.address,
      clients: this.connections.map((connection) => connection.toConnectionObject()),
    }
    await this.roomClient.writeTextItem(
      this.roomClient.roomJsonPath,
      JSON.stringify(roomJson, null, 2),
    )

    // Diograph.json
    if (!this.diograph) {
      throw new Error("Can't saveRoom: no this.diograph")
    }
    await this.diograph.saveDiograph()
  }

  deleteRoom = async () => {
    await this.roomClient.deleteItem(this.roomClient.roomJsonPath)
    await this.roomClient.deleteItem(this.roomClient.diographPath)
    // this.roomClient.deleteItem(this.roomClient.imageFolderPath)
  }
}

export { Room }
