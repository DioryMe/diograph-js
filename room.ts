import { DiographJsonParams } from './types'
import { LocalConnector, Connector } from './connectors'
import { readFile, writeFile, rm } from 'fs/promises'
import { join } from 'path/posix'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  baseUrl: string
  roomJsonPath: string
  contentUrls: ContentUrls = {}
  connector: Connector

  constructor({ baseUrl }: DiographJsonParams, connector?: Connector) {
    this.baseUrl = baseUrl
    this.roomJsonPath = join(baseUrl, 'room.json')
    this.connector = connector || new LocalConnector()
  }

  load = () => {
    return readFile(this.roomJsonPath, { encoding: 'utf8' }).then((roomJsonContents) => {
      const parsedJson = JSON.parse(roomJsonContents)
      // TODO: Validate JSON with own validator.js (using ajv.js.org)
      this.baseUrl = parsedJson.baseUrl
      this.contentUrls = parsedJson.contentUrls
    })
  }

  getDataobject = async function getDataobject(this: Room, contentUrl: string): Promise<Buffer> {
    const filePath: string | undefined = this.getFilePath(contentUrl)
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
    return writeFile(this.getFilePath(contentUrl), sourceFileContent)
  }

  // Import dataobject
  // - const dataobjectPath = getInternalPath(diory)
  // - const dataobject = new Dataobject(filePath)
  // - dataobject.copy(dataobjectPath)

  // - diograph.update(diory.id, { contentUrl: dataobjectPath })

  deleteDataobject = function deleteDataobject(this: Room, contentUrl: string) {
    const filePath: string = this.getFilePath(contentUrl)
    // TODO: This should be abstracted as "localConnector.deleteDataobject(filePath)"
    return rm(filePath)
  }

  // --- CONNECTOR ---

  getFilePath = function getFilePath(this: Room, contentUrl: string) {
    return join(this.baseUrl, contentUrl)
  }
}

export { Room }
