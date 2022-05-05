const { When, Then } = require('@cucumber/cucumber')
const { readFileSync } = require('fs')
const { join } = require('path')
const assert = require('assert')
const { App } = require('../../dist/testApp/test-app')

const TEMP_ROOM_PATH = join(process.cwd(), 'tmp')

When('I call {word} for diograph', async (apiAction) => {
  const testApp = new App()
  await testApp.run(apiAction)
})

Then('I receive a diory', async () => {
  const testApp = new App()
  const response = await testApp.run('getDiory')
  assert.ok(response)
  assert.equal(response.id, 'some-diory-id')
  assert.equal(response.text, 'Root diory')
})

Then('diograph.json has {word} diories', (dioryCount) => {
  const diographContents = readFileSync(join(TEMP_ROOM_PATH, 'diograph.json'), {
    encoding: 'utf8',
  })
  const diograph = JSON.parse(diographContents)
  assert(diograph.diograph, 'Invalid diograph.json, diograph not found')
  assert.equal(
    Object.values(diograph.diograph).length,
    dioryCount === 'no' ? 0 : parseInt(dioryCount, 10),
  )
})

Then('last diory has {word} as {word}', (value, property) => {
  const diographContents = readFileSync(join(TEMP_ROOM_PATH, 'diograph.json'), {
    encoding: 'utf8',
  })
  const diograph = JSON.parse(diographContents)
  assert(diograph.diograph, 'Invalid diograph.json, diograph not found')
  const diories = Object.values(diograph.diograph)
  const lastDiory = diories[diories.length - 1]

  if (property === 'image') {
    assert.equal(lastDiory.image, `images/${lastDiory.id}`)
  } else if (property === 'contentUrl') {
    assert.equal(lastDiory.data[0].contentUrl, `Diory Content/${lastDiory.id}`)
  }
})
