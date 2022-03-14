import { RoomConnector } from './roomConnectors'
import { Connector } from './connectors'
import { DiographJson } from '.'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  connectors: Connector[] = []
  connector: RoomConnector
  diograph: DiographJson | undefined
  contentUrls: ContentUrls = {}

  constructor(connector: RoomConnector) {
    this.connector = connector
  }

  loadRoom = async () => {
    const roomJsonContents = await this.connector.loadRoom()
    const { diographUrl, contentUrls, connectors } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
    this.connectors = connectors
    this.diograph = new DiographJson(diographUrl, this.connector)
  }
}

export { Room }
