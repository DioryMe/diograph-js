import { RoomClient } from '.'

export interface IDataObject {
  '@context': string
  '@type': string
  contentUrl: string
  encodingFormat: string
  height?: number
  width?: number
}

export interface ILinkObject {
  id: string
  path?: string
}

// validator: validateDiory
export interface IDioryProps {
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: IDataObject[]
  links?: { [index: string]: ILinkObject }
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
  toObjectWithoutImage: () => IDioryObject
}

// validator: validateDiograph
export interface IDiographObject {
  // TODO: Make '/' required
  // '/': IDioryObject
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
  toObject: () => IDiographObject
  loadDiograph: (roomClient: RoomClient) => Promise<void>
  saveDiograph: (roomClient: RoomClient) => Promise<void>
}

// custom type, no validator...
export interface RoomObject {
  connections: ConnectionData[]
  diograph?: IDiographObject
}

// validator: validateCIDMapping
export interface CIDMapping {
  [key: string]: string
}

// validator: validateConnectionData
// TODO: Extend from ConnectionConfigData when contentClientType is renamed to clientType
export interface ConnectionData {
  id?: string
  address: string
  contentClientType: string
  contentUrls?: CIDMapping
  diograph?: IDiographObject
}

export interface ConnectionClient {
  address: string
  type: string
  readTextItem(url: string): Promise<string>
  readItem(url: string): Promise<ArrayBuffer>
  readToStream(url: string): any
  verify(): Promise<boolean>
  exists(url: string): Promise<boolean>
  writeTextItem(url: string, fileContent: string): Promise<boolean>
  writeItem(url: string, fileContent: ArrayBuffer | string): Promise<boolean>
  deleteItem(url: string): Promise<boolean>
  deleteFolder(url: string): Promise<void>
  list(url: string): Promise<string[]>
}

export interface ConnectionClientConstructor {
  new (address: string, credentials?: any): ConnectionClient
}

export interface ConnectionClientList {
  [index: string]: {
    clientConstructor: ConnectionClientConstructor
    credentials?: object
  }
}

export interface RoomConfigData {
  id?: string
  address: string
  clientType: string
}

export interface ConnectionConfigData extends RoomConfigData {}
