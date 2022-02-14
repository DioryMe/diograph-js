import { Diory, Diograph, DiographJsonParams } from './types'
import { LocalConnector, Connector } from './connectors'
import { readFile, writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path/posix'
import {
  createDiory,
  get,
  getDiory,
  search,
  update,
  deleteDiory,
  importDioryFromFile,
  importFolder,
} from './api'

class DiographJson {
  connector: Connector
  baseUrl: string
  diographJsonPath: string
  imageFolderPath: string
  rootId: string = ''
  diograph: Diograph = {}

  createDiory = createDiory
  get = get
  getDiory = getDiory
  update = update
  search = search
  deleteDiory = deleteDiory
  importDioryFromFile = importDioryFromFile
  importFolder = importFolder

  constructor({ baseUrl }: DiographJsonParams, connector?: Connector) {
    this.baseUrl = baseUrl
    this.diographJsonPath = join(baseUrl, 'diograph.json')
    this.imageFolderPath = join(baseUrl, 'images')
    this.connector = connector || new LocalConnector()
  }

  setDiograph = (diograph: Diograph, rootId?: string) => {
    this.diograph = diograph
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  addThumbnail = (thumbnailBuffer: Buffer, diory: Diory) => {
    if (!existsSync(this.imageFolderPath)) {
      mkdirSync(this.imageFolderPath)
    }
    return writeFile(join(this.imageFolderPath, `${diory.id}.jpg`), thumbnailBuffer)
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
