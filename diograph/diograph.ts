import {
  IDiory,
  IDioryObject,
  IDiograph,
  IDioryProps,
  IDiographObject,
  IConnectionObject,
  IConnectionClient,
} from '@diory/types'

import { Diory } from '../diory/diory'

import { queryDiograph } from '../utils/queryDiograph'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'
import { debounce } from '../utils/debounce'

function isDioryAlias(dioryObject: IDioryObject, diory: IDiory) {
  return dioryObject.id !== diory.id
}

class Diograph implements IDiograph {
  connectionClient: IConnectionClient
  diograph: { [index: string]: IDiory } = {}

  constructor(connectionClient: IConnectionClient) {
    this.connectionClient = connectionClient
  }

  initialise = (connections: IConnectionObject[] = []): IDiograph => {
    this.diograph = {}
    this.connectionClient.initialiseConnections(connections)
    return this
  }

  getDiograph = async (): Promise<IDiograph> => {
    const diographObject = await this.connectionClient.getDiograph()
    if (diographObject) {
      this.addDiograph(diographObject)
    }
    return this
  }

  saveDiograph = debounce(async (): Promise<IDiograph> => {
    await this.connectionClient.saveDiograph(this.toObject())
    return this
  }, 1000)

  addDiograph = (diograph: IDiographObject): IDiograph => {
    Object.entries(diograph).forEach(([key, dioryObject]) => {
      try {
        this.diograph[key] = new Diory(dioryObject)
      } catch (error) {
        console.error(error)
      }
    })

    return this
  }

  queryDiograph = (queryDiory: IDioryProps): IDiographObject => {
    return queryDiograph(queryDiory, this.toObject())
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
    if (key) {
      const diory: IDiory =
        'id' in dioryObject && this.diograph[dioryObject.id]
          ? this.getDiory(dioryObject)
          : new Diory(dioryObject)

      if (!this.diograph[diory.id]) {
        this.diograph[diory.id] = diory
      }

      return (this.diograph[key] = new Diory({ id: diory.id })).save(this.saveDiograph)
    }

    if ('id' in dioryObject) {
      throwErrorIfAlreadyExists('addDiory', dioryObject.id, Object.keys(this.diograph))
    }

    const diory: IDiory = new Diory(dioryObject)
    return (this.diograph[diory.id] = diory).save(this.saveDiograph)
  }

  updateDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('updateDiory', dioryObject.id, Object.keys(this.diograph))

    return this.getDiory(dioryObject).update(dioryObject).save(this.saveDiograph)
  }

  removeDiory = (dioryObject: IDioryObject): void => {
    throwErrorIfNotFound('removeDiory', dioryObject.id, Object.keys(this.diograph))

    delete this.diograph[dioryObject.id]

    this.saveDiograph()
  }

  addDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('addDioryLink:diory', dioryObject.id, Object.keys(this.diograph))
    throwErrorIfNotFound(
      'addDioryLink:linkedDiory',
      linkedDioryObject.id,
      Object.keys(this.diograph),
    )

    return this.getDiory(dioryObject).addLink(linkedDioryObject).save(this.saveDiograph)
  }

  removeDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfNotFound('removeDioryLink:diory', dioryObject.id, Object.keys(this.diograph))

    return this.getDiory(dioryObject).removeLink(linkedDioryObject).save(this.saveDiograph)
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
