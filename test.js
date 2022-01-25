const Diograph = require('.').default

const diograph = new Diograph({ path: 'diograph.json' })
diograph.load().then((bool) => {
  console.log(bool)
  console.log(diograph.rootId)
})
