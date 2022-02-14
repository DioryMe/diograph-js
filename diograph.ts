import { Diograph, DiographJsonParams } from './types'
import { LocalConnector } from './connectors'
import {
  createDiory,
  getDiory,
  getDioryWithLinks,
  search,
  update,
  deleteDiory,
  importDioryFromFile,
  importFolder,
} from './api'

class DiographJson {
  connector: LocalConnector
  rootId: string = ''
  diograph: Diograph = {}

  createDiory = createDiory
  getDiory = getDiory
  getDioryWithLinks = getDioryWithLinks
  update = update
  search = search
  deleteDiory = deleteDiory
  importDioryFromFile = importDioryFromFile
  importFolder = importFolder

  constructor({ baseUrl }: DiographJsonParams, connector?: LocalConnector) {
    this.connector = connector || new LocalConnector(baseUrl)
  }

  setDiograph = (diograph: Diograph, rootId?: string) => {
    this.diograph = diograph
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }

  loadDiograph = async () => {
    const diographJsonContents = await this.connector.readDiograph()
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const { diograph, rootId } = JSON.parse(diographJsonContents)
    this.rootId = rootId
    this.diograph = diograph
  }

  saveDiograph = () => {
    const diographJsonContents = {
      rootId: this.rootId,
      diograph: this.diograph,
    }

    const fileContent = JSON.stringify(diographJsonContents, null, 2)
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    return this.connector.writeDiograph(fileContent)
  }
}

export { DiographJson }
