import {
  IDiory,
  IDioryObject,
  IDiograph,
  IDioriesObject,
  IDioryProps,
  IDiographObject,
} from '../types'

import { Diory } from '../diory/diory'

import { queryDiories } from '../utils/queryDiories'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'

class Diograph implements IDiograph {
  diories: { [index: string]: IDiory } = {}

  constructor(diograph?: IDiographObject) {
    if (diograph) {
      this.initialise(diograph)
    }
  }

  initialise = (diograph: IDiographObject): IDiograph => {
    const { diories } = diograph
    Object.entries(diories).forEach(([key, dioryObject]) => {
      try {
        this.diories[key] = new Diory(dioryObject)
      } catch (error) {
        console.error(error)
      }
    })

    return this
  }

  queryDiories = (queryDiory: IDioryProps): IDiograph => {
    const diories: IDioriesObject = queryDiories(queryDiory, this.toObject().diories)
    return new Diograph({ diories })
  }

  resetDiories = (): IDiograph => {
    this.diories = {}
    return this
  }

  getDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('getDiory', dioryObject.id, Object.keys(this.diories))

    const diory = this.diories[dioryObject.id]
    if (diory.id !== dioryObject.id) {
      throwErrorIfNotFound('getDiory - alias', diory.id, Object.keys(this.diories))
      return this.diories[diory.id]
    }

    return diory
  }

  addDiory = (dioryObject: IDioryProps | IDioryObject, key?: string): IDiory => {
    if (key) {
      const diory: IDiory =
        'id' in dioryObject && !!this.diories[dioryObject.id]
          ? this.getDiory(dioryObject)
          : new Diory(dioryObject)

      if (!this.diories[diory.id]) {
        this.diories[diory.id] = diory
      }

      return (this.diories[key] = diory).then(this.saveDiograph)
    }

    if ('id' in dioryObject) {
      throwErrorIfAlreadyExists('updateDiory', dioryObject.id, Object.keys(this.diories))
    }

    const diory: IDiory = new Diory(dioryObject)
    return (this.diories[diory.id] = diory).then(this.saveDiograph)
  }

  updateDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('updateDiory', dioryObject.id, Object.keys(this.diories))

    return this.getDiory(dioryObject).update(dioryObject).then(this.saveDiograph)
  }

  removeDiory = (dioryObject: IDioryObject): void => {
    throwErrorIfNotFound('removeDiory', dioryObject.id, Object.keys(this.diories))

    delete this.diories[dioryObject.id]

    this.saveDiograph()
  }

  addDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('addDioryLink:diory', dioryObject.id, Object.keys(this.diories))
    throwErrorIfNotFound(
      'addDioryLink:linkedDiory',
      linkedDioryObject.id,
      Object.keys(this.diories),
    )

    return this.getDiory(dioryObject).addLink(linkedDioryObject).then(this.saveDiograph)
  }

  removeDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('removeDioryLink:diory', dioryObject.id, Object.keys(this.diories))

    return this.getDiory(dioryObject).removeLink(linkedDioryObject).then(this.saveDiograph)
  }

  saveDiograph = (): void => {}

  toObject = (): { diories: IDioriesObject } => {
    const diories: IDioriesObject = {}
    Object.entries(this.diories).forEach(([id, diory]) => {
      diories[id] = diory.toObject()
    })

    return { diories }
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diograph }
