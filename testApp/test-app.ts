import { Room, LocalRoomClient } from 'diograph-js'
import { Client } from '../clients'
import { existsSync } from 'fs'
import { readFile, writeFile, rm, mkdir, rmdir } from 'fs/promises'
import { join } from 'path'

const APP_DATA_PATH = join(__dirname, 'app-data.json')
const CONTENT_SOURCE_ROOM_PATH = join(__dirname, '..', '..', 'testApp', 'content-source-room')

interface RoomData {
  address: string
}

interface ContentUrls {
  [key: string]: string
}

interface ClientData {
  address: string
  contentUrls: ContentUrls
}

interface AppData {
  rooms: RoomData[]
  clients: ClientData[]
}

let appData: AppData = {
  rooms: [],
  clients: [],
}
let appRooms: Room[] = []
let appClients: Client[] = []

class App {
  constructor() {}

  loadAppData = async () => {
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
    // appData.clients = appRooms
    //   .map((room) => room.clients)
    //   .filter(Boolean)
    //   .flat()
    appClients = await Promise.all(
      appClients.map(async (client) => {
        await client.load()
        return client
      }),
    )

    return appData
  }

  saveAppData = async () => {
    console.log('saveAppData', appData)
    await writeFile(APP_DATA_PATH, JSON.stringify(appData, null, 2))
  }

  run = async (command: string, arg1: string, arg2: string, arg3: string) => {
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

    appData = await this.loadAppData()
    await this.saveAppData()

    if (command === 'addRoom') {
      const roomPath = arg1 || join(__dirname, '..', '..', 'testApp', 'temp-room')
      appData.rooms.push({ address: roomPath })
      await this.loadAppData()
      await this.saveAppData()
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

    if (command === 'listRoomClients') {
      console.log(room.clients)
    }

    if (command === 'deleteRoom') {
      await room.deleteRoom()
      appData.rooms.shift()
      await this.saveAppData()
      console.log('Room deleted.')
    }

    if (command === 'addClient') {
      await room.addClient(join(__dirname, 'some-room-address'))
      await room.saveRoom()
      await this.saveAppData()
      console.log('Client added.')
    }

    if (command === 'listClientContents') {
      const list = await room.clients[0].list()
      console.log(list)
      return list
    }

    if (command === 'importClientContent') {
      const diory = await room.clients[0].import()
      console.log(diory)
      return diory
    }

    if (command === 'getDiory' && room.diograph) {
      const diory = await room.diograph.getDiory('some-diory-id')
      console.log(diory)
      return diory
    }

    if (command === 'createDiory' && room.diograph) {
      await room.diograph.createDiory({ text: 'Superia' })
      await room.saveRoom()
      console.log('Diory created')
    }
  }
}

export { App }
