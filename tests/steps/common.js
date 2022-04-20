const { existsSync, readFileSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const testApp = require('../test-app')

const path = '/Users/Jouni/AppleCopyPhotos/TestFolder'

Given('I have empty place for room', () => {})

When('I initiate room', async () => {
  await testApp(['local', path])
})

When('I delete room', async () => {
  await testApp(['local', path, 'delete'])
})

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(path, `${fileName}`)), doesOrNot === 'does')
})

Then('room.json has {word} client(s)', (clientCount) => {
  const roomJsonContents = readFileSync(join(path, 'room.json'), { encoding: 'utf8' })
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.clients, 'Invalid room.json, clients not found')
  assert.equal(roomJson.clients, clientCount === 'no' ? 0 : clientCount)
})
