import { DiographJsonParams, Diograph } from './types'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { getDiory, search, update, deleteDiory } from './api'

class DiographJson {
  path: string
  diographJsonPath: string
  imageFolder: string
  rootId: string = ''
  diograph: Diograph = {}

  get = getDiory
  update = update
  search = search
  deleteDiory = deleteDiory

  constructor({ path }: DiographJsonParams) {
    this.path = path
    this.diographJsonPath = join(path, 'diograph.json')
    this.imageFolder = join(path, 'images')
  }

  setDiograph = (diograph: Diograph, rootId?: string) => {
    this.diograph = diograph
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  load = () => {
    return readFile(this.diographJsonPath, { encoding: 'utf8' }).then((diographJsonContents) => {
      const parsedJson = JSON.parse(diographJsonContents)
      // TODO: Validate JSON with own validator.js (using ajv.js.org)
      this.rootId = parsedJson.rootId
      this.diograph = parsedJson.diograph
    })
  }

  save = () => {
    const diographJsonContents = {
      rootId: this.rootId,
      diograph: this.diograph,
    }

    const fileContent = JSON.stringify(diographJsonContents, null, 2)
    return writeFile(this.diographJsonPath, fileContent).then(() => {
      console.log(`diograph.save(): Saved diograph.json to ${this.path}`)
    })
  }
}

export { DiographJson }
