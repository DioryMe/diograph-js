const { Room, LocalRoomClient } = require('../dist')

module.exports = async ([clientType, path, command]) => {
  if (!clientType || !path) {
    console.log('ERROR: Please provide clientType and path.')
    process.exit()
  }

  console.log(`ClientType: ${clientType}`)
  console.log(`Path: ${path}`)
  console.log('')

  console.log(`Initiating room to ${path}`)

  const client = new LocalRoomClient({ address: path })
  const room = new Room(path, client)

  await room.loadOrInitiateRoom()

  console.log('Connected to Room: initiation completed & saved to app-data.json!')

  if (command === 'delete') {
    await room.deleteRoom()
    console.log('Room deleted.')
  }

  if (command === 'addClient') {
    await room.addClient('some-room-address')
    await room.saveRoom()
    console.log('Client added.')
  }
}
