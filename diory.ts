import { Room } from './room'
import { DioryObject, DioryLinkObject, DioryAttributes, DataAttributes } from './types'

class Diory {
  id: string
  dioryAttributes: DioryAttributes
  links?: DioryLinkObject
  room?: Room

  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: Array<DataAttributes>
  style?: object
  created?: string
  modified?: string

  constructor(dioryObject: DioryObject) {
    const keys = Object.keys(dioryObject)
    if (keys.includes('rootId') || keys.includes('diograph') || keys.includes('linkKey')) {
      throw new Error('Invalid dioryObject: includes rootId, diograph or linkKey key!!')
    }
    this.id = dioryObject.id
    this.links = dioryObject.links
    this.dioryAttributes = this.extractDioryAttributes(dioryObject)
  }

  extractDioryAttributes = ({
    text,
    image,
    latlng,
    date,
    data,
    style,
    created,
    modified,
  }: DioryAttributes): DioryAttributes => {
    this.text = text
    this.image = image
    this.latlng = latlng
    this.date = date
    this.data = data
    this.style = style
    this.created = created
    this.modified = modified
    return { text, image, latlng, date, data, style, created, modified }
  }

  toJson = () => {
    return {
      id: this.id,
      links: this.links,
      // TODO: Make test and try if this could be just:
      // ...this.dioryAttributes,
      text: this.text,
      image: this.image,
      latlng: this.latlng,
      date: this.date,
      data: this.data,
      style: this.style,
      created: this.created,
      modified: this.modified,
    }
  }
}

export { Diory }
