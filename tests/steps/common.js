const { existsSync, readFileSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const testApp = require('../test-app')

const TEMP_ROOM_PATH = join(__dirname, '..', 'temp-room')

Given('I have empty place for room', async () => {
  await testApp(['deleteRoom'])
  await testApp(['resetApp'])
})

Given('I have initiated a room', async () => {
  // NOTE: This should be alias for 'I initiate room'
  await testApp(['deleteRoom'])
  await testApp(['addRoom', TEMP_ROOM_PATH])
})

When('I initiate room', async () => {
  // If room already exists, this connects to it instead of initiating a new one
  await testApp(['addRoom', TEMP_ROOM_PATH])
})

When('I delete room', async () => {
  await testApp(['deleteRoom'])
})

When('I add client to room', async () => {
  await testApp(['addClient'])
})

Then('I can call {word} operation for client', async (operation) => {
  switch (operation) {
    case 'list': {
      const response = await testApp(['listClientContents'])
      assert.equal(response, 'a list 123')
      break
    }
    case 'import': {
      const response = await testApp(['importClientContent'])
      assert.equal(response, 'diory')
      break
    }
    default:
  }
})

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(TEMP_ROOM_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('room.json has {word} client(s)', (clientCount) => {
  const roomJsonContents = readFileSync(join(TEMP_ROOM_PATH, 'room.json'), { encoding: 'utf8' })
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.clients, 'Invalid room.json, clients not found')
  assert.equal(roomJson.clients.length, clientCount === 'no' ? 0 : parseInt(clientCount, 10))
})
