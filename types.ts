export interface DiographObject {
  [key: string]: DioryObject
}

export interface DioryObject extends DioryAttributes {
  id: string
  links?: DioryLinkObject
}

export interface DioryAttributes {
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: Array<DataAttributes>
  style?: object
  created?: string
  modified?: string
}

export interface DataAttributes {
  [key: string]: string
}

export interface DioryLink {
  id: string
}

export interface DioryLinkObject {
  [key: string]: DioryLink
}

export interface ConnectionObject {
  address: string
  type: string
  contentUrls?: string[]
}

export interface DioryGeneratorData {
  typeSpecificDiory: DioryAttributes
  thumbnailBuffer?: Buffer
  cid?: string
}
