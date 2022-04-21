const { existsSync } = require('fs')
const { readFile, writeFile, rm } = require('fs/promises')
const { join } = require('path')
const { Room, LocalRoomClient } = require('../dist')

const APP_DATA_PATH = join(__dirname, 'app-data.json')
module.exports = async ([command, arg1, arg2, arg3]) => {
  if (!command) {
    throw new Error('Command not provided to testApp(), please provide one')
  }

  if (command === 'resetApp') {
    await rm(APP_DATA_PATH)
    console.log('App data removed.')
    return
  }

  if (!existsSync(APP_DATA_PATH)) {
    const defaultAppData = { rooms: [], clients: [] }
    await writeFile(APP_DATA_PATH, JSON.stringify(defaultAppData, null, 2))
  }
  const appDataContents = await readFile(APP_DATA_PATH, { encoding: 'utf8' })
  const appData = JSON.parse(appDataContents)

  if (command === 'addRoom') {
    const roomPath = arg1
    appData.rooms.push({ path: roomPath })
    await writeFile(APP_DATA_PATH, JSON.stringify(appData, null, 2))
    console.log('Room added.')
  }

  const rooms = await Promise.all(
    appData.rooms.map(async (roomData) => {
      const client = new LocalRoomClient({ address: roomData.path })
      const room = new Room(roomData.path, client)

      await room.loadOrInitiateRoom()
      return room
    }),
  )

  if (!rooms.length) {
    console.log('No rooms, please add one!')
    return
  }

  const room = rooms[0]
  const client = room.clients[0]

  if (command === 'listRooms') {
    console.log(rooms)
  }

  if (command === 'listRoomClients') {
    console.log(room.clients)
  }

  if (command === 'deleteRoom') {
    await room.deleteRoom()
    console.log('Room deleted.')
  }

  if (command === 'addClient') {
    await room.addClient(join(__dirname, 'temp-room', 'some-room-address'))
    await room.saveRoom()
    console.log('Client added.')
  }

  if (command === 'listClientContents') {
    const list = await client.list()
    console.log(list)
    return list
  }

  if (command === 'importClientContent') {
    const diory = await client.import()
    console.log(diory)
    return diory
  }

  if (command === 'getDiory') {
    const diory = await room.diograph.getDiory('some-diory-id')
    console.log(diory)
    return diory
  }

  if (command === 'createDiory') {
    await room.diograph.createDiory({ text: 'Superia' })
    await room.saveRoom()
    console.log('Diory created')
  }
}
