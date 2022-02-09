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

function get(this: DiographJson, id: string, opts: object = {}): Diory {
  return this.diograph[id]
}

function getDiory(this: DiographJson, id: string, opts: object = {}): Diory | Array<Diory> {
  const optsWithDefaults: GetOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory: Diory = this.diograph[id]
  const storyDioryWithLinkedDiories = [storyDiory]

  if (optsWithDefaults.linkedDiories && storyDiory.links) {
    Object.values(storyDiory.links).forEach((link) => {
      const linkedDiory = this.diograph[link.id]
      storyDioryWithLinkedDiories.push(linkedDiory)
    })
  }

  return Object.keys(opts).length === 0 ? storyDiory : storyDioryWithLinkedDiories
}

export { get, getDiory }
