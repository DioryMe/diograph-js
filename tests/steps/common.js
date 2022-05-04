const { existsSync, readFileSync, rmSync, mkdirSync, readdirSync, lstatSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../dist/testApp/test-app')

const CONTENT_SOURCE_FOLDER = join(process.cwd(), 'fixtures', 'content-source')
const APP_DATA_PATH = join(process.cwd(), 'tmp')
const TEMP_ROOM_PATH = APP_DATA_PATH
const IMAGE_FOLDER_PATH = join(APP_DATA_PATH, 'images')
const CACHE_PATH = join(APP_DATA_PATH, 'local-client-cache')
if (!existsSync(CACHE_PATH)) {
  mkdirSync(CACHE_PATH)
}

const testApp = new App()

Given('I have empty place for room', async () => {
  await testApp.run('deleteRoom')
  await testApp.run('resetApp')
  existsSync(join(CACHE_PATH, 'diograph.json')) && (await rmSync(join(CACHE_PATH, 'diograph.json')))
  existsSync(join(CACHE_PATH, 'app-data.json')) && (await rmSync(join(CACHE_PATH, 'app-data.json')))
  // TODO: Remove also images/ folder
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

When('I add connection to room', async () => {
  if (!existsSync(CONTENT_SOURCE_FOLDER)) {
    throw new Error(`ERROR: content-source-folder not found ${CONTENT_SOURCE_FOLDER}`)
  }
  await testApp.run('addConnection', CONTENT_SOURCE_FOLDER)
})

When('I call importDiory', async () => {
  const imageFilePath = join(APP_DATA_PATH, '..', 'fixtures', 'PIXNIO-53799-6177x4118.jpeg')
  await testApp.run('importDiory', imageFilePath)
})

When('I call {word} operation', async (operation) => {
  await testApp.run(operation)
})

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(TEMP_ROOM_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('{word} {word} exists in application support room', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(CACHE_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('room.json has {word} connection(s)', (clientCount) => {
  const roomJsonContents = readFileSync(join(TEMP_ROOM_PATH, 'room.json'), { encoding: 'utf8' })
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.clients, 'Invalid room.json, clients not found')
  assert.equal(roomJson.clients.length, clientCount === 'no' ? 0 : parseInt(clientCount, 10))
})

Then('appData has {word} room(s)', (count) => {
  const appDataContents = readFileSync(join(APP_DATA_PATH, 'app-data.json'), { encoding: 'utf8' })
  const appData = JSON.parse(appDataContents)

  assert.equal(appData.rooms.length, parseInt(count, 10))
})

Then('Content source diograph.json has {word} diories', (dioryCount) => {
  const contentSourceDiographJsonContents = readFileSync(join(CACHE_PATH, 'diograph.json'), {
    encoding: 'utf8',
  })
  const diograph = JSON.parse(contentSourceDiographJsonContents)
  assert.equal(Object.keys(diograph.diograph).length, parseInt(dioryCount, 10))
})

Then('images folder has {int} image', (count) => {
  const imageFileList = lstatSync(IMAGE_FOLDER_PATH).isDirectory() && readdirSync(IMAGE_FOLDER_PATH)
  assert.equal(imageFileList.length, count)
})
