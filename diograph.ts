import { Diograph, DiographJsonParams } from './types'
import { readFile, writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { get, getDiory, search, update, deleteDiory, importFile, importFolder } from './api'

class DiographJson {
  baseUrl: string
  diographJsonPath: string
  imageFolder: string
  rootId: string = ''
  diograph: Diograph = {}

  get = get
  getDiory = getDiory
  update = update
  search = search
  deleteDiory = deleteDiory
  importFile = importFile
  importFolder = importFolder

  createDiory = function createDiory(payload: object) {
    return payload
  }

  constructor({ baseUrl }: DiographJsonParams) {
    this.baseUrl = baseUrl
    this.diographJsonPath = join(baseUrl, 'diograph.json')
    this.imageFolder = join(baseUrl, 'images')
  }

  setDiograph = (diograph: Diograph, rootId?: string) => {
    this.diograph = diograph
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  addThumbnail = (thumbnailBuffer: Buffer, diory: object) => {
    if (!existsSync(this.imageFolder)) {
      mkdirSync(this.imageFolder)
    }
    return writeFile(join(this.imageFolder, 'iidee.jpeg'), thumbnailBuffer)
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
      console.log(`diograph.save(): Saved diograph.json to ${this.diographJsonPath}`)
    })
  }
}

export { DiographJson }
