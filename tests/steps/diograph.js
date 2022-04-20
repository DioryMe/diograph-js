const { When, Then } = require('@cucumber/cucumber')
const { readFileSync } = require('fs')
const { join } = require('path')
const assert = require('assert')
const testApp = require('../test-app')

const path = join(__dirname, '..', 'temp-room')

When('I call {word} for diograph', async (apiAction) => {
  await testApp(['local', path, apiAction])
})

Then('I receive a diory', async () => {
  const response = await testApp(['local', path, 'getDiory'])
  assert.ok(response)
  assert.equal(response.id, 'some-diory-id')
  assert.equal(response.text, 'Root diory')
})

Then('diograph.json has {word} diories', (dioryCount) => {
  const diographJsonContents = readFileSync(join(path, 'diograph.json'), { encoding: 'utf8' })
  const diographJson = JSON.parse(diographJsonContents)
  assert(diographJson.diograph, 'Invalid diograph.json, diograph not found')
  assert.equal(
    Object.values(diographJson.diograph).length,
    dioryCount === 'no' ? 0 : parseInt(dioryCount, 10),
  )
})
