export interface DiographJsonParams {
  path: string
}

export interface Diograph {
  [key: string]: Diory
}

export interface Diory extends DioryAttributes {
  id: string
  links?: object
}

export interface DioryAttributes {
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: Array<DataAttributes>
  style?: object
}

export interface DataAttributes {
  [key: string]: string
}
