import { getDefaultImage } from './getDefaultImage'
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

    if (!this.image) {
      this.image = getDefaultImage()
    }

    if (!this.created) {
      this.created = new Date().toISOString()
    }

    this.modified = new Date().toISOString()

    return this
  }

  private throwLinkAlreadyExistError = (method: string, linkedDioryObject: IDioryObject): void => {
    if (!this.links || !this.links[linkedDioryObject.id]) {
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

  private throwLinkNotFoundError = (method: string, linkedDioryObject: IDioryObject): void => {
    if (this.links && this.links[linkedDioryObject.id]) {
      return
    }

    throw new Error(`${method}: Linked diory not found ${JSON.stringify(linkedDioryObject, null, 2)}`)
  }

  deleteLink(linkedDioryObject: IDioryObject) {
    this.throwLinkNotFoundError('deleteLink', linkedDioryObject)

    const { [linkedDioryObject.id]: omit, ...links } = this.links || {}
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
