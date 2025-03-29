import { IDiograph, IDiory, IDioryObject, IDioryProps, IDiographObject } from '../types'

import { Diory } from '../diory/diory'

import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'

function isDioryAlias(dioryObject: IDioryObject, diory: IDiory) {
  return dioryObject.id !== diory.id
}

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}
  callback: () => void = () => {}

  constructor(callback?: () => void) {
    if (callback) {
      this.callback = callback
    }
  }

  addDiograph = (diograph: IDiographObject): IDiograph => {
    Object.entries(diograph).forEach(([key, dioryObject]) => {
      try {
        this.diograph[key] = new Diory(dioryObject, this.callback)
      } catch (error) {
        console.error(error)
      }
    })

    return this
  }

  resetDiograph = (): IDiograph => {
    this.diograph = {}
    return this
  }

  getDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('getDiory', dioryObject.id, Object.keys(this.diograph))

    const diory = this.diograph[dioryObject.id]
    if (isDioryAlias(dioryObject, diory)) {
      throwErrorIfNotFound('getDiory - alias', diory.id, Object.keys(this.diograph))
      return this.diograph[diory.id]
    }

    return diory
  }

  addDiory = (dioryObject: IDioryProps | IDioryObject, key?: string): IDiory => {
    const diory: IDiory =
      'id' in dioryObject && this.diograph[dioryObject.id]
        ? this.getDiory(dioryObject)
        : new Diory(dioryObject, this.callback)

    if (key) {
      const { id, created, modified } = diory
      this.diograph[key] = new Diory({ id, created, modified }, this.callback)
    }

    if (!this.diograph[diory.id]) {
      this.diograph[diory.id] = diory
    }

    this.callback()

    return diory
  }

  removeDiory = (dioryObject: IDioryObject): void => {
    throwErrorIfNotFound('removeDiory', dioryObject.id, Object.keys(this.diograph))

    delete this.diograph[dioryObject.id]

    this.callback()
  }

  toObject = (): IDiographObject => {
    const diograph: IDiographObject = {}
    Object.entries(this.diograph).forEach(([id, diory]) => {
      diograph[id] = diory.toObject()
    })

    return diograph
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diograph }
