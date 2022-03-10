import { DiographJsonParams } from './types'
import { Connector, LocalConnector } from './connectors'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  contentUrls: ContentUrls = {}
  connector: Connector

  constructor({ baseUrl }: DiographJsonParams, connector?: Connector) {
    this.connector = connector || new LocalConnector(baseUrl)
  }

  load = async () => {
    const roomJsonContents = await this.connector.loadRoom()
    const { contentUrls } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
  }

  getDataobject = async function getDataobject(this: Room, contentUrl: string): Promise<Buffer> {
    return this.connector.getDataobject(contentUrl)
  }

  createDataobject = async function createDataobject(
    this: Room,
    sourceFileContent: Buffer,
    diory: string,
  ): Promise<string> {
    return this.connector.writeDataobject(sourceFileContent, diory)
  }

  deleteDataobject = function deleteDataobject(this: Room, contentUrl: string) {
    return this.connector.deleteDataobject(contentUrl)
  }
}

export { Room }
