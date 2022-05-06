import { Diograph } from '../diograph'
import { Diory } from '../diory'

interface GetOptions {
  linkedDiories: boolean
  reverseLinkedDiories: boolean
}

const DEFAULT_OPTIONS: GetOptions = {
  linkedDiories: false,
  reverseLinkedDiories: false,
}

function getDiory(this: Diograph, id: string): Diory {
  return this.diories.filter((diory) => diory.id === id)[0]
}

function getDioryWithLinks(this: Diograph, id: string, opts: object = {}): Diory[] {
  const optsWithDefaults: GetOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory = this.getDiory(id)
  const storyDioryWithLinkedDiories = [storyDiory]

  if (optsWithDefaults.linkedDiories && storyDiory.links) {
    Object.values(storyDiory.links).forEach((link) => {
      const linkedDiory = this.getDiory(link.id)
      storyDioryWithLinkedDiories.push(linkedDiory)
    })
  }

  if (optsWithDefaults.reverseLinkedDiories && storyDiory.links) {
    Object.values(this.diories).forEach((reverseLinkedDiory) => {
      if (reverseLinkedDiory.links) {
        Object.values(reverseLinkedDiory.links).forEach((link) => {
          const maybeStoryDiory = this.getDiory(link.id)
          if (storyDiory === maybeStoryDiory) {
            storyDioryWithLinkedDiories.push(reverseLinkedDiory)
          }
        })
      }
    })
  }

  return storyDioryWithLinkedDiories
}

export { getDiory, getDioryWithLinks }
