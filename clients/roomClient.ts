import { join } from 'path'
import { Connection } from '../connection'
import { ElectronClient } from './electronClient'
import { ElectronClientMock } from './electronClientMock'

class RoomClient {
  address: string
  roomJsonPath: string
  diographPath: string
  connection?: Connection
  client: ElectronClient | ElectronClientMock

  constructor(config: any, connection?: Connection, client?: ElectronClient | ElectronClientMock) {
    this.client = client || new ElectronClient()
    this.address = this.client.address
    this.roomJsonPath = join(this.address, 'room.json')
    this.diographPath = join(this.address, 'diograph.json')
    this.connection = connection
  }

  loadRoom = async () => {
    return this.client.readTextItem(this.roomJsonPath)
  }

  readDiograph = async () => {
    return this.client.readTextItem(this.diographPath)
  }

  saveDiograph = async (diographFileContents: string) => {
    return this.client.writeItem(this.diographPath, diographFileContents)
  }

  deleteRoomJson = async () => {
    return this.client.deleteItem(this.roomJsonPath)
  }

  deleteDiographJson = async () => {
    return this.client.deleteItem(this.diographPath)
  }
}

export { RoomClient }
