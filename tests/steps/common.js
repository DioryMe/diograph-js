const { existsSync, readFileSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../dist/testApp/test-app')

const TEMP_ROOM_PATH = join(__dirname, '..', '..', 'testApp', 'temp-room')
const APPLICATION_SUPPORT_ROOM_PATH = join(process.cwd(), 'content-source-room')

const testApp = new App()

Given('I have empty place for room', async () => {
  await testApp.run('deleteRoom')
  await testApp.run('resetApp')
})

Given('I have initiated a room', async () => {
  // NOTE: This should be alias for 'I initiate room'
  await testApp.run('deleteRoom')
  await testApp.run('addRoom', TEMP_ROOM_PATH)
})

When('I initiate room', async () => {
  // If room already exists, this connects to it instead of initiating a new one
  await testApp.run('addRoom', TEMP_ROOM_PATH)
})

When('I delete room', async () => {
  await testApp.run('deleteRoom')
})

When('I add client to room', async () => {
  await testApp.run('addClient', APPLICATION_SUPPORT_ROOM_PATH)
})

When('I call {word} operation for client', async (operation) => {
  switch (operation) {
    case 'list': {
      await testApp.run('listClientContents')
      break
    }
    default:
  }
})

Then('I can call {word} operation for {word}', async (operation, component) => {
  if (component === 'client') {
    switch (operation) {
      case 'import': {
        const response = await testApp.run('importClientContent')
        assert.equal(response, 'diory')
        break
      }
      default:
    }
  } else if (component === 'app') {
    switch (operation) {
      case 'listRooms': {
        const response = await testApp.run('appListRooms')
        assert.equal(response.length, 1)
        break
      }
      case 'listClients': {
        const response = await testApp.run('appListClients')
        assert.equal(response.length, 1)
        break
      }
      default:
    }
  }
})

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(TEMP_ROOM_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('{word} {word} exists in application support room', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(APPLICATION_SUPPORT_ROOM_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('room.json has {word} client(s)', (clientCount) => {
  const roomJsonContents = readFileSync(join(TEMP_ROOM_PATH, 'room.json'), { encoding: 'utf8' })
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.clients, 'Invalid room.json, clients not found')
  assert.equal(roomJson.clients.length, clientCount === 'no' ? 0 : parseInt(clientCount, 10))
})
