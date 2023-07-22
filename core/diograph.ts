import { DiographObject } from '../types'
import { Diory } from './diory'
// import { createDiory, getDiory, getDioryWithLinks, search, update, deleteDiory } from '../api'

function getDiory(this: Diograph, id: string): Diory {
  const foundDiories = this.diories.filter((diory) => diory.id === id)
  if (!foundDiories.length) {
    throw new Error(`getDiory failed: no diory find with id ${id}`)
  }
  return foundDiories[0]
}

class Diograph {
  rootId: string = ''
  diories: Diory[] = []

  // createDiory = createDiory
  getDiory = getDiory
  // getDioryWithLinks = getDioryWithLinks
  // update = update
  // search = search
  // deleteDiory = deleteDiory

  constructor() {}

  fromDiographObjectToDiories = (diograph: DiographObject) => {
    return Object.values(diograph).map((dioryObject) => new Diory(dioryObject))
  }

  mergeDiograph = (diograph: DiographObject, rootId?: string) => {
    if (diograph.rootId) {
      throw new Error('Invalid DiographObject: includes rootId')
    }
    this.fromDiographObjectToDiories(diograph).forEach((diory) => diory && this.addDiory(diory))
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  loadDiograph = async (roomClient: any) => {
    this.diories = []
    const diographContents = await roomClient.readDiograph()
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const { diograph, rootId } = JSON.parse(diographContents)
    if (diograph && Object.keys(diograph).length) {
      this.mergeDiograph(diograph, rootId)
    }
  }

  saveDiograph = async (roomClient: any) => {
    await roomClient.saveDiograph(this.toJson())
  }

  addDiory = (diory: Diory) => {
    const existingWithSameId = this.diories.filter((diographDiory) => diographDiory.id === diory.id)
    if (existingWithSameId.length) {
      return
    }
    this.diories.push(diory)
  }

  toObject = (): DiographObject => {
    const diographObject: DiographObject = {}
    this.diories.forEach((diory) => {
      diographObject[diory.id] = diory.toObject()
    })
    return diographObject
  }

  toJson = (): string => {
    const diographJsonObject = { rootId: this.rootId, diograph: this.toObject() }
    return JSON.stringify(diographJsonObject, null, 2)
  }
}

export { Diograph }
