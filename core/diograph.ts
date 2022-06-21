import { DiographObject } from '../types'
import { Diory } from './diory'
import { createDiory, getDiory, getDioryWithLinks, search, update, deleteDiory } from '../api'
import { Room } from './room'

class Diograph {
  rootId: string = ''
  diories: Diory[] = []
  diographUrl?: string

  createDiory = createDiory
  getDiory = getDiory
  getDioryWithLinks = getDioryWithLinks
  update = update
  search = search
  deleteDiory = deleteDiory

  constructor(diographUrl?: string, room?: Room) {
    this.diographUrl = diographUrl
  }

  fromDiographObjectToDiories = (diograph: DiographObject) => {
    return Object.values(diograph).map((dioryObject) => new Diory(dioryObject))
  }

  mergeDiograph = (diograph: DiographObject, rootId?: string) => {
    this.fromDiographObjectToDiories(diograph).forEach((diory) => diory && this.addDiory(diory))
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  loadDiograph = async (roomClient: any) => {
    const diographContents = await roomClient.readDiograph()
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const { diograph, rootId } = JSON.parse(diographContents)
    if (diograph && Object.keys(diograph).length) {
      this.mergeDiograph(diograph, rootId)
    }
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
