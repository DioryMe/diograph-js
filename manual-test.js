const { DiographJson } = require('./dist')

const test = async () => {
  // Construct
  const diographJson = new DiographJson({ path: 'fixtures' })

  // Load
  await diographJson.load()

  // RootId
  const rootId = diographJson.rootId
  console.log(rootId)

  // Get
  const rootDiory = diographJson.get(rootId)
  console.log(rootDiory)

  // Search text
  const maries = diographJson.search('Ma', 'text')
  console.log(maries.map((diory) => diory.text))

  // Search data
  const dataMaries = diographJson.search('Audio', 'data')
  console.log(dataMaries.map((diory) => diory.text))

  // Update
  try {
    const wronglyUpdatedDiory = diographJson.update(rootId, { wrongAttribute: 'some' })
    console.log(`This SHOULDNT be printed... ${wronglyUpdatedDiory.wrongAttribute}`)
  } catch (e) {
    console.log('Yes, we got an error!', e.message)
  }

  const originalText = rootDiory.text
  const updatedDiory = diographJson.update(rootId, { text: `${originalText} was updated!` })
  console.log(updatedDiory.text)
  diographJson.update(rootId, { text: originalText }) // ...and revert it...

  // Save
  diographJson.save()
}

test()
