import { DiographJsonParams } from './types'
import { LocalConnector } from './connectors'
import { readFile, writeFile, rm } from 'fs/promises'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  contentUrls: ContentUrls = {}
  connector: LocalConnector

  constructor({ baseUrl }: DiographJsonParams, connector?: LocalConnector) {
    this.connector = connector || new LocalConnector(baseUrl)
  }

  load = async () => {
    const roomJsonContents = await this.connector.loadRoom()
    const { contentUrls } = JSON.parse(roomJsonContents)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    this.contentUrls = contentUrls
  }

  getDataobject = async function getDataobject(this: Room, contentUrl: string): Promise<Buffer> {
    const filePath: string | undefined = this.connector.getFilePath(contentUrl)
    if (!filePath) {
      throw new Error('Dataobject not found!')
    }
    return readFile(filePath)
  }

  importDataobject = async function importDataobject(
    this: Room,
    sourcePath: string,
    contentUrl: string,
  ): Promise<void> {
    const sourceFileContent: Buffer = await readFile(sourcePath)
    return writeFile(this.connector.getFilePath(contentUrl), sourceFileContent)
  }

  // Import dataobject
  // - const dataobjectPath = getInternalPath(diory)
  // - const dataobject = new Dataobject(filePath)
  // - dataobject.copy(dataobjectPath)

  // - diograph.update(diory.id, { contentUrl: dataobjectPath })

  deleteDataobject = function deleteDataobject(this: Room, contentUrl: string) {
    const filePath: string = this.connector.getFilePath(contentUrl)
    // TODO: This should be abstracted as "localConnector.deleteDataobject(filePath)"
    return rm(filePath)
  }
}

export { Room }
