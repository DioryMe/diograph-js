const { cp } = require('fs/promises')
const { DiographJson, Room } = require('./dist')

const test = async () => {
  const importFilePath = './PIXNIO-IMPORT-TEST.jpeg'

  // Construct diograph & room objects
  const diographJson = new DiographJson({ baseUrl: 'fixtures' })
  const room = new Room({ baseUrl: 'fixtures' })

  // 0. Load diograph
  await diographJson.load()

  // RootId
  const rootId = diographJson.rootId
  console.log(rootId)

  // 1. Get diory
  const rootDiory = diographJson.get(rootId)
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

  // 4a. importFile
  const { diory, contentUrl } = await diographJson.importFile(
    importFilePath,
    'tosi-hieno-content-url.jiipeegee',
  )
  console.log('Diory imported from file:', diory)
  // 4b. importDataobject
  await room.importDataobject(importFilePath, 'tosi-hieno-content-url.jiipeegee')
  // ...cleanup importFile & importDataobject mess...
  await diographJson.deleteDiory(diory.id, { deleteThumbnail: true })
  await room.deleteDataobject(contentUrl)

  // 5. Save diograph
  await diographJson.save()

  // 6a. Delete diory
  const deletedDiory = (await diographJson.deleteDiory('78661050-900d-4e87-84e2-a5262fca6770'))[0]
  if (diographJson.get(deletedDiory.id)) {
    throw new Error("ERROR: Diory wasn't deleted!")
  }
  // 6b. Delete dataobject (of that deleted diory)
  const deletedDioryContentUrl = deletedDiory.data[0].contentUrl
  await room.deleteDataobject(deletedDioryContentUrl)

  // Import the same dataobject back to diograph
  await cp('./PIXNIO-IMPORT-TEST.jpeg', './fixtures/PIXNIO-53799-6177x4118.jpeg')
}

test()
