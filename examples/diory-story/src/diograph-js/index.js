import { getDiories } from './getDiories'

class Diograph {
  diograph

  constructor(diograph) {
    this.diograph = diograph
  }

  getDiories(dioryId) {
    return getDiories(this.diograph, dioryId || this.diograph.rootId)
  }
}

export { Diograph }
