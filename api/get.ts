import { DiographJson, Diory } from '../types'

function getDiory(this: DiographJson, id: string): Diory {
  return this.diograph[id]
}

export { getDiory }
