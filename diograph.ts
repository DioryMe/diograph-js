import { Diory } from './diory'
import { allKeysExist, allMatchToQuery, reduceToDiographObject } from './utils'
import { IDiory, IDioryObject, IDiograph, IDiographObject, IDioryProps } from './types'

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}

  constructor(diographObject: IDiographObject) {
    this.addDiograph(diographObject)
  }

  addDiograph = (diographObject: IDiographObject = {}): IDiograph => {
    Object.entries(diographObject).forEach(([id, dioryObject]) => {
      try {
        this.addDiory({ ...dioryObject, id })
      } catch(error) {
        console.error(error)
      }
    })
    return this
  }

  queryDiograph = (queryDiory: IDioryProps): IDiograph => {
    const diographObject: IDiographObject = Object.values(this.diograph)
      .filter(allKeysExist(queryDiory))
      .filter(allMatchToQuery(queryDiory))
      .reduce(reduceToDiographObject, {})
    return new Diograph(diographObject)
  }

  resetDiograph = (): IDiograph => {
    this.diograph = {}
    return this
  }

  private throwDioryNotFoundError = (method: string, dioryObject: IDioryObject): void => {
    if (this.diograph[dioryObject.id]) {
      return
    }
    throw new Error(`${method}: Diory not found ${JSON.stringify(dioryObject, null, 2)}`)
  }

  private throwAlreadyDioryExistsError = (method: string, dioryObject: IDioryObject): void => {
    if (!this.diograph[dioryObject.id]) {
      return
    }
    throw new Error(`${method}: Diory already exists ${JSON.stringify(dioryObject, null, 2)}`)
  }

  addDiory = (dioryObject: IDioryObject): IDiory => {
    this.throwAlreadyDioryExistsError('addDiory', dioryObject)
    return this.diograph[dioryObject.id] = new Diory(dioryObject)
  }

  createDiory = (dioryProps: IDioryProps): IDiory => {
    const newDiory: IDiory = new Diory(dioryProps)
    return this.diograph[newDiory.id] = newDiory
  }

  getDiory = (dioryObject: IDioryObject): IDiory => {
    this.throwDioryNotFoundError('getDiory', dioryObject)
    return this.diograph[dioryObject.id]
  }

  updateDiory = (dioryObject: IDioryObject): IDiory => {
    this.throwDioryNotFoundError('updateDiory', dioryObject)
    return this.diograph[dioryObject.id].update(dioryObject)
  }

  deleteDiory = (dioryObject: IDioryObject): boolean => {
    this.throwDioryNotFoundError('deleteDiory', dioryObject)
    return delete this.diograph[dioryObject.id]
  }

  createLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    this.throwDioryNotFoundError('createLink:diory', dioryObject)
    return this.diograph[dioryObject.id].createLink(linkedDioryObject)
  }

  deleteLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    this.throwDioryNotFoundError('deleteLink:diory', dioryObject)
    this.throwDioryNotFoundError('deleteLink:link', linkedDioryObject)
    return this.diograph[dioryObject.id].deleteLink(linkedDioryObject)
  }

  toObject = (): IDiographObject => {
    const diographObject: IDiographObject = {}
    Object.entries(this.diograph).forEach(([id, diory]) => {
      diographObject[id] = diory.toObject()
    })
    return diographObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diograph }
