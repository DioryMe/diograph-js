const { existsSync } = require('fs')
const { readFile, writeFile, rm, mkdir, rmdir } = require('fs/promises')
const { join } = require('path')
const { Room, LocalRoomClient, LocalClient } = require('../dist')

const APP_DATA_PATH = join(__dirname, 'app-data.json')
const CONTENT_SOURCE_ROOM_PATH = join(__dirname, 'content-source-room')

let appData = {}
let appRooms
let appClients

const loadAppData = async () => {
  // Initiate app data if doesn't exist yet
  if (!existsSync(APP_DATA_PATH)) {
    const defaultAppData = { rooms: [], clients: [] }
    await writeFile(APP_DATA_PATH, JSON.stringify(defaultAppData, null, 2))
  }

  const appDataContents = await readFile(APP_DATA_PATH, { encoding: 'utf8' })
  appData = JSON.parse(appDataContents)

  // Load rooms
  appRooms = await Promise.all(
    appData.rooms.map(async (roomData) => {
      const client = new LocalRoomClient({ address: roomData.address })
      const room = new Room(roomData.address, client)

      await room.loadOrInitiateRoom()
      return room
    }),
  )

  // Load clients
  appData.clients = appRooms
    .map((room) => room.clients)
    .filter(Boolean)
    .flat()
  appClients = await Promise.all(
    appData.clients.map(async (client) => {
      await client.load()
      return client
    }),
  )

  return appData
}

const saveAppData = async () => {
  console.log('saveAppData', appData)
  await writeFile(APP_DATA_PATH, JSON.stringify(appData, null, 2))
}

module.exports = async ([command, arg1, arg2, arg3]) => {
  if (!command) {
    throw new Error('Command not provided to testApp(), please provide one')
  }

  if (command === 'resetApp') {
    // Remove app-data.json
    existsSync(APP_DATA_PATH) && (await rm(APP_DATA_PATH))
    // Remove content source room
    await rm(CONTENT_SOURCE_ROOM_PATH, { recursive: true })
    await mkdir(CONTENT_SOURCE_ROOM_PATH)
    console.log('App data removed.')
    return
  }

  const appData = await loadAppData()

  if (command === 'addRoom') {
    const roomPath = arg1 || join(__dirname, 'temp-room')
    appData.rooms.push({ address: roomPath })
    await saveAppData()
    console.log('Room added.')
  }

  if (command === 'listRooms') {
    return appData.rooms
  }

  if (command === 'appListRooms') {
    console.log(appRooms)
    return appData.rooms
  }

  if (command === 'appListClients') {
    return appData.clients
  }

  if (!appData.rooms.length) {
    console.log('No rooms, please add one!')
    return
  }

  const room = appRooms[0]
  const client = room && room.clients ? room.clients[0] : undefined

  if (command === 'listRoomClients') {
    console.log(room.clients)
  }

  if (command === 'deleteRoom') {
    await room.deleteRoom()
    appData.rooms.shift()
    await saveAppData()
    console.log('Room deleted.')
  }

  if (command === 'addClient') {
    await room.addClient(join(__dirname, 'some-room-address'))
    await room.saveRoom()
    await saveAppData()
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
