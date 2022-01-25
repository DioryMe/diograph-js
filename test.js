const Diograph = require('.').default

const test = async () => {
  const diograph = new Diograph({ path: 'diograph.json' })
  const bool = await diograph.load()

  console.log(bool)
  console.log(diograph.rootId)
}

test()
