const { DiographJson, Room } = require('./dist')

const test = async () => {
  const importFilePath = './PIXNIO-53799-6177x4118.jpeg'

  // Construct diograph & room objects
  const diographJson = new DiographJson({ baseUrl: 'fixtures' })
  const room = new Room({ baseUrl: 'fixtures' })

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
  const deletedDiory = (await diographJson.deleteDiory('78661050-900d-4e87-84e2-a5262fca6770'))[0]
  if (diographJson.get(deletedDiory.id)) {
    throw new Error("ERROR: Diory wasn't deleted!")
  }

  // Delete dataobject (of that deleted diory)
  const deletedDioryContentUrl = deletedDiory.data[0].contentUrl
  room.deleteDataobject(deletedDioryContentUrl)

  // Import the same dataobject back to diograph
  room.importDataobject(importFilePath, deletedDioryContentUrl)

  // const { diory, contentUrl } = await diographJson.importFile(
  //   importFilePath,
  //   deletedDioryContentUrl,
  // )
  // const importedDiory = diographJson.get(diory.id)
  // console.log(
  //   'Diory imported:',
  //   importedDiory.text,
  //   importedDiory.id,
  //   diory.id === importedDiory.id,
  // )
  // console.log(
  //   '- dataobject copied to diory folder:',
  //   contentUrl,
  //   importedDiory.data[0].contentUrl === contentUrl,
  // )
  // console.log('- thumbnail copied to /images folder:', importedDiory.image)

  // // Import dataobject to diory folder
  // room.importDataobject(importFilePath, contentUrl)

  // await diographJson.deleteDiory(importedDiory.id, { deleteThumbnail: true })
  // room.deleteDataobject(contentUrl)

  // if (diographJson.get(importedDiory.id)) {
  //   throw new Error('Diory SHOULD HAVE BEEN deleted!')
  // }
  // // => no dataobject
  // // => no thumbnail
}

test()
