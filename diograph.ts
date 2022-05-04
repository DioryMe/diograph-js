import { DiographObject } from './types'
import { Diory } from './diory'
import { RoomClient } from './roomClients'
import { createDiory, getDiory, getDioryWithLinks, search, update, deleteDiory } from './api'

class Diograph {
  client?: RoomClient
  rootId: string = ''
  diories: Diory[] = []
  // REMOVE ME: Only tests use me
  diograph: DiographObject = {}
  diographUrl?: string

  createDiory = createDiory
  getDiory = getDiory
  getDioryWithLinks = getDioryWithLinks
  update = update
  search = search
  deleteDiory = deleteDiory

  constructor(diographUrl?: string, client?: RoomClient) {
    this.diographUrl = diographUrl
    this.client = client
  }

  setDiograph = (diograph: DiographObject, rootId?: string) => {
    this.diories = Object.values(diograph).map((dioryObject) => new Diory(dioryObject))
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
    // REMOVE ME: Only tests use me
    this.diograph = diograph
  }

  mergeDiograph = (diograph: DiographObject) => {
    Object.values(diograph).forEach((dioryObject) => this.addDiory(new Diory(dioryObject)))
  }

  loadDiograph = async () => {
    if (!this.client) {
      throw new Error("Client missing, can't load diograph")
    }

    const diographContents = await this.client.readDiograph()
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const { diograph, rootId } = JSON.parse(diographContents)

    this.setDiograph(diograph, rootId)
  }

  saveDiograph = () => {
    if (!this.client) {
      throw new Error("Client missing, can't save diograph")
    }

    const dioriesWithThumbnails = this.diories.filter((diory) => diory.thumbnailBuffer)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    return Promise.all([
      this.client.writeTextItem(this.client.diographPath, this.toJson()),
      dioriesWithThumbnails.map(
        (diory) =>
          diory.thumbnailBuffer && this.client?.addThumbnail(diory.thumbnailBuffer, diory.id),
      ),
    ])
  }

  addDiory = (diory: Diory) => {
    this.diories.push(diory)
  }

  toDiographObject = (): DiographObject => {
    const diographObject: DiographObject = {}
    this.diories.forEach((diory) => {
      diographObject[diory.id] = diory.toDioryObject()
    })
    return diographObject
  }

  toJson = (): string => {
    const diographJsonObject = { rootId: this.rootId, diograph: this.toDiographObject() }
    return JSON.stringify(diographJsonObject, null, 2)
  }
}

export { Diograph }
