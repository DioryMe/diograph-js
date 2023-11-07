// @diograph/diograph

import { RoomClient } from '.'

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
  path?: string
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
  addDiograph: (diographObject: IDiographObject, rootId?: string) => IDiograph
  queryDiograph: (dioryObject: IDioryProps) => IDiograph
  resetDiograph: () => IDiograph
  getDiory: (dioryObject: IDioryObject) => IDiory
  addDiory: (dioryProps: IDioryProps) => IDiory
  updateDiory: (dioryObject: IDioryObject) => IDiory
  removeDiory: (dioryObject: IDioryObject) => boolean
  addDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  removeDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  toObject: () => IDiographObject
  // diograph-js
  diories: () => Array<IDiory>
  mergeDiograph: (diograph: IDiographObject, rootId?: string) => void
  loadDiograph: (roomClient: RoomClient) => Promise<void>
  saveDiograph: (roomClient: RoomClient) => Promise<void>
}

// diograph-js

export interface RoomObject {
  connections: ConnectionObject[]
  diograph?: IDiographObject
}

export interface DioryAttributes {
  // IDioryProps
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: DataAttributes[]
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

export interface ContentUrls {
  [key: string]: string
}

export interface ConnectionObject {
  address: string
  contentClientType: string
  contentUrls?: ContentUrls
  diograph?: IDiographObject
}

export interface DioryGeneratorData {
  typeSpecificDiory: IDioryProps
  thumbnailBuffer?: Buffer
  cid?: string
}
