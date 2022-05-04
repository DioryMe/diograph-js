import { DiographObject } from './types'
import { Diory } from './diory'
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

class Diograph {
  client: RoomClient | undefined
  rootId: string = ''
  diograph: DiographObject = {}
  diories: Diory[] = []
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

  setDiograph = (diograph: DiographObject, rootId?: string) => {
    this.diories = Object.values(diograph).map((dioryObject) => new Diory(dioryObject))
    this.diograph = diograph
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  loadDiograph = async () => {
    if (!this.client) {
      throw new Error("Client missing, can't load diograph")
    }

    const diographContents = await this.client.readDiograph()
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const { diograph, rootId } = JSON.parse(diographContents)

    this.rootId = rootId
    this.diograph = diograph
    this.diories = Object.values(this.diograph).map((dioryObject) => new Diory(dioryObject))
  }

  saveDiograph = () => {
    if (!this.client) {
      throw new Error("Client missing, can't save diograph")
    }

    const diographFileContents = JSON.stringify(this.toJson(), null, 2)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    return this.client.saveDiograph(diographFileContents)
  }

  addDiory = (diory: Diory) => {
    this.diories.push(diory)
  }

  toJson = () => {
    const diographObject: DiographObject = {}
    this.diories.forEach((diory) => {
      diographObject[diory.id] = diory.toJson()
    })
    return { rootId: this.rootId, diograph: diographObject }
  }
}

export { Diograph }
