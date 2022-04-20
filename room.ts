import { RoomClient } from './roomClients'
import { Client, LocalClient } from './clients'
import { DiographJson } from '.'
import { join } from 'path'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  connected: boolean
  clients: Client[] = []
  roomClient: RoomClient
  diograph: DiographJson | undefined
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
      this.initiateRoom()
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
    this.clients = clients.map((config: any) => {
      return new LocalClient(join(this.address, config.address))
    })
    this.diograph = new DiographJson(diographUrl, this.roomClient)
  }

  initiateRoom = async () => {
    const defaultRoomJson = JSON.stringify({
      diographUrl: 'diograph.json',
      clients: [
        {
          id: 'abc-123',
          address: '.',
          contentUrls: {},
        },
      ],
    })

    const defaultDiographJson = JSON.stringify({
      rootId: 'abc-123',
      diograph: {
        id: 'abc-123',
        text: 'Root diory',
      },
    })

    this.roomClient.initiateRoom(defaultRoomJson, defaultDiographJson)
  }

  saveRoom = async () => {
    // this.roomClient.writeTextItem(this.roomClient.roomJsonPath, this.roomJson)
    // this.roomClient.writeTextItem(this.roomClient.diographJsonPath, this.diographJson)
  }

  deleteRoom = async () => {
    await this.roomClient.deleteItem(this.roomClient.roomJsonPath)
    await this.roomClient.deleteItem(this.roomClient.diographJsonPath)
    // this.roomClient.deleteItem(this.roomClient.imageFolderPath)
  }
}

export { Room }
