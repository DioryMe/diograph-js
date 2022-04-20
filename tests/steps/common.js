const { existsSync } = require('fs')
const assert = require('assert')
const { join } = require('path')
const { execSync } = require('child_process')
const { Given, When, Then } = require('@cucumber/cucumber')

const path = '/Users/Jouni/AppleCopyPhotos/TestFolder'
const initiateCmd = `node ./tests/test-app.js local ${path}`
const deleteCmd = `node ./tests/test-app.js local ${path} delete`

Given('I have empty place for room', () => {})

When('I initiate room', () => {
  execSync(initiateCmd)
})

When('I delete room', () => {
  execSync(deleteCmd)
})

Then('{word} {word} exists', (fileName, doesOrNot) => {
  assert.equal(existsSync(join(path, `${fileName}`)), doesOrNot === 'does')
})

// Then('the first result is {stringInDoubleQuotes}', function () {})
