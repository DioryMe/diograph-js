import * as fs from 'fs'
const fsPromise = require('fs').promises
const path = require('path').posix

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
        if (err) reject(err)
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

  save = () => {
    return new Promise((resolve, reject) => {
      const diographJson = {
        rootId: this.rootId,
        diograph: this.diograph,
      }

      const fileContent = JSON.stringify(diographJson, null, 2)
      return fsPromise.writeFile('diograph2.json', fileContent).then((err) => {
        if (err) reject(err)
        console.log(`diograph.save(): Saved diograph.json to ${this.path}`)
        resolve(true)
      })
    })
  }
}

export default Diograph
