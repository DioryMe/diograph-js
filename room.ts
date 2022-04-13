import { RoomClient } from './roomClients'
import { Client, LocalContentSourceClient } from './clients'
import { DiographJson } from '.'
import { join } from 'path'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  clients: Client[] = []
  client: RoomClient
  diograph: DiographJson | undefined
  contentUrls: ContentUrls = {}

  constructor(address: string, client: RoomClient) {
    this.address = address
    this.client = client
  }

  loadRoom = async () => {
    const roomJsonContents = await this.client.loadRoom()
    const { diographUrl, contentUrls, clients } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    this.clients = clients.map((config: any) => {
      return new LocalContentSourceClient(join(this.address, config.address))
    })
    this.diograph = new DiographJson(diographUrl, this.client)
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

    this.client.writeTextItem(this.client.roomJsonPath, defaultRoomJson)
    this.client.writeTextItem(this.client.diographJsonPath, defaultDiographJson)
  }
}

export { Room }
