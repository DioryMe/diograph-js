const testApp = require('./test-app')

const command = process.argv[2]
const args = process.argv.slice(3)

testApp([command, ...args])
