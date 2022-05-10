import { RoomClient } from './roomClients'
import { Diograph } from '.'
import { ConnectionObject } from './types'
import { Connection } from './connection'
import { join } from 'path'

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
    const { diographUrl, contentUrls, connections } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    this.connectionData = connections
    this.diograph = new Diograph(diographUrl, this)
    await this.diograph.loadDiograph()
  }

  initiateRoom = async () => {
    const defaultRoomJson = JSON.stringify({
      diographUrl: 'diograph.json',
      connections: [],
    })

    const defaultDiograph = new Diograph()
    defaultDiograph.setDiograph({
      'some-diory-id': {
        id: 'some-diory-id',
        text: 'Root diory',
      },
    })

    await this.roomClient.initiateRoom(defaultRoomJson, defaultDiograph)

    const connection = new Connection({
      address: join(this.address, 'Diory Content'),
      type: 'local',
    })
    this.addConnection(connection)
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

  getContent = (contentUrl: string) => {
    for (let i = 0; ; i++) {
      const connection = this.connections[i]
      if (connection.contentUrls[contentUrl]) {
        return join(connection.address, connection.contentUrls[contentUrl].internalPath)
      }
    }
  }

  toRoomObject = () => {
    return {
      diographUrl: this.address,
      connections: this.connections.map((connection) => connection.toConnectionObject()),
    }
  }

  saveRoom = async () => {
    // TODO: Make RoomJson an object with .toJson()
    // Room.json
    await this.roomClient.writeTextItem(
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
    await this.roomClient.deleteItem(this.roomClient.roomJsonPath)
    await this.roomClient.deleteItem(this.roomClient.diographPath)
    // this.roomClient.deleteItem(this.roomClient.imageFolderPath)
  }
}

export { Room }
