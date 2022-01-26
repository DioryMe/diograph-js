export interface DiographJsonParams {
  path: string
}

export interface DiographJson {
  path: string
  rootId: string
  diograph: Diograph
}

export interface Diograph {
  [key: string]: Diory
}

export interface Diory {
  id: string
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: Array<object>
  style?: object
  links?: object
}
