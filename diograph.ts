import { Diograph } from './types'
import { RoomClient } from './roomClients'
import {
  createDiory,
  getDiory,
  getDioryWithLinks,
  search,
  update,
  deleteDiory,
  importDioryFromFile,
  importFolder,
} from './api'

class DiographJson {
  client: RoomClient | undefined
  rootId: string = ''
  diograph: Diograph = {}
  diographUrl: string

  createDiory = createDiory
  getDiory = getDiory
  getDioryWithLinks = getDioryWithLinks
  update = update
  search = search
  deleteDiory = deleteDiory
  importDioryFromFile = importDioryFromFile
  importFolder = importFolder

  constructor(diographUrl: string, client?: RoomClient) {
    this.diographUrl = diographUrl
    this.client = client
  }

  setDiograph = (diograph: Diograph, rootId?: string) => {
    this.diograph = diograph
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  loadDiograph = async () => {
    if (!this.client) {
      throw new Error("Client missing, can't load diograph")
    }

    const diographJsonContents = await this.client.readDiograph()
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const { diograph, rootId } = JSON.parse(diographJsonContents)

    this.rootId = rootId
    this.diograph = diograph
  }

  saveDiograph = () => {
    if (!this.client) {
      throw new Error("Client missing, can't save diograph")
    }

    const diographJsonContents = {
      rootId: this.rootId,
      diograph: this.diograph,
    }

    const diographFileContents = JSON.stringify(diographJsonContents, null, 2)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    return this.client.saveDiograph(diographFileContents)
  }

  toJson = () => {
    return { rootId: this.rootId, diograph: this.diograph }
  }
}

export { DiographJson }
