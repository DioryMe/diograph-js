import { DiographJson } from '../diograph'
import { Diory } from '../types'

function deleteDiory(this: DiographJson, id: string): boolean {
  return delete this.diograph[id]
}

export { deleteDiory }
