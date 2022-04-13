const { Room, LocalRoomClient } = require('./dist')

const clientType = process.argv[2]
const path = process.argv[3]

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
room.initiateRoom()

console.log('Connected to Room: initiation completed & saved to app-data.json!')
