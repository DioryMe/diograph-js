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

  createLink(linkedDioryObject: IDioryObject) {
    const id = linkedDioryObject.id
    this.links = {
      ...this.links,
      [id]: { id }
    }

    this.modified = new Date().toISOString()

    return this
  }

  deleteLink(linkedDioryObject: IDioryObject) {
    const { [linkedDioryObject.id]: omit, ...links } = this.links || {}

    this.links = links

    this.modified = new Date().toISOString()

    return this
  }

  toObject = (): IDioryObject => {
    const dioryObject: any = {}
    Object.getOwnPropertyNames(this).forEach((prop) => {
      // @ts-ignore
      const value: any = this[prop]
      if (valueIsValid(value) && valueExists(value)) {
        dioryObject[prop] = value
      }
    })
    return dioryObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diory }
