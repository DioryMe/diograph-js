const { existsSync, readFileSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../dist/testApp/test-app')

const TEMP_ROOM_PATH = join(__dirname, '..', '..', 'testApp', 'temp-room')
const APPLICATION_SUPPORT_ROOM_PATH = join(process.cwd(), 'fixtures', 'content-source')

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

When('I call {word} operation', async (operation) => {
  await testApp.run(operation)
})

Then('I can call {word} operation', async (operation) => {
  await testApp.run(operation).then((response) => {
    // TODO: Read these from app-data.json
    switch (operation) {
      case 'appListRooms': {
        assert.equal(response.length, 1)
        break
      }
      case 'appListClients': {
        assert.equal(response.length, 1)
        break
      }
      default:
    }
  })
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

Then('Content source diograph.json has {word} diories', (dioryCount) => {
  const contentSourceDiographJsonContents = readFileSync(
    join(APPLICATION_SUPPORT_ROOM_PATH, 'diograph.json'),
    {
      encoding: 'utf8',
    },
  )
  const diographJson = JSON.parse(contentSourceDiographJsonContents)
  assert.equal(Object.keys(diographJson.diograph).length, parseInt(dioryCount, 10))
})
