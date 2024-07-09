import { v4 as uuid } from 'uuid'

import { IDataObject, IDiory, IDioryObject, IDioryProps, ILinkObject } from '@diory/types'

import { propIsValid, valueIsValid, valueExists } from '../utils/validators'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { getIds } from '../utils/getIds'
import { removeById } from '../utils/removeById'

class Diory implements IDiory {
  id: string
  text?: string = undefined
  image?: string = undefined
  latlng?: string = undefined
  date?: string = undefined
  data?: IDataObject[] = undefined
  links?: ILinkObject[] = undefined
  created?: string = undefined
  modified?: string = undefined

  constructor(dioryObject: IDioryObject | IDioryProps) {
    this.id = 'id' in dioryObject ? dioryObject.id : uuid()
    this.update(dioryObject, false)
  }

  update = (dioryProps: IDioryProps, modify = true): IDiory => {
    Object.entries(dioryProps).forEach(([prop, value]) => {
      // @ts-ignore
      if (!propIsValid(this, prop) || !valueIsValid(value)) {
        return
      }

      // @ts-ignore
      this[prop] = value
    })

    if (!this.created) {
      this.created = new Date().toISOString()
    }

    if (modify || !this.modified) {
      this.modified = new Date().toISOString()
    }

    return this
  }

  addLink(linkObject: ILinkObject): IDiory {
    throwErrorIfAlreadyExists('addLink', linkObject.id, getIds(this.links))

    if (!this.links) {
      this.links = []
    }

    this.links.push(linkObject)

    return this.update({})
  }

  removeLink(linkObject: ILinkObject): IDiory {
    throwErrorIfNotFound('removeLink', linkObject.id, getIds(this.links))

    this.links = removeById(linkObject.id, this.links)

    return this.update({})
  }

  save = (saveCallback?: () => void): IDiory => {
    if (saveCallback) {
      saveCallback()
    }

    return this
  }

  toObject = (): IDioryObject => {
    const dioryObject: IDioryObject = { id: this.id }
    Object.getOwnPropertyNames(this).forEach((prop) => {
      // @ts-ignore
      const value: any = this[prop]
      if (valueIsValid(value) && valueExists(value)) {
        // @ts-ignore
        dioryObject[prop] = value
      }
    })
    return dioryObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diory }
