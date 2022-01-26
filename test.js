const DiographJson = require('./dist').default

const test = async () => {
  const diographJson = new DiographJson({ path: 'diograph.json' })

  await diographJson.load()

  const rootId = diographJson.rootId
  console.log(rootId)

  const rootDiory = diographJson.get(rootId)
  console.log(rootDiory)

  diographJson.save()
}

test()
