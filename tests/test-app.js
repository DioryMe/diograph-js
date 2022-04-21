const { join } = require('path')
const { Room, LocalRoomClient } = require('../dist')

module.exports = async ([command, arg1, arg2, arg3]) => {
  // if (!command) {
  //   throw new Error('Command not provided to testApp(), please provide one')
  // }

  if (command === 'resetApp') {
    console.log('App data removed.')
    return
  }

  if (command === 'addRoom') {
    // const path = join(__dirname, 'temp-room')
    // await writeFile('app-data.json', [{ path })
  }

  const rooms = await Promise.all(
    [1].map(async (roomData) => {
      const path = join(__dirname, 'temp-room')

      const client = new LocalRoomClient({ address: path })
      const room = new Room(path, client)

      await room.loadOrInitiateRoom()
      return room
    }),
  )

  if (!rooms.length) {
    console.log('No rooms, please add one!')
    return
  }

  const room = rooms[0]

  if (command === 'listRooms') {
    console.log(rooms)
  }

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
