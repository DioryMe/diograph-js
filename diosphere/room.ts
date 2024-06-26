import { RoomClient } from './roomClient'
import { Diograph } from '../diograph/diograph'
import { ConnectionClientList, ConnectionData, IDiographObject, RoomObject } from '../types'
import { Connection, ContentNotFoundError } from './connection'
import { validateConnectionData } from '../validator'

class Room {
  diograph: Diograph
  connections: Connection[] = []
  address?: string
  roomClient?: RoomClient
  roomClientType?: string

  constructor(roomClient?: RoomClient) {
    if (roomClient) {
      this.defineRoomClient(roomClient)
    }
    this.diograph = new Diograph()
  }

  defineRoomClient = (roomClient: RoomClient) => {
    this.address = roomClient.address
    this.roomClient = roomClient
    this.roomClientType = roomClient.client.constructor.name
  }

  // Initiation needs connections & diographObject (or defaults are used)
  // Loading needs room client to read the room.json
  //    - validate room.json (or wherever the connections are stored)
  loadOrInitiateRoom = async (
    clients: ConnectionClientList,
    connectionData?: ConnectionData[],
    diographObject?: IDiographObject,
  ) => {
    const getConnectionData = async () => {
      // 1. Get connections from arguments
      if (connectionData) {
        connectionData.forEach((connectionData: ConnectionData) => {
          validateConnectionData(connectionData)
        })
        return connectionData
      }

      // 2. Load from room.json with roomClient
      if (this.roomClient) {
        let roomJsonContents
        try {
          roomJsonContents = await this.roomClient.readRoomJson()
        } catch {
          await this.saveRoom()
          roomJsonContents = await this.roomClient.readRoomJson()
        }
        const roomJsonObject = JSON.parse(roomJsonContents)

        roomJsonObject.connections.forEach((connectionData: ConnectionData) => {
          validateConnectionData(connectionData)
        })

        return roomJsonObject.connections as ConnectionData[]
      }

      // 3. Error if connectionData not given as arguments or roomClient not defined
      throw new Error(
        "Can't loadOrInitiateRoom: no connections defined, use connections or roomClient",
      )
    }

    // I. Load connections
    const connectionDatas = (await getConnectionData()) || []
    // this.connections = []
    connectionDatas.forEach((connectionData: ConnectionData) => {
      // a. Load client from availableClients
      const clientData = clients[connectionData.contentClientType]
      if (!clientData) {
        throw new Error(
          `loadOrInitiateRoom: Unknown clientType or incomplete availableClients data for ${connectionData.contentClientType}`,
        )
      }

      // b. Create connection
      const connection = new Connection(
        new clientData.clientConstructor(connectionData.address, clientData.credentials),
        connectionData,
      )

      // c. Add connection to room
      this.addConnection(connection)
    })

    // II. Load diograph
    const loadDiograph = async () => {
      // 1. Get diograph from arguments
      if (diographObject) {
        this.diograph.initialise(diographObject)
        return
      }
      // 2. Load diograph with roomClient (from diograph.json)
      if (this.roomClient) {
        this.diograph = new Diograph()
        await this.diograph.loadDiograph(this.roomClient)
        return
      }
      // 3. Use default diograph
      const defaultDiographJson = {
        '/': {
          id: '/',
          image:
            'data:image/jpeg;base64,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',
          text: 'Root',
          created: '2021-09-29T08:00:00.000Z',
          modified: '2021-09-29T08:00:00.000Z',
        },
      }
      this.diograph.initialise(defaultDiographJson)
    }

    await loadDiograph()

    // III. Save room
    if (this.roomClient) {
      await this.saveRoom()
    }
  }

