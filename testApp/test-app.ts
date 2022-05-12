import { Room, LocalRoomClient } from '..'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile, rm } from 'fs/promises'
import { join } from 'path'
import { ConnectionObject } from '../types'
import { Connection } from '../connection'
import { generateDioryFromFile } from '../generators'
import { Diory } from '../diory'
import { generateDioryFromFolder } from '../generators/folder'
import { LocalContentSourceClient } from '../clients'

const appDataFolderPath = process.env['APP_DATA_FOLDER'] || join(process.cwd(), 'tmp')
if (!existsSync(appDataFolderPath)) {
  mkdirSync(appDataFolderPath)
}
const APP_DATA_PATH = join(appDataFolderPath, 'app-data.json')

interface RoomData {
  address: string
}

interface AppData {
  rooms: RoomData[]
}

class App {
  appData: AppData = {
    rooms: [],
  }
  rooms: Room[] = []
  connections: Connection[] = []

  constructor() {}

  getClient = (connection: Connection) => {
    switch (connection.type) {
      case 'local':
        return new LocalContentSourceClient({ address: connection.address }, connection)
      default:
        throw new Error(`Couldn't get Client for Connection type: ${connection.type}`)
        break
    }
  }

  // ==========================0 ==============================
  // This is localClient specific and should be extracted away...
  generateDioriesFromPaths = async (filePaths: string[], subfolderPaths: string[]) => {
    const subfolderDiories: Diory[] = await Promise.all(
      subfolderPaths.map((subfolderPath) => generateDioryFromFolder(subfolderPath)),
    )
    const fileDiories: Diory[] = await Promise.all(
      filePaths.map((filePath) => generateDioryFromFile(filePath)),
    )
    return subfolderDiories.concat(fileDiories)
  }

  generateDiograph = async (
    folderPath: string,
    filePaths: string[] = [],
    subfolderPaths: string[] = [],
  ) => {
    const diories = await this.generateDioriesFromPaths(filePaths, subfolderPaths)
    const rootDiory = generateDioryFromFolder(folderPath)

    return diories.concat([rootDiory])
  }
  // ==========================0 ==============================

  // list() should be connection specific => choose tool according to connection type!
  //  - 1. app gets tool according to connection
  //  - 2. app calls list with the tool (and gives connection to it)
  //        - tool knows which client to use
  //  - 3. tool's list()
  //      a. generates diories according to given argument (e.g. path for localClient)
  //      b. returns diograph of the content-source contents
  //      c. saves (cached) diories to connection
  list = async (folderPath: string, room: Room) => {
    const connection = room.connections[1]
    const client = this.getClient(connection)
    // => should we call for "localFolder tool" to get generated diories?
    //    - getTool instead of getClient?
    //    - localFolder tool has client

    // ==========================0 ==============================
    // This is localClient specific and should be extracted away...
    const { absolutePath, filePaths, subfolderPaths } = await client.list(folderPath)

    const generatedDiories: Diory[] = await this.generateDiograph(
      absolutePath,
      filePaths,
      subfolderPaths,
    )
    // ==========================0 ==============================

    generatedDiories.forEach((generatedDiory) => {
      connection.addContentUrl(generatedDiory.id, '123abc', generatedDiory)
    })

    return this.toDiograph(generatedDiories)
  }

  toDiograph = (diories: Diory[]) => {
    const diograph: any = {}
    diories.forEach((diory: Diory) => (diograph[diory.id] = diory.toDioryObject()))
    return diograph
  }

  initiateAppData = async () => {
    // Initiate app data if doesn't exist yet
    if (!existsSync(APP_DATA_PATH)) {
      const defaultAppData = { rooms: [] }
      await writeFile(APP_DATA_PATH, JSON.stringify(defaultAppData, null, 2))
    }

    const appDataContents = await readFile(APP_DATA_PATH, { encoding: 'utf8' })
    this.appData = JSON.parse(appDataContents)

    // Load rooms
    await Promise.all(
      this.appData.rooms.map(async (roomData) => {
        if (!existsSync(roomData.address)) {
          throw new Error('Invalid room address in app-data.json')
        }
        const client = new LocalRoomClient({ address: roomData.address })
        const room = new Room(roomData.address, client)
        await this.addAndLoadRoom(room)
      }),
    )
  }

