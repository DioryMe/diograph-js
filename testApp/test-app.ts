import { Room, LocalRoomClient, LocalClient } from '..'
import { Client } from '../clients'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm, mkdir } from 'fs/promises'
import { join } from 'path'

const appDataFolderPath = process.env['APP_DATA_FOLDER'] || process.cwd()
const APP_DATA_FOLDER = join(appDataFolderPath, 'app-data.json')
const CONTENT_SOURCE_FOLDER = join(appDataFolderPath, 'content-source-room')

if (!existsSync(CONTENT_SOURCE_FOLDER)) {
  mkdirSync(CONTENT_SOURCE_FOLDER)
}

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

class App {
  appData: AppData = {
    rooms: [],
    clients: [],
  }
  rooms: Room[] = []
  clients: Client[] = []

  constructor() {}

  initiateAppData = async () => {
    // Initiate app data if doesn't exist yet
    if (!existsSync(APP_DATA_FOLDER)) {
      const defaultAppData = { rooms: [], clients: [] }
      await writeFile(APP_DATA_FOLDER, JSON.stringify(defaultAppData, null, 2))
    }

    const appDataContents = await readFile(APP_DATA_FOLDER, { encoding: 'utf8' })
    this.appData = JSON.parse(appDataContents)

    // Load rooms
    await Promise.all(
      this.appData.rooms.map(async (roomData) => {
        const client = new LocalRoomClient({ address: roomData.address })
        const room = new Room(roomData.address, client)
        await this.addAndLoadRoom(room)
      }),
    )

    // Load clients
    await Promise.all(
      this.appData.clients.map(async (clientData) => {
        const client = new LocalClient(clientData.address)
        await this.addAndLoadClient(client)
      }),
    )
  }

  saveAppData = async () => {
    const jsonAppData = {
      rooms: this.rooms.map((room) => ({ address: room.address })),
      clients: this.clients.map((client) => client.toJson()),
    }
    await writeFile(APP_DATA_FOLDER, JSON.stringify(jsonAppData, null, 2))
  }

  addAndLoadRoom = async (room: Room) => {
    const exists = this.rooms.find((existingRoom) => existingRoom.address === room.address)
    if (!exists) {
      await room.loadOrInitiateRoom()
      await Promise.all(
        room.clients.map((client) => {
          return this.addAndLoadClient(client)
        }),
      )
      this.rooms.push(room)
    }
  }

  addAndLoadClient = async (client: Client) => {
    const exists = this.clients.find((existingClient) => existingClient.baseUrl === client.baseUrl)
    if (!exists) {
      this.clients.push(client)
      return client.load()
    }
  }

  run = async (command: string, arg1: string, arg2: string, arg3: string) => {
    if (!command) {
      throw new Error('Command not provided to testApp(), please provide one')
    }

    if (command === 'resetApp') {
      // Remove app-data.json
      existsSync(APP_DATA_FOLDER) && (await rm(APP_DATA_FOLDER))
      // Remove content source room
      await rm(CONTENT_SOURCE_FOLDER, { recursive: true })
      await mkdir(CONTENT_SOURCE_FOLDER)
      console.log('App data removed.')
      return
    }

    await this.initiateAppData()

    if (command === 'addRoom') {
      const roomPath = arg1 || join(__dirname, '..', '..', 'testApp', 'temp-room')
      const client = new LocalRoomClient({ address: roomPath })
      const room = new Room(roomPath, client)
      await this.addAndLoadRoom(room)
      await this.saveAppData()
      console.log('Room added.')
    }

    if (command === 'appListRooms') {
      return this.appData.rooms
    }

    if (command === 'appListClients') {
      return this.appData.clients
    }

    if (!this.rooms.length) {
      console.log('No rooms, please add one!')
      return
    }

    const room = this.rooms[0]

    if (command === 'roomListClients') {
      return room.clients.map((client) => ({ baseUrl: client.baseUrl }))
    }

    if (command === 'deleteRoom') {
      await room.deleteRoom()
      this.rooms.shift()
      await this.saveAppData()
      console.log('Room deleted.')
    }

    if (command === 'addClient') {
      const clientAddress = arg1 || process.cwd()
      const client = await room.addClient(clientAddress)
      await room.saveRoom()
      await this.addAndLoadClient(client)
      await this.saveAppData()
      console.log('Client added.')
    }

    if (command === 'listClientContents') {
      const list = await room.clients[0].list()
      return list
    }

    if (command === 'listClientContents2') {
      const list = await room.clients[0].list('subfolder')
      return list
    }

    if (command === 'importClientContent') {
      const diory = await room.clients[0].import()
      console.log(diory)
      return 'Not implemented.'
    }

    if (command === 'getDiograph' && room.diograph) {
      return room.diograph.diograph
    }

    if (command === 'getDiory' && room.diograph) {
      const diory = await room.diograph.getDiory('some-diory-id')
      return diory
    }

    if (command === 'createDiory' && room.diograph) {
      await room.diograph.createDiory({ text: 'Superia' })
      await room.saveRoom()
      console.log('Diory created.')
    }

    if (command === 'deleteDiory' && room.diograph) {
      await room.diograph.deleteDiory(arg1)
      await room.saveRoom()
      console.log('Diory deleted.')
    }
  }
}

export { App }
