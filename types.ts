export interface ILinkObject {
  id: string
}

export interface IDataObject {
  '@context': string
  '@type': string
  contentUrl: string
  encodingFormat: string
  height?: number
  width?: number
}

export interface IDioryProps {
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: IDataObject[]
  links?: ILinkObject[]
  created?: string
  modified?: string
}

export interface IDioryObject extends IDioryProps {
  id: string
}

export interface IDiory extends IDioryObject {
  update: (dioryProps: IDioryProps, modify?: boolean) => IDiory
  addLink: (linkedDioryObject: IDioryObject) => IDiory
  removeLink: (linkedDioryObject: IDioryObject) => IDiory
  then: (callback?: () => void) => IDiory
  toObject: () => IDioryObject
}

export interface IDiographObject {
  [key: string]: IDioryObject
}

export interface IDiograph {
  diograph: { [index: string]: IDiory }
  initialise: (diograph: IDiographObject) => IDiograph
  queryDiograph: (dioryObject: IDioryProps) => IDiograph
  resetDiograph: () => IDiograph
  getDiory: (dioryObject: IDioryObject) => IDiory
  addDiory: (dioryProps: IDioryProps | IDioryObject | IDiory, key?: string) => IDiory
  updateDiory: (dioryObject: IDioryObject) => IDiory
  removeDiory: (dioryObject: IDioryObject) => void
  addDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  removeDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  saveDiograph: (callback?: () => void) => void
  toObject: () => IDiographObject
}
