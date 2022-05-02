const { existsSync, readFileSync, mkdirSync, rmSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../dist/testApp/test-app')

const TEMP_ROOM_PATH = join(__dirname, '..', '..', 'testApp', 'temp-room')
const CONTENT_SOURCE_FOLDER = join(process.cwd(), 'fixtures', 'content-source')
const APP_DATA_PATH = join(process.cwd(), 'app-data.json')

const testApp = new App()

Given('I have empty place for room', async () => {
  await testApp.run('deleteRoom')
  await testApp.run('resetApp')
  // Remove content source room
  existsSync(join(CONTENT_SOURCE_FOLDER, 'diograph.json')) &&
    rmSync(join(CONTENT_SOURCE_FOLDER, 'diograph.json'))
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
  if (!existsSync(CONTENT_SOURCE_FOLDER)) {
    throw new Error(`ERROR: content-source-folder not found ${CONTENT_SOURCE_FOLDER}`)
  }
  await testApp.run('addClient', CONTENT_SOURCE_FOLDER)
})

When('I call {word} operation', async (operation) => {
  await testApp.run(operation)
})

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(TEMP_ROOM_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('{word} {word} exists in application support room', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(CONTENT_SOURCE_FOLDER, `${fileName}`)), doesOrNot === 'does')
})

Then('room.json has {word} client(s)', (clientCount) => {
  const roomJsonContents = readFileSync(join(TEMP_ROOM_PATH, 'room.json'), { encoding: 'utf8' })
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.clients, 'Invalid room.json, clients not found')
  assert.equal(roomJson.clients.length, clientCount === 'no' ? 0 : parseInt(clientCount, 10))
})

Then('appData has {word} {word}', (count, type) => {
  const appDataContents = readFileSync(APP_DATA_PATH, { encoding: 'utf8' })
  const appData = JSON.parse(appDataContents)

  if (type === 'rooms') {
    assert.equal(appData.rooms.length, parseInt(count, 10))
  } else if (type === 'clients') {
    assert.equal(appData.clients.length, parseInt(count, 10))
  }
})

Then('Content source diograph.json has {word} diories', (dioryCount) => {
  const contentSourceDiographJsonContents = readFileSync(
    join(CONTENT_SOURCE_FOLDER, 'diograph.json'),
    {
      encoding: 'utf8',
    },
  )
  const diographJson = JSON.parse(contentSourceDiographJsonContents)
  assert.equal(Object.keys(diographJson.diograph).length, parseInt(dioryCount, 10))
})
