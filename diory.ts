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

  constructor(dioryObject: IDioryObject) {
    this.id = dioryObject.id
    this.update(dioryObject)
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

    this.modified = new Date().toISOString()

    return this
  }

  private findLinkId(linkedDioryObject: IDioryObject): string | undefined {
    if (!this.links) {
      return
    }

    const entry = Object.entries(this.links).find(([, { id }]) => id === linkedDioryObject.id)
    return entry && entry[0]
  }

  private throwLinkAlreadyExistError = (method: string, linkedDioryObject: IDioryObject): void => {
    if (!this.links || !this.findLinkId(linkedDioryObject)) {
      return
    }

    throw new Error(`${method}: Linked diory not found ${JSON.stringify(linkedDioryObject, null, 2)}`)
  }

  createLink(linkedDioryObject: IDioryObject) {
    this.throwLinkAlreadyExistError('createLink', linkedDioryObject)

    const id = linkedDioryObject.id
    this.links = {
      ...this.links,
      [id]: { id }
    }

    this.modified = new Date().toISOString()

    return this
  }

  deleteLink(linkedDioryObject: IDioryObject) {
    const linkId: string | undefined = this.findLinkId(linkedDioryObject)
    if (!linkId) {
      throw new Error(`deleteLink: Linked diory not found ${JSON.stringify(linkedDioryObject, null, 2)}`)
    }

    const { [linkId]: omit, ...links } = this.links || {}
    this.links = Object.keys(links).length? links : undefined

    this.modified = new Date().toISOString()

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