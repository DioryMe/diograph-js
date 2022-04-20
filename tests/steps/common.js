const { existsSync, readFileSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { Given, When, Then } = require('@cucumber/cucumber')
const testApp = require('../test-app')

const path = join(__dirname, '..', 'temp-room')

Given('I have empty place for room', async () => {
  await testApp(['local', path, 'delete'])
})

Given('I have initiated a room', async () => {
  // NOTE: This should be alias for 'I initiate room'
  await testApp(['local', path, 'delete'])
  await testApp(['local', path])
})

When('I initiate room', async () => {
  // If room already exists, this connects to it instead of initiating a new one
  await testApp(['local', path])
})

When('I delete room', async () => {
  await testApp(['local', path, 'delete'])
})

When('I add client to room', async () => {
  await testApp(['local', path, 'addClient'])
})

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(path, `${fileName}`)), doesOrNot === 'does')
})

Then('room.json has {word} client(s)', (clientCount) => {
  const roomJsonContents = readFileSync(join(path, 'room.json'), { encoding: 'utf8' })
  const roomJson = JSON.parse(roomJsonContents)
  assert(roomJson.clients, 'Invalid room.json, clients not found')
  assert.equal(roomJson.clients.length, clientCount === 'no' ? 0 : parseInt(clientCount, 10))
})
