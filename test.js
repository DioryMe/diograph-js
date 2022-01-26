const DiographJson = require('./dist').default

const test = async () => {
  const diographJson = new DiographJson({ path: 'diograph.json' })

  await diographJson.load()

  const rootId = diographJson.rootId
  console.log(rootId)

  const rootDiory = diographJson.get(rootId)
  console.log(rootDiory)

  const maries = diographJson.search('Ma')
  console.log(maries.map((diory) => diory.text))

  diographJson.save()
}

test()
