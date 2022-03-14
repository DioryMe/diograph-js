import { RoomConnector } from './base'

class LocalRoomConnector extends RoomConnector {
  constructor() {
    super()
    console.log('constructed')
  }
}

export { LocalRoomConnector }
