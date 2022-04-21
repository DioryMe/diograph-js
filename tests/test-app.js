const { join } = require('path')
const { Room, LocalRoomClient } = require('../dist')

module.exports = async ([command]) => {
  const path = join(__dirname, 'temp-room')

  const client = new LocalRoomClient({ address: path })
  const room = new Room(path, client)

  await room.loadOrInitiateRoom()

  if (command === 'delete') {
    await room.deleteRoom()
    console.log('Room deleted.')
  }

  if (command === 'addClient') {
    await room.addClient('some-room-address')
    await room.saveRoom()
    console.log('Client added.')
  }

  if (command === 'getDiory') {
    const diory = await room.diograph.getDiory('some-diory-id')
    return diory
  }

  if (command === 'createDiory') {
    await room.diograph.createDiory({ text: 'Superia' })
    await room.saveRoom()
  }
}
