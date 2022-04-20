const { existsSync } = require('fs')
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

// Then('the first result is {stringInDoubleQuotes}', function () {})
