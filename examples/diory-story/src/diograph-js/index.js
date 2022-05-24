import { getDioryStory } from './getDioryStory'

class Diograph {
  diograph

  constructor(diograph) {
    this.diograph = diograph
  }

  getDioryStory(dioryId) {
    return getDioryStory(this.diograph, dioryId || this.diograph.rootId)
  }
}

export { Diograph }
