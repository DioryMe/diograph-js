import { DiographJson } from '../diograph'
import { Diory } from '../types'

interface GetOptions {
  linkedDiories: boolean
  reverseLinkedDiories: boolean
}

const DEFAULT_OPTIONS: GetOptions = {
  linkedDiories: false,
  reverseLinkedDiories: false,
}

function getDiory(this: DiographJson, id: string, opts: object = {}): Diory {
  const optsWithDefaults: GetOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory: Diory = this.diograph[id]

  return storyDiory
}

export { getDiory }
