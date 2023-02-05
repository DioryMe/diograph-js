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
  created?: string
  modified?: string
}

export interface IDioryObject extends IDioryProps {
  id: string
}

export interface IDiory extends IDioryObject {
  update: (dioryProps: IDioryProps, addOnly?: boolean) => IDiory
  addLink: (linkedDioryObject: IDioryObject) => IDiory
  removeLink: (linkedDioryObject: IDioryObject) => IDiory
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
  addDiory: (dioryProps: IDioryProps) => IDiory
  updateDiory: (dioryObject: IDioryObject) => IDiory
  removeDiory: (dioryObject: IDioryObject) => boolean
  addDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  removeDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  toObject: () => IDiographObject
}
