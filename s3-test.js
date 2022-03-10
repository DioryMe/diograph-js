const { writeFile } = require('fs/promises')
const { S3Connector } = require('./dist/connectors')

const s3 = new S3Connector()
s3.getDataobject('aeb1a73f-2450-4a8f-b1c9-48a2f25e1219/kokurikozaka049.jpeg').then(
  (data) => {
    console.log('jee')
    writeFile('testi.jpg', data).then(
      () => {
        console.log('ASDFASDF')
      },
      () => {
        console.log('BUUUU')
      },
    )
  },
  (e) => {
    console.log(e)
    console.log('BUUUU22222')
  },
)
