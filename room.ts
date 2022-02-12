import { DiographJsonParams } from './types'
import { readFile, writeFile, rm } from 'fs/promises'
import { join } from 'path'

export interface ContentUrls {
  [key: string]: string
}

class Room {
  baseUrl: string
  roomJsonPath: string
  contentUrls: ContentUrls = {}

  constructor({ baseUrl }: DiographJsonParams) {
    this.baseUrl = baseUrl
    this.roomJsonPath = join(baseUrl, 'room.json')
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
    const filePath: string | undefined = this.contentUrls[contentUrl]
    if (!filePath) {
      throw new Error('Dataobject not found!')
    }
    return readFile(filePath)
  }

  // importDataobject?
  copyDataobject = async function copyDataobject(
    this: Room,
    contentUrl: string,
    destinationPath: string,
  ): Promise<void> {
    const content = await this.getDataobject(contentUrl)
    return writeFile(destinationPath, content)
  }

  // Import dataobject
  // - const dataobjectPath = getInternalPath(diory)
  // - const dataobject = new Dataobject(filePath)
  // - dataobject.copy(dataobjectPath)

  // - diograph.update(diory.id, { contentUrl: dataobjectPath })

  getFilePath = function getFilePath(this: Room, contentUrl: string) {
    return join(this.baseUrl, contentUrl)
  }

  deleteDataobject = function deleteDataobject(this: Room, contentUrl: string) {
    const filePath: string = this.getFilePath(contentUrl) // this.contentUrls[contentUrl]
    // TODO: This should be abstracted as "localConnector.deleteDataobject(filePath)"
    return rm(filePath)
  }

  moveDataobject = async function moveDataobject(
    this: Room,
    contentUrl: string,
    destinationPath: string,
  ) {
    await this.copyDataobject(contentUrl, destinationPath)
    await this.deleteDataobject(contentUrl)
  }
}

export { Room }
