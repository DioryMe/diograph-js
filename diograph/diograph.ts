import { join } from 'path-browserify'

import {
  IDiory,
  IDioryObject,
  IDioryProps,
  IDiographObject,
  ILinkObject,
  IDataClient,
  IConnectionObject,
} from '@diory/types'

import { Diory } from '../diory/diory'

import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'

function isDioryAlias(dioryObject: IDioryObject, diory: IDiory) {
  return dioryObject.id !== diory.id
}

const DIOGRAPH_JSON = 'diograph.json'

export interface IDiograph {
  diograph: { [index: string]: IDiory }
  dataClients?: IDataClient[]
  connections?: IConnectionObject[]
  getDiograph: (connections: IConnectionObject[]) => Promise<IDiograph>
  saveDiograph: () => void
  addDiograph: (diograph: IDiographObject) => IDiograph
  resetDiograph: () => IDiograph
  getDiory: (dioryObject: IDioryObject) => IDiory
  addDiory: (dioryProps: IDioryProps | IDioryObject | IDiory, key?: string) => IDiory
  updateDiory: (dioryObject: IDioryObject) => IDiory
  removeDiory: (dioryObject: IDioryObject) => void
  addDioryLink: (dioryObject: IDioryObject, linkObject: ILinkObject) => IDiory
  removeDioryLink: (dioryObject: IDioryObject, linkObject: ILinkObject) => IDiory
  toObject: () => IDiographObject
  toJson: () => string
}

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}
  dataClients: IDataClient[] = []
  connections: IConnectionObject[] = []

  constructor(dataClients?: IDataClient[]) {
    if (dataClients) {
      this.dataClients = dataClients
    }
  }

  findDataClient = (
    dataClients: IDataClient[],
    { client }: IConnectionObject,
  ): IDataClient | undefined => {
    return dataClients?.find(({ type }) => type === client)
  }

  getDiograph = async (connections: IConnectionObject[]): Promise<IDiograph> => {
    this.connections = connections // TODO: Store only connections that exist and are able to save
    await Promise.all(
      connections.map(async (connection: IConnectionObject) => {
        const client = this.findDataClient(this.dataClients, connection)
        if (client) {
          const path = join(connection.address, DIOGRAPH_JSON)
          const diographString = await client.readTextItem(path)
          this.addDiograph(JSON.parse(diographString))
        }
      }),
    )

    return this
  }

  saveDiograph = async () => {
    await Promise.all(
      this.connections.map(async (connection: IConnectionObject) => {
        const client = this.findDataClient(this.dataClients, connection)
        if (client) {
          const path = join(connection.address, DIOGRAPH_JSON)
          return client.writeItem(path, this.toJson())
        }
      }),
    )
  }

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
