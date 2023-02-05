import { Diory } from './diory'

import { allKeysExist, allMatchToQuery, reduceToDiographObject } from './utils'
import { isDiographRoot, getDiographRoot, setDiographRoot } from './diographRootUtils'
import { throwErrorIfDioryAlreadyExists, throwErrorIfDioryNotFound } from './throwErrors'

import { IDiory, IDioryObject, IDiograph, IDiographObject, IDioryProps } from './types'

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}

  constructor(diographObject?: IDiographObject) {
    this.addDiograph(diographObject)
  }

  addDiograph = (diographObject: IDiographObject = {}): IDiograph => {
    Object.entries(diographObject).forEach(([id, dioryObject]) => {
      try {
        if (!isDiographRoot(dioryObject)) {
          this.addDiory({ ...dioryObject, id })
        }
      } catch (error) {
        console.error(error)
      }
    })

    try {
      this.setRoot(getDiographRoot(diographObject))
    } catch (error) {
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

  addDiory = (diory: IDioryProps | IDioryObject | IDiory): IDiory => {
    if ('id' in diory) {
      throwErrorIfDioryAlreadyExists('addDiory', diory, this.diograph)
    }

    const addedDiory: IDiory = diory instanceof Diory ? diory : new Diory(diory)
    return (this.diograph[addedDiory.id] = addedDiory)
  }

  getDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('getDiory', dioryObject, this.diograph)

    return this.diograph[dioryObject.id]
  }

  updateDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('updateDiory', dioryObject, this.diograph)

    return this.getDiory(dioryObject).update(dioryObject)
  }

  removeDiory = (dioryObject: IDioryObject): boolean => {
    throwErrorIfDioryNotFound('removeDiory', dioryObject, this.diograph)

    return delete this.diograph[dioryObject.id]
  }

  addDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('addDioryLink:diory', dioryObject, this.diograph)
    throwErrorIfDioryNotFound('addDioryLink:linkedDiory', linkedDioryObject, this.diograph)

    return this.getDiory(dioryObject).addLink(linkedDioryObject)
  }

  removeDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('removeDioryLink:diory', dioryObject, this.diograph)
    throwErrorIfDioryNotFound('removeDioryLink:link', linkedDioryObject, this.diograph)

    return this.getDiory(dioryObject).removeLink(linkedDioryObject)
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
