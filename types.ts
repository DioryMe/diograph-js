interface Index {
  [index: string]: any
}

export interface IDioryProps extends Index {
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: any[]
  links?: { [index: string]: any }
  style?: object
  created?: string
  modified?: string
}

export interface IDioryObject extends IDioryProps {
  id: string
}

export interface IDiograph {
  diograph: { [index: string]: IDiory },
  addDiograph: (diographObject: IDiographObject) => IDiograph,
  queryDiograph: (dioryObject: IDioryProps) => IDiograph,
  toObject: () => IDiographObject,
}

export interface IDiory extends IDioryObject{
  update: (dioryProps: IDioryProps) => IDiory
  createLink: (linkedDioryObject: IDioryObject) => IDiory
  deleteLink: (linkedDioryObject: IDioryObject) => IDiory
  toObject: () => IDioryObject
}

export interface IDiographObject {
  [index: string]: IDioryObject
}