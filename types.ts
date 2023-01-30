export interface ILinkObject {
  id: string
  path?: string
}

export interface IDioryProps {
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: any[]
  links?: ILinkObject[]
  style?: object
  created?: string
  modified?: string
}

export interface IDioryObject extends IDioryProps {
  id: string
}

export interface IDiory extends IDioryObject {
  update: (dioryProps: IDioryProps, addOnly?: boolean) => IDiory
  createLink: (linkedDioryObject: IDioryObject) => IDiory
  deleteLink: (linkedDioryObject: IDioryObject) => IDiory
  toObject: () => IDioryObject
}

export interface IDiographObject {
  [key: string]: IDioryObject
}

export interface IDiograph {
  diograph: { [index: string]: IDiory }
  rootId?: string
  addDiograph: (diographObject: IDiographObject, rootId?: string) => IDiograph
  queryDiograph: (dioryObject: IDioryProps) => IDiograph
  resetDiograph: () => IDiograph
  setRoot: (dioryObject: IDioryObject) => void
  getRoot: () => IDiory
  getDiory: (dioryObject: IDioryObject) => IDiory
  createDiory: (dioryProps: IDioryProps) => IDiory
  updateDiory: (dioryObject: IDioryObject) => IDiory
  deleteDiory: (dioryObject: IDioryObject) => boolean
  createDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  deleteDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  toObject: () => IDiographObject


}

