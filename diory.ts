import { v4 as uuid } from 'uuid'
import { propIsValid, valueIsValid, valueExists } from './validators'
import { IDiory, IDioryObject, IDioryProps } from './types'

class Diory implements IDiory {
  id: string
  text?: string = undefined
  image?: string = undefined
  latlng?: string = undefined
  date?: string = undefined
  data?: any[] = undefined
  links?: { [index: string]: any } = undefined
  created?: string = undefined
  modified?: string = undefined

  constructor(dioryObject: IDioryObject | IDioryProps) {
    this.id = 'id' in dioryObject? dioryObject.id : uuid()
    this.update(dioryObject)
  }

  private findLinkId(linkedDioryObject: IDioryObject): string | undefined {
    if (!this.links) {
      return
    }

    const entry = Object.entries(this.links).find(([, { id }]) => id === linkedDioryObject.id)
    return entry && entry[0]
  }

  private throwError = (method: string, message: string, linkedDioryObject: IDioryObject): void => {
    throw new Error(
      `${method}: ${message} ${JSON.stringify(linkedDioryObject, null, 2)}`,
    )
  }

  private modifiedDiory = (): IDiory => {
    this.modified = new Date().toISOString()
    return this
  }

  update = (dioryProps: IDioryProps): IDiory => {
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

    if (!this.modified) {
      this.modified = new Date().toISOString()
    }

    return this
  }

  createLink(linkedDioryObject: IDioryObject) {
    if (this.findLinkId(linkedDioryObject)) {
      this.throwError('createLink', 'Link already exists', linkedDioryObject)
    }

    const linkId: string = linkedDioryObject.id
    this.links = {
      ...this.links,
      [linkId]: { id: linkId },
    }

    return this.modifiedDiory()
  }

  deleteLink(linkedDioryObject: IDioryObject) {
    if (!this.findLinkId(linkedDioryObject)) {
      this.throwError('deleteLink', 'Link not found', linkedDioryObject)
    }

    // @ts-ignore
    const linkId: string = this.findLinkId(linkedDioryObject)

    const { [linkId]: omit, ...links } = this.links || {}
    this.links = Object.keys(links).length ? links : undefined

    return this.modifiedDiory()
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
