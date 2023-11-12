export { Diograph } from './diograph/diograph'
export { Diory } from './diory/diory'
export { IDiograph, IDiographObject, IDiory, IDioryObject, IDioryProps, ILinkObject } from './types'

// diograph-js
// export { Room } from './core/room'
export { Room } from './room'
export { RoomClient } from './clients/roomClient'
export { ElectronClient } from './clients/electronClient'
// diory-browser-electron doesn't run without disabling this
// - should be extracted out from here and required and used separately in diory-browser-electron backend
// export { ElectronServer } from './clients/electronServer'
export { ElectronClientMock } from './clients/electronClientMock'
// export { Connection } from './core/connection'
export { Connection } from './connection'
export { DioryAttributes, DioryGeneratorData, DioryLinkObject } from './types'

export interface ConnectionClient {
  address: string
  type: string
  readTextItem(url: string): Promise<string>
  readItem(url: string): Promise<Buffer>
  readToStream(url: string): any
  verify(): Promise<boolean>
  exists(url: string): Promise<boolean>
  writeTextItem(url: string, fileContent: string): Promise<boolean>
  writeItem(url: string, fileContent: Buffer | string): Promise<boolean>
  deleteItem(url: string): Promise<boolean>
  deleteFolder(url: string): Promise<void>
  list(url: string): Promise<string[]>
}

export interface ConnectionClientConstructor {
  new (address: string): ConnectionClient
}
