import { Room } from './room'
import { DioryObject, DioryLinkObject, DioryAttributes } from './types'

class Diory {
  id: string
  dioryAttributes: DioryAttributes
  links?: DioryLinkObject
  room?: Room

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
    return { text, image, latlng, date, data, style, created, modified }
  }
}

export { Diory }
