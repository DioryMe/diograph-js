export interface Diograph {
  [key: string]: Diory
}

export interface Diory extends DioryAttributes {
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
