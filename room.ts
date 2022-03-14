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
}

export { Room }
