const { DiographJson, Room } = require('./dist')
const { readFile } = require('fs/promises')
const { dioryVideoGenerator } = require('./dist/generators/video')

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

  // 4a. importFile (image)
  const importImageFilePath = './PIXNIO-IMPORT-TEST.jpeg'
  let { diory, contentUrl } = await diographJson.importDioryFromFile(
    importImageFilePath,
    'tosi-hieno-content-url.jiipeegee',
  )
  console.log('Diory imported from file:', diory)
  // 4b. importDataobject
  let sourceFileContent = await readFile(importImageFilePath)
  await room.importDataobject(sourceFileContent, 'tosi-hieno-content-url.jiipeegee')
  // 4c. Cleanup importFile & importDataobject mess...
  await diographJson.deleteDiory(diory.id, { deleteThumbnail: true })
  await room.deleteDataobject(contentUrl)

  // 5a. importFile (image)
  const importVideoFilePath = './test.mov'
  const joo = await diographJson.importDioryFromFile(
    importVideoFilePath,
    'viela-hienompi-content-url.moooov',
  )
  diory = joo.diory
  contentUrl = joo.contentUrl
  console.log('Diory imported from file:', diory)
  // 5b. importDataobject
  sourceFileContent = await readFile(importVideoFilePath)
  await room.importDataobject(sourceFileContent, 'viela-hienompi-content-url.moooov')
  // 5c. Cleanup importFile & importDataobject mess...
  await diographJson.deleteDiory(diory.id, { deleteThumbnail: true })
  await room.deleteDataobject(contentUrl)

  // 6. Save diograph
  await diographJson.saveDiograph()
}

test()
