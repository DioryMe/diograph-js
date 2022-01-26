import { DiographJsonParams, Diograph, Diory } from './types'
import { readFile, writeFile } from 'fs/promises'

class DiographJson {
  path: string
  rootId: string = ''
  diograph: Diograph = {}

  constructor({ path }: DiographJsonParams) {
    this.path = path
  }

  load = () => {
    return readFile(this.path, { encoding: 'utf8' }).then((diographJsonContents) => {
      const parsedJson = JSON.parse(diographJsonContents)
      // TODO: Validate JSON with own validator.js (using ajv.js.org)
      this.rootId = parsedJson.rootId
      this.diograph = parsedJson.diograph
    })
  }

  get = (id: string): Diory => {
    return this.diograph[id]
  }

  save = () => {
    const diographJsonContents = {
      rootId: this.rootId,
      diograph: this.diograph,
    }

    const fileContent = JSON.stringify(diographJsonContents, null, 2)
    return writeFile(this.path, fileContent).then(() => {
      console.log(`diograph.save(): Saved diograph.json to ${this.path}`)
    })
  }
}

export default DiographJson
