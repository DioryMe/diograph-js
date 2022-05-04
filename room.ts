import { RoomClient } from './roomClients'
import { Client, LocalClient } from './clients'
import { Diograph } from '.'
import { ConnectionData } from './types'
import { Connection } from './connection'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  connected: boolean
  connections: Connection[] = []
  connectionData: ConnectionData[] = []
  roomClient: RoomClient
  diograph: Diograph | undefined
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
    this.diograph = new Diograph(diographUrl, this.roomClient)
    await this.diograph.loadDiograph()
  }

  initiateRoom = async () => {
    const defaultRoomJson = JSON.stringify({
      diographUrl: 'diograph.json',
      clients: [],
    })

    const defaultDiograph = JSON.stringify({
      rootId: 'some-diory-id',
      diograph: {
        'some-diory-id': {
          id: 'some-diory-id',
          text: 'Root diory',
        },
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
    // Room.json
    const roomJson = {
      diographUrl: this.address,
      clients: this.connections.map((connection) => connection.toJson()),
    }
    await this.roomClient.writeTextItem(
      this.roomClient.roomJsonPath,
      JSON.stringify(roomJson, null, 2),
    )

    // Diograph.json
    const diographJson = this.diograph && this.diograph.toJson()
    await this.roomClient.writeTextItem(
      this.roomClient.diographJsonPath,
      JSON.stringify(diographJson, null, 2),
    )
  }

  deleteRoom = async () => {
    await this.roomClient.deleteItem(this.roomClient.roomJsonPath)
    await this.roomClient.deleteItem(this.roomClient.diographJsonPath)
    // this.roomClient.deleteItem(this.roomClient.imageFolderPath)
  }
}

export { Room }
