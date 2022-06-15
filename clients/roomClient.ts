import { join } from 'path'
import { Connection } from '../connection'

class RoomClient {
  address: string
  roomJsonPath: string
  diographPath: string
  connection?: Connection
  client: any // TODO: Define baseClient

  constructor(connection?: Connection, client?: any) {
    this.client = client
    this.address = this.client.address
    this.roomJsonPath = join(this.address, 'room.json')
    this.diographPath = join(this.address, 'diograph.json')
    this.connection = connection // Why? Remove?
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