  loadRoom = async (clients: ConnectionClientList) => {
    console.log('DEPRECATED: loadRoom is deprecated, use loadOrInitiateRoom instead')

    if (!this.roomClient) {
      throw new Error("Can't loadRoom: no roomClient defined, use defineRoomClient to define it")
    }

    // Room
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const roomJsonContents = await this.roomClient.readRoomJson()
    const { connections } = JSON.parse(roomJsonContents)

    // Connections
    this.connections = []
    connections.forEach((connectionData: ConnectionData) => {
      const clientData = clients[connectionData.contentClientType]
      const connection = new Connection(
        new clientData.clientConstructor(connectionData.address, clientData.credentials),
        connectionData,
      )
      this.addConnection(connection)
    })

    // Diograph
    this.diograph = new Diograph()
    await this.diograph.loadDiograph(this.roomClient)
  }

  initiateRoom = (
    clients: ConnectionClientList,
    connections?: ConnectionData[],
    diographObject?: IDiographObject,
  ) => {
    console.log('DEPRECATED: loadRoom is deprecated, use loadOrInitiateRoom instead')

    // Connections
    if (connections) {
      this.connections = []
      connections.forEach((connectionData: ConnectionData) => {
        const clientData = clients[connectionData.contentClientType]
        const connection = new Connection(
          new clientData.clientConstructor(connectionData.address, clientData.credentials),
          connectionData,
        )
        this.addConnection(connection)
      })
    }

    // Diograph
    // TODO: Move to a better place
    const defaultDiographJson = {
      '/': {
        id: '/',
        image:
          'data:image/jpeg;base64,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',
        text: 'Root',
        created: '2021-09-29T08:00:00.000Z',
        modified: '2021-09-29T08:00:00.000Z',
      },
    }

    this.diograph = new Diograph()
    if (diographObject) {
      this.diograph.initialise(diographObject)
    } else {
      this.diograph.initialise(defaultDiographJson)
    }
  }

  findConnection = (connectionAddress: string): Connection | undefined => {
    return this.connections.find(
      (existingConnection) => existingConnection.address === connectionAddress,
    )
  }

  addConnection = (connection: Connection) => {
    const existingConnection = this.findConnection(connection.address)

    if (!existingConnection) {
      this.connections.push(connection)
      return connection
    }
    return existingConnection
  }

  removeConnection = (connection: Connection) => {
    const existingConnection = this.findConnection(connection.address)

    if (!existingConnection) {
      console.log("Couldn't find the connection")
      return false
    }

    this.connections = this.connections.filter(
      (existingConnection) => existingConnection.address !== connection.address,
    )

    return true
  }

  readContent = async (contentUrl: string) => {
    for (let i = 0; i < this.connections.length; i++) {
      try {
        const found = await this.connections[i].readContent(contentUrl)
        return found
      } catch (e) {
        if (e instanceof ContentNotFoundError) {
          continue
        }
        throw e
      }
    }
    throw new ContentNotFoundError('Nothing found with that contentUrl!')
  }

  addContent = async (fileContent: ArrayBuffer | string, contentId: string) => {
    const nativeConnection = this.connections[0]
    if (!nativeConnection) {
      throw new Error('Calling room.addContent without any connections in room')
    }
    return nativeConnection.addContent(fileContent, contentId)
  }

  toObject = (): RoomObject => {
    return {
      connections: this.connections.map((connection) => connection.toObject()),
      // diograph: this.diograph.toObject(),
    }
  }

  toJson = () => {
    return JSON.stringify(this.toObject(), null, 2)
  }

  saveRoom = async () => {
    if (!this.roomClient) {
      throw new Error("Can't saveRoom: no roomClient defined, use defineRoomClient to define it")
    }

    await this.roomClient.saveRoomJson(this.toJson())
    await this.diograph.saveDiograph(this.roomClient)
  }

  deleteRoom = async () => {
    if (!this.roomClient) {
      throw new Error("Can't deleteRoom: no roomClient defined, use defineRoomClient to define it")
    }

    // Delete room.json, diograph.json and room folder
    await this.roomClient.deleteRoomJson()
    await this.roomClient.deleteDiographJson()
    // client.address and this.address are the same
    await this.roomClient.client.deleteFolder('')
  }
}

export { Room }
