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
}

export { Diory }