  saveAppData = async () => {
    const jsonAppData = {
      rooms: this.rooms.map((room) => ({ address: room.address })),
    }
    await writeFile(APP_DATA_PATH, JSON.stringify(jsonAppData, null, 2))
  }

  addAndLoadRoom = async (room: Room) => {
    const exists = this.rooms.find((existingRoom) => existingRoom.address === room.address)
    if (!exists) {
      await room.loadOrInitiateRoom()
      this.rooms.push(room)
    }
    this.connections = room.connectionData.map((connectionData: ConnectionObject) => {
      const connection = new Connection(connectionData)
      room.addConnection(connection)
      return connection
    })
  }

  run = async (command: string, arg1: string, arg2: string, arg3: string) => {
    if (!command) {
      throw new Error('Command not provided to testApp(), please provide one')
    }

    if (command === 'resetApp') {
      // Remove app-data.json
      existsSync(APP_DATA_PATH) && (await rm(APP_DATA_PATH))
      console.log('App data removed.')
      return
    }

    await this.initiateAppData()

    if (command === 'addRoom') {
      const roomPath = arg1
      if (!arg1) {
        throw new Error('Arg1 not provided for addRoom(), please provide one')
      }
      if (!existsSync(roomPath)) {
        mkdirSync(roomPath)
      }
      const client = new LocalRoomClient({ address: roomPath })
      const room = new Room(roomPath, client)
      await this.addAndLoadRoom(room)
      await this.saveAppData()
      await room.saveRoom()
      console.log('Room added.')
      return
    }

    if (command === 'appListRooms') {
      return this.appData.rooms
    }

    if (!this.rooms.length) {
      console.log('No rooms, please add one!')
      return
    }

    const room = this.rooms[0]

    if (command === 'roomListConnections') {
      return room.connections.map((connection) => ({ address: connection.address }))
    }

    if (command === 'deleteRoom') {
      await room.deleteRoom()
      this.rooms.shift()
      await this.saveAppData()
      console.log('Room deleted.')
      return
    }

    if (command === 'addConnection') {
      const connectionAddress = arg1 || process.cwd()
      const connection = new Connection({ address: connectionAddress, type: 'local' })
      this.connections.push(connection)
      room.addConnection(connection)
      await room.saveRoom()
      console.log('Connection added.')
      return
    }

    if (command === 'listConnections') {
      const connections = this.rooms.flatMap((room) => room.connections)
      return connections.map((connection) => connection.address)
    }

    if (command === 'listClientContents') {
      const list = await this.list('/', room)
      await room.saveRoom()
      return list
    }

    if (command === 'listClientContents2') {
      const list = await this.list('subfolder', room)
      await room.saveRoom()
      return list
    }

    if (command === 'getDiograph' && room.diograph) {
      return room.diograph.diories
    }

    if (command === 'getDiory' && room.diograph) {
      const diory = await room.diograph.getDiory('some-diory-id')
      return diory
    }

    if (command === 'createDiory' && room.diograph) {
      await room.diograph.createDiory({ text: 'Superia' })
      await room.saveRoom()
      console.log('Diory created.')
      return
    }

    if (command === 'deleteDiory' && room.diograph) {
      await room.diograph.deleteDiory(arg1)
      await room.saveRoom()
      console.log('Diory deleted.')
      return
    }

    if (command === 'importDiory' && room.diograph) {
      const filePath = arg1
      const copyContent = arg2

      const diory = await generateDioryFromFile(filePath)
      if (copyContent) {
        const sourceFileContent = await readFile(filePath)
        const client = this.getClient(room.connections[0])
        const contentUrl = await client.addContent(sourceFileContent, diory.id)
        diory.changeContentUrl(contentUrl)
      }
      await room.diograph.addDiory(diory)
      await room.saveRoom()
      return
    }

    if (command === 'getPathFromContentUrl' && room.diograph) {
      const contentUrl = arg1
      const contentPath = room.getContent(contentUrl)
      return contentPath
    }

    if (command === 'dryRun') {
      console.log('Dry run completed.')
    }

    throw new Error(`Invalid command '${command}' (or invalid room...)`)
  }
}

export { App }
