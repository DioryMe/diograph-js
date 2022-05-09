const { existsSync, readFileSync, rmSync, mkdirSync, readdirSync, lstatSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const { App } = require('../../dist/testApp/test-app')

const CONTENT_SOURCE_FOLDER = join(process.cwd(), 'fixtures', 'content-source')
const APP_DATA_PATH = join(process.cwd(), 'tmp')
const TEMP_ROOM_PATH = APP_DATA_PATH
const IMAGE_FOLDER_PATH = join(APP_DATA_PATH, 'images') // <-- this is deleted recursively!
const CONTENT_FOLDER_PATH = join(APP_DATA_PATH, 'Diory Content') // <-- this is deleted recursively!

const testApp = new App()

Given('I have empty place for room', async () => {
  await testApp.run('deleteRoom')
  await testApp.run('resetApp')
  existsSync(join(APP_DATA_PATH, 'app-data.json')) &&
    (await rmSync(join(APP_DATA_PATH, 'app-data.json')))
  existsSync(IMAGE_FOLDER_PATH) && (await rmSync(IMAGE_FOLDER_PATH, { recursive: true }))
  existsSync(CONTENT_FOLDER_PATH) && (await rmSync(CONTENT_FOLDER_PATH, { recursive: true }))
})

// WHEN

When('I initiate a room', async () => {
  // If room already exists, this connects to it instead of initiating a new one
  await testApp.run('addRoom', TEMP_ROOM_PATH)
})

When('I delete room', async () => {
  await testApp.run('deleteRoom')
})

When('I add connection to {word}', async (destination) => {
  let connectionAddress
  switch (destination) {
    case 'content-source-folder':
      connectionAddress = CONTENT_SOURCE_FOLDER
      break
    case 'DioryContent':
      connectionAddress = CONTENT_FOLDER_PATH
      break
    default:
      break
  }

  if (!existsSync(connectionAddress)) {
    throw new Error(`ERROR: connectionAddress not found ${connectionAddress}`)
  }
  await testApp.run('addConnection', connectionAddress)
})

When('I call importDiory', async () => {
  const imageFilePath = join(APP_DATA_PATH, '..', 'fixtures', 'PIXNIO-53799-6177x4118.jpeg')
  await testApp.run('importDiory', imageFilePath)
})

When('I call importDiory with content', async () => {
  const imageFilePath = join(APP_DATA_PATH, '..', 'fixtures', 'PIXNIO-53799-6177x4118.jpeg')
  await testApp.run('importDiory', imageFilePath, true)
})

When('I call {word} operation', async (operation) => {
  await testApp.run(operation)
})

When('I call {word} for diograph', async (apiAction) => {
  const testApp = new App()
  await testApp.run(apiAction)
})

// THEN

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(TEMP_ROOM_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('{word} {word} exists in application support room', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(APP_DATA_PATH, `${fileName}`)), doesOrNot === 'does')
})

Then('room.json has {word} connection(s)', (clientCount) => {
  const roomJsonContents = readFileSync(join(TEMP_ROOM_PATH, 'room.json'), { encoding: 'utf8' })
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.connections, 'Invalid room.json, connections not found')
  assert.equal(roomJson.connections.length, clientCount === 'no' ? 0 : parseInt(clientCount, 10))
})

Then('appData has {word} room(s)', (count) => {
  const appDataContents = readFileSync(join(APP_DATA_PATH, 'app-data.json'), { encoding: 'utf8' })
  const appData = JSON.parse(appDataContents)

  assert.equal(appData.rooms.length, parseInt(count, 10))
})

Then('Content source diograph.json has {int} diories', (dioryCount) => {
  // const contentSourceDiographJsonContents = readFileSync(join(CACHE_PATH, 'diograph.json'), {
  //   encoding: 'utf8',
  // })
  // const diograph = JSON.parse(contentSourceDiographJsonContents)
  // assert.equal(Object.keys(diograph.diograph).length, dioryCount)
})

Then('images folder has {int} image', (count) => {
  const imageFileList = lstatSync(IMAGE_FOLDER_PATH).isDirectory() && readdirSync(IMAGE_FOLDER_PATH)
  assert.equal(imageFileList.length, count)
})

Then('content folder has {int} file(s)', (count) => {
  const contentFileList =
    lstatSync(CONTENT_FOLDER_PATH).isDirectory() && readdirSync(CONTENT_FOLDER_PATH)
  assert.equal(contentFileList.length, count)
})

Then('I receive a diory', async () => {
  const testApp = new App()
  const response = await testApp.run('getDiory')
  assert.ok(response)
  assert.equal(response.id, 'some-diory-id')
  assert.equal(response.text, 'Root diory')
})

Then('diograph.json has {word} diories', (dioryCount) => {
  const diographContents = readFileSync(join(TEMP_ROOM_PATH, 'diograph.json'), {
    encoding: 'utf8',
  })
  const diograph = JSON.parse(diographContents)
  assert(diograph.diograph, 'Invalid diograph.json, diograph not found')
  assert.equal(
    Object.values(diograph.diograph).length,
    dioryCount === 'no' ? 0 : parseInt(dioryCount, 10),
  )
})

Then('last diory has {word} as {word}', (value, property) => {
  const diographContents = readFileSync(join(TEMP_ROOM_PATH, 'diograph.json'), {
    encoding: 'utf8',
  })
  const diograph = JSON.parse(diographContents)
  assert(diograph.diograph, 'Invalid diograph.json, diograph not found')
  const diories = Object.values(diograph.diograph)
  const lastDiory = diories[diories.length - 1]

  if (property === 'image') {
    assert.equal(lastDiory.image, `images/${lastDiory.id}`)
  } else if (property === 'contentUrl') {
    assert.equal(lastDiory.data[0].contentUrl, `Diory Content/${lastDiory.id}`)
  } else if (property === 'encodingFormat') {
    assert.equal(lastDiory.data[0].encodingFormat, value)
  }
})

Then('last connection has {int} contentUrls', (value) => {
  const roomJsonContents = readFileSync(join(TEMP_ROOM_PATH, 'room.json'), {
    encoding: 'utf8',
  })
  const roomJson = JSON.parse(roomJsonContents)
  const lastConnection = roomJson.connections[roomJson.connections.length - 1]

  assert.equal(Object.values(lastConnection.contentUrls).length, value)
})
