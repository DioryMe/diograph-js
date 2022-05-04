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

function getDiory(this: Diograph, id: string): Diory | undefined {
  return this.diories.find((diory) => diory.id === id)
}

function getDioryWithLinks(
  this: Diograph,
  id: string,
  opts: object = {},
): Diory | Array<Diory> | undefined {
  const optsWithDefaults: GetOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory = this.getDiory(id)
  if (!storyDiory) {
    return
  }

  const storyDioryWithLinkedDiories = [storyDiory]

  if (optsWithDefaults.linkedDiories && storyDiory.links) {
    Object.values(storyDiory.links).forEach((link) => {
      const linkedDiory = this.getDiory(link.id)
      if (linkedDiory) {
        storyDioryWithLinkedDiories.push(linkedDiory)
      }
    })
  }

  if (optsWithDefaults.reverseLinkedDiories && storyDiory.links) {
    this.diories.forEach((reverseLinkedDiory) => {
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
