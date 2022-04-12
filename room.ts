import { RoomConnector } from './roomConnectors'
import { Connector, LocalConnector } from './connectors'
import { DiographJson } from '.'
import { join } from 'path'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  address: string
  connectors: Connector[] = []
  connector: RoomConnector
  diograph: DiographJson | undefined
  contentUrls: ContentUrls = {}

  constructor(address: string, connector: RoomConnector) {
    this.address = address
    this.connector = connector
  }

  loadRoom = async () => {
    const roomJsonContents = await this.connector.loadRoom()
    const { diographUrl, contentUrls, connectors } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    this.connectors = connectors.map((config: any) => {
      return new LocalConnector(join(this.address, config.address))
    })
    this.diograph = new DiographJson(diographUrl, this.connector)
  }

  initiateRoom = async () => {
    const defaultRoomJson = JSON.stringify({
      diographUrl: 'diograph.json',
      connectors: [
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

    this.connector.writeTextItem(this.connector.roomJsonPath, defaultRoomJson)
    this.connector.writeTextItem(this.connector.diographJsonPath, defaultDiographJson)
  }
}

export { Room }
