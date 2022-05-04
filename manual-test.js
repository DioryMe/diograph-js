const { existsSync } = require('fs')
const { readFile } = require('fs/promises')
const { join } = require('path')
const { Room, LocalRoomClient } = require('./dist')

const importFileTest = async (diograph, room, filePath) => {
  const givenContentUrl = 'tosi-hieno-content-url'
  // 1. Create diory from file
  const { diory, contentUrl } = await diograph.importDioryFromFile(filePath, givenContentUrl)
  console.log('Diory imported from file:', diory)
  // 2. Import dataobject
  const sourceFileContent = await readFile(filePath)
  await room.clients[0].writeDataobject(sourceFileContent, contentUrl)
  // 3. Cleanup
  await diograph.deleteDiory(diory.id, { deleteThumbnail: true })
  await room.clients[0].deleteDataobject(contentUrl)
}

const testApi = async () => {
  // Connect to room using localRoomClient
  const roomAddress = join(__dirname, 'fixtures')
  const roomKey = 'secret-key'
  const roomClient = new LocalRoomClient({ address: roomAddress, key: roomKey })

  // Construct diograph & room objects
  const room = new Room(roomAddress, roomClient)
  await room.loadRoom()
  const diograph = room.diograph

  // 0. Load diograph
  await diograph.loadDiograph()

  // RootId
  const { rootId } = diograph

  // 1. Get diory
  const rootDiory = diograph.getDiory(rootId)
  console.log(rootDiory)

  // 2a. Search text
  const maries = diograph.search('Ma', 'text')
  console.log(maries.map((diory) => diory.text))

  // 2b. Search data
  const dataMaries = diograph.search('Audio', 'data')
  console.log(dataMaries.map((diory) => diory.text))

  // 3. Update diory
  try {
    const wronglyUpdatedDiory = diograph.update(rootId, { wrongAttribute: 'some' })
    throw new Error(`This SHOULDNT be printed... ${wronglyUpdatedDiory.wrongAttribute}`)
  } catch (e) {
    console.log('Yes, we got an error!', e.message)
  }

  const originalText = rootDiory.text
  const updatedDiory = diograph.update(rootId, { text: `${originalText} was updated!` })
  console.log(updatedDiory.text)
  diograph.update(rootId, { text: originalText }) // ...and revert it...

  // 4. Import image file
  await importFileTest(diograph, room, './fixtures/PIXNIO-53799-6177x4118.jpeg')

  if (process.env.FFMPEG_PATH) {
    // 5. Import video file
    await importFileTest(diograph, room, './fixtures/Generic Content/some-video.mov')
  } else {
    console.log("SKIPPED: FFMPEG_PATH missing, importing video file can't be tested without it")
  }

  // 6. Save diograph
  await diograph.saveDiograph()
}

const testClientFlow = async () => {
  const path = '/Users/Jouni/AppleCopyPhotos/TestFolder'
  const initiateCmd = `node ./tests/test-app.js local ${path}`
  const deleteCmd = `node ./tests/test-app.js local ${path} delete`
  const { execSync } = require('child_process')
  const initiateOutput = execSync(initiateCmd)

  // Initiate test
  const roomJsonCheck =
    existsSync(join(path, 'room.json')) && (await readFile(join(path, 'room.json')))
  const diographCheck =
    existsSync(join(path, 'diograph.json')) && (await readFile(join(path, 'diograph.json')))
  const appDataCheck =
    existsSync(join(path, 'room.json')) && (await readFile(join(path, 'room.json')))

  if (!roomJsonCheck || !diographCheck || !appDataCheck) {
    throw new Error('Initiate test Failed!')
  }
  console.log(initiateOutput.toString())
  console.log('Room initiation succeeded!')

  // Delete test
  /* const deleteOutput = */ execSync(deleteCmd)
  const roomJsonDeleted = !existsSync(join(path, 'room.json'))
  const diographDeleted = !existsSync(join(path, 'diograph.json'))

  if (!roomJsonDeleted || !diographDeleted) {
    throw new Error('Delete test Failed!')
  }
  // console.log(deleteOutput.toString())
  console.log('Room delete succeeded!')

  console.log('Client flow succeeded!')
}

const test = async () => {
  await testApi()
  await testClientFlow()
}

test()
