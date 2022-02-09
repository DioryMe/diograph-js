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

function getDiory(this: DiographJson, id: string, opts: object = {}): Diory | Array<Diory> {
  const optsWithDefaults: GetOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory: Diory = this.diograph[id]
  const storyDioryWithLinkedDiories = [storyDiory]

  return Object.keys(opts).length === 0 ? storyDiory : storyDioryWithLinkedDiories
}

export { getDiory }
