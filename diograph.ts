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
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, diographJsonContents) => {
        if (err) {
          reject(err)
        }
        const parsedJson = JSON.parse(diographJsonContents)
        this.rootId = parsedJson.rootId
        this.diograph = parsedJson.diograph
        resolve(true)
      })
    })
  }

  get = (id: string) => {
    return this.diograph[id]
  }
}

export default Diograph
