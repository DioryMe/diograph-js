import * as fs from 'fs'

interface DiographParams {
  path: string
}

interface Diograph {
  rootId: string
  diograph: object
}

class Diograph {
  path: string
  rootId: string = ''
  diograph: object = {}

  constructor({ path }: DiographParams) {
    this.path = path
  }

  load = () => {
    fs.readFile(this.path, 'utf8', (err, diographJsonContents) => {
      if (err) {
        throw err
      }
      const parsedJson = JSON.parse(diographJsonContents)
      this.rootId = parsedJson.rootId
      this.diograph = parsedJson.diograph
      console.log(this.rootId)
      console.log(Object.keys(this.diograph)[0])
    })
  }
}

export default Diograph
