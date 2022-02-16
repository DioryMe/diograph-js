const { DiographJson, Room } = require('./dist')
const { readFile } = require('fs/promises')
const { dioryVideoGenerator } = require('./dist/generators/video')

const importFileTest = async (diographJson, room, filePath) => {
  const givenContentUrl = 'tosi-hieno-content-url'
  // 1. Create diory from file
  const { diory, contentUrl } = await diographJson.importDioryFromFile(filePath, givenContentUrl)
  console.log('Diory imported from file:', diory)
  // 2. Import dataobject
  let sourceFileContent = await readFile(filePath)
  await room.importDataobject(sourceFileContent, contentUrl)
  // 3. Cleanup
  await diographJson.deleteDiory(diory.id, { deleteThumbnail: true })
  await room.deleteDataobject(contentUrl)
}

const test = async () => {
  // Construct diograph & room objects
  const diographJson = new DiographJson({ baseUrl: 'fixtures' })
  const room = new Room({ baseUrl: 'fixtures' })

  // 0. Load diograph
  await diographJson.loadDiograph()

  // RootId
  const rootId = diographJson.rootId
  console.log(rootId)

  // 1. Get diory
  const rootDiory = diographJson.getDiory(rootId)
  console.log(rootDiory)

  // 2a. Search text
  const maries = diographJson.search('Ma', 'text')
  console.log(maries.map((diory) => diory.text))

  // 2b. Search data
  const dataMaries = diographJson.search('Audio', 'data')
  console.log(dataMaries.map((diory) => diory.text))

  // 3. Update diory
  try {
    const wronglyUpdatedDiory = diographJson.update(rootId, { wrongAttribute: 'some' })
    throw new Error(`This SHOULDNT be printed... ${wronglyUpdatedDiory.wrongAttribute}`)
  } catch (e) {
    console.log('Yes, we got an error!', e.message)
  }

  const originalText = rootDiory.text
  const updatedDiory = diographJson.update(rootId, { text: `${originalText} was updated!` })
  console.log(updatedDiory.text)
  diographJson.update(rootId, { text: originalText }) // ...and revert it...

  // 4. Import image file
  await importFileTest(diographJson, room, './PIXNIO-IMPORT-TEST.jpeg')

  // 5. Import video file
  await importFileTest(diographJson, room, './test.mov')

  // 6. Save diograph
  await diographJson.saveDiograph()
}

test()
