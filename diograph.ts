import { DiographObject } from './types'
import { Diory } from './diory'
import { createDiory, getDiory, getDioryWithLinks, search, update, deleteDiory } from './api'
import { Room } from '.'

class Diograph {
  rootId: string = ''
  diories: Diory[] = []
  diographUrl?: string
  room?: Room

  createDiory = createDiory
  getDiory = getDiory
  getDioryWithLinks = getDioryWithLinks
  update = update
  search = search
  deleteDiory = deleteDiory

  constructor(diographUrl?: string, room?: Room) {
    this.diographUrl = diographUrl
    this.room = room
  }

  fromDiographObjectToDiories = (diograph: DiographObject) => {
    return Object.values(diograph)
      .map((dioryObject) => new Diory(dioryObject))
      .map((diory) => (this.room ? this.room.retrieveContent(diory) : diory))
  }

  mergeDiograph = (diograph: DiographObject, rootId?: string) => {
    this.fromDiographObjectToDiories(diograph).forEach((diory) => diory && this.addDiory(diory))
    this.rootId = rootId ? rootId : Object.values(diograph)[0].id
  }
  // TODO: Replace setDiograph stuff with mergeDiograph
  // => remove this alias
  setDiograph = this.mergeDiograph

  loadDiograph = async () => {
    if (!this.room || !this.room.roomClient) {
      throw new Error("Client missing, can't load diograph")
    }

    const diographContents = await this.room.roomClient.readDiograph()
    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    const { diograph, rootId } = JSON.parse(diographContents)
    this.setDiograph(diograph, rootId)
  }

  saveDiograph = async () => {
    if (!this.room || !this.room.roomClient) {
      throw new Error("Client missing, can't save diograph")
    }

    const dioriesWithThumbnails = this.diories.filter((diory) => diory.thumbnailBuffer)

    await Promise.all(
      dioriesWithThumbnails.map(async (diory) => {
        if (diory.thumbnailBuffer && this.room) {
          const thumbnailPath = await this.room.roomClient.addThumbnail(
            diory.thumbnailBuffer,
            diory.id,
          )
          diory.image = thumbnailPath
        }
      }),
    )

    // TODO: Validate JSON with own validator.js (using ajv.js.org)
    return this.room.roomClient.client.writeItem(this.room.roomClient.diographPath, this.toJson())
  }

  addDiory = (diory: Diory) => {
    this.diories.push(diory)
  }

  toDiographObject = (): DiographObject => {
    const diographObject: DiographObject = {}
    this.diories.forEach((diory) => {
      diographObject[diory.id] = diory.toDioryObject()
    })
    return diographObject
  }

  toJson = (): string => {
    const diographJsonObject = { rootId: this.rootId, diograph: this.toDiographObject() }
    return JSON.stringify(diographJsonObject, null, 2)
  }
}

export { Diograph }
