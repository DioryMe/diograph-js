import { v4 as uuid } from 'uuid'
import { propIsValid, valueIsValid, valueExists } from './validators'
import { throwErrorIfLinkAlreadyExists, throwErrorIfLinkNotFound } from './throwErrors'

import { IDiory, IDioryObject, IDioryProps, ILinkObject } from './types'

class Diory implements IDiory {
  id: string
  text?: string = undefined
  image?: string = undefined
  latlng?: string = undefined
  date?: string = undefined
  data?: any[] = undefined
  links?: ILinkObject[] = undefined
  created?: string = undefined
  modified?: string = undefined

  constructor(dioryObject: IDioryObject | IDioryProps) {
    this.id = 'id' in dioryObject? dioryObject.id : uuid()
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
    throwErrorIfLinkAlreadyExists('createLink', linkObject, this.links)

    const newLinkObject: ILinkObject = { id: linkObject.id }
    if (linkObject.path) {
      newLinkObject.path = linkObject.path
    }
    const links: ILinkObject[] = (this.links || []).concat(newLinkObject)

    return this.update({ links })
  }

  removeLink(linkObject: ILinkObject): IDiory {
    throwErrorIfLinkNotFound('deleteLink', linkObject, this.links)

    const newLinks = this.links?.filter((link) => link.id !== linkObject.id)
    const links = newLinks?.length ? newLinks : undefined

    return this.update({ links })
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
