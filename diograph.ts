import { Diory } from './diory'

import { allKeysExist, allMatchToQuery, reduceToDiographObject } from './utils'
import { isDiographRoot, getDiographRoot, setDiographRoot } from './diographRootUtils'
import { throwErrorIfDioryAlreadyExists, throwErrorIfDioryNotFound } from './throwErrors'

import { IDiory, IDioryObject, IDiograph, IDiographObject, IDioryProps } from './types'

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}

  constructor(diographObject: IDiographObject) {
    this.addDiograph(diographObject)
  }

  addDiograph = (diographObject: IDiographObject = {}): IDiograph => {
    Object.entries(diographObject).forEach(([id, dioryObject]) => {
      try {
        if (!isDiographRoot(dioryObject)) {
          this.addDiory({ ...dioryObject, id })
        }
      } catch(error) {
        console.error(error)
      }
    })

    try {
      this.setRoot(getDiographRoot(diographObject))
    } catch(error) {
      console.error(error)
    }

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

  setRoot = (rootObject: IDioryObject): void => {
    throwErrorIfDioryNotFound('setRoot', rootObject, this.diograph)

    setDiographRoot(this.diograph, rootObject)
  }

  getRoot = (): IDiory => {
    const rootObject = getDiographRoot(this.diograph)
    return rootObject && this.getDiory(rootObject)
  }

  addDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryAlreadyExists('addDiory', dioryObject, this.diograph)

    return this.diograph[dioryObject.id] = new Diory(dioryObject)
  }

  createDiory = (dioryProps: IDioryProps): IDiory => {
    const newDiory: IDiory = new Diory(dioryProps)
    return this.diograph[newDiory.id] = newDiory
  }

  getDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('getDiory', dioryObject, this.diograph)

    return this.diograph[dioryObject.id]
  }

  updateDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('updateDiory', dioryObject, this.diograph)

    return this.getDiory(dioryObject).update(dioryObject)
  }

  deleteDiory = (dioryObject: IDioryObject): boolean => {
    throwErrorIfDioryNotFound('deleteDiory', dioryObject, this.diograph)

    return delete this.diograph[dioryObject.id]
  }

  createDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('createDioryLink:diory', dioryObject, this.diograph)
    throwErrorIfDioryNotFound('createDioryLink:linkedDiory', linkedDioryObject, this.diograph)

    return this.getDiory(dioryObject).createLink(linkedDioryObject)
  }

  deleteDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('deleteDioryLink:diory', dioryObject, this.diograph)
    throwErrorIfDioryNotFound('deleteDioryLink:link', linkedDioryObject, this.diograph)

    return this.getDiory(dioryObject).deleteLink(linkedDioryObject)
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
