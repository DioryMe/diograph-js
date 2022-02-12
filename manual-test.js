const { DiographJson, Dataobject } = require('./dist')
const { join } = require('path')

const test = async () => {
  // Construct diograph object
  const diographJson = new DiographJson({ path: 'fixtures' })

  // Load diograph
  await diographJson.load()

  // RootId
  const rootId = diographJson.rootId
  console.log(rootId)

  // Get diory
  const rootDiory = diographJson.get(rootId)
  console.log(rootDiory)

  // Search text
  const maries = diographJson.search('Ma', 'text')
  console.log(maries.map((diory) => diory.text))

  // Search data
  const dataMaries = diographJson.search('Audio', 'data')
  console.log(dataMaries.map((diory) => diory.text))

  // Update diory
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

  // Save diograph
  await diographJson.save()

  // Delete diory
  const deletedDiory = diographJson.deleteDiory('78661050-900d-4e87-84e2-a5262fca6770')[0]
  if (diographJson.get(deletedDiory.id)) {
    throw new Error("ERROR: Diory wasn't deleted!")
  }

  // Delete dataobject (of that deleted diory)
  const contentUrl = deletedDiory.data[0].contentUrl
  room.deleteDataobject(contentUrl)

  // importFile to diograph
  // const importFilePath = './PIXNIO-53799-6177x4118.jpeg'
  // const otherContentUrl = diographJson.importFile(importFilePath)
  // => fileContentista muodostettu diory on lisätty diographiin
  // Copy dataobject of imported diory to Room
  // room.importDataobject(importFilePath, otherContentUrl)
  // => alkuperäinen filu on tuotu oikealle paikalleen dioryFolderiin
}

test()
