const { When, Then } = require('@cucumber/cucumber')
const { readFileSync } = require('fs')
const { join } = require('path')
const assert = require('assert')
const { App } = require('../../dist/testApp/test-app')

const TEMP_ROOM_PATH = join(__dirname, '..', '..', 'testApp', 'temp-room')

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
  const diographJsonContents = readFileSync(join(TEMP_ROOM_PATH, 'diograph.json'), {
    encoding: 'utf8',
  })
  const diographJson = JSON.parse(diographJsonContents)
  assert(diographJson.diograph, 'Invalid diograph.json, diograph not found')
  assert.equal(
    Object.values(diographJson.diograph).length,
    dioryCount === 'no' ? 0 : parseInt(dioryCount, 10),
  )
})
