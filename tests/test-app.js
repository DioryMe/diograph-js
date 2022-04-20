const { Room, LocalRoomClient } = require('../dist')

const clientType = process.argv[2]
const path = process.argv[3]
const command = process.argv[4]

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

room.loadOrInitiateRoom().then(
  () => {
    console.log('Connected to Room: initiation completed & saved to app-data.json!')
    if (command === 'delete') {
      room.deleteRoom().then(() => {
        console.log('Room deleted.')
      })
    }
  },
  (e) => {
    console.log('error', e)
  },
)
