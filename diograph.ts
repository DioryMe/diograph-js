import { Diograph } from './types'
import { RoomConnector } from './roomConnectors'
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
  connector: RoomConnector
  rootId: string = ''
  diograph: Diograph = {}
  diographUrl: string

  createDiory = createDiory
  getDiory = getDiory
  getDioryWithLinks = getDioryWithLinks
  update = update
  search = search
  deleteDiory = deleteDiory
  importDioryFromFile = importDioryFromFile
  importFolder = importFolder

  constructor(diographUrl: string, connector: RoomConnector) {
    this.diographUrl = diographUrl
    this.connector = connector
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
    return this.connector.writeTextItem(fileContent, this.diographUrl)
  }
}

export { DiographJson }
