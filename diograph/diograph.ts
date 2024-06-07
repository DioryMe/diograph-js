import { IDiory, IDioryObject, IDiograph, IDioryProps, IDiographObject } from '../types'

import { Diory } from '../diory/diory'

import { queryDiograph } from '../utils/queryDiograph'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'
import { RoomClient } from '../diosphere/roomClient'
import { validateDiograph } from '../validator'

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}

  constructor(diograph?: IDiographObject) {
    if (diograph) {
      this.initialise(diograph)
    }
  }

  initialise = (diograph: IDiographObject): IDiograph => {
    validateDiograph(diograph)
    Object.entries(diograph).forEach(([key, dioryObject]) => {
      try {
        this.diograph[key] = new Diory(dioryObject)
      } catch (error) {
        console.error(error)
      }
    })

    return this
  }

  // FIXME: Current implementation of queryDiograph() doesn't work with validated diographs
  queryDiograph = (queryDiory: IDioryProps): IDiograph => {
    throw new Error("queryDiograph() is disabled because it doesn't work with validated diographs")
    const diograph: IDiographObject = queryDiograph(queryDiory, this.toObject())
    return new Diograph(diograph)
  }

  resetDiograph = (): IDiograph => {
    this.diograph = {}
    return this
  }

  getDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('getDiory', dioryObject.id, Object.keys(this.diograph))

    const diory = this.diograph[dioryObject.id]
    if (diory.id !== dioryObject.id) {
      throwErrorIfNotFound('getDiory - alias', diory.id, Object.keys(this.diograph))
      return this.diograph[diory.id]
    }

    return diory
  }

  addDiory = (dioryObject: IDioryProps | IDioryObject, key?: string): IDiory => {
    if (key) {
      const diory: IDiory =
        'id' in dioryObject && this.diograph[dioryObject.id]
          ? this.getDiory(dioryObject)
          : new Diory(dioryObject)

      if (!this.diograph[diory.id]) {
        this.diograph[diory.id] = diory
      }

      return (this.diograph[key] = new Diory({ id: diory.id }))
    }

    if ('id' in dioryObject) {
      throwErrorIfAlreadyExists('updateDiory', dioryObject.id, Object.keys(this.diograph))
    }

    const diory: IDiory = new Diory(dioryObject)
    return (this.diograph[diory.id] = diory)
  }

  updateDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('updateDiory', dioryObject.id, Object.keys(this.diograph))

    return this.getDiory(dioryObject).update(dioryObject)
  }

  removeDiory = (dioryObject: IDioryObject): void => {
    throwErrorIfNotFound('removeDiory', dioryObject.id, Object.keys(this.diograph))

    delete this.diograph[dioryObject.id]
  }

  addDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('addDioryLink:diory', dioryObject.id, Object.keys(this.diograph))
    throwErrorIfNotFound(
      'addDioryLink:linkedDiory',
      linkedDioryObject.id,
      Object.keys(this.diograph),
    )

    return this.getDiory(dioryObject).addLink(linkedDioryObject)
  }

  removeDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('removeDioryLink:diory', dioryObject.id, Object.keys(this.diograph))

    return this.getDiory(dioryObject).removeLink(linkedDioryObject)
  }

  toObject = (): IDiographObject => {
    const diograph: IDiographObject = {}
    Object.entries(this.diograph).forEach(([id, diory]) => {
      diograph[id] = diory.toObject()
    })

    return diograph
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)

  loadDiograph = async (roomClient: RoomClient) => {
    const diographContents = await roomClient.readDiograph()

    const diograph = JSON.parse(diographContents)
    validateDiograph(diograph)

    if (diograph && Object.keys(diograph).length) {
      this.initialise(diograph)
    }
  }

  saveDiograph = async (roomClient: RoomClient) => {
    validateDiograph(JSON.parse(this.toJson()))
    await roomClient.saveDiograph(this.toJson())
  }
}

export { Diograph }
