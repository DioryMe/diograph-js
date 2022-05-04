import { Diograph } from '../diograph'
import { DioryObject } from '../types'

interface DeleteOptions {
  force: boolean
  linkedDiories: boolean
  dryRun: boolean
  deleteThumbnail: boolean
}

const DEFAULT_OPTIONS: DeleteOptions = {
  // deletes linkedDiories although they are linked
  // without this throws an error if any diories are linked to other diories
  force: false,
  linkedDiories: false,
  dryRun: false,
  deleteThumbnail: false,
}

async function deleteDiory(
  this: Diograph,
  id: string,
  opts: object = {},
): Promise<Array<DioryObject>> {
  let dioriesToBeDeleted

  const optsWithDefaults: DeleteOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory = this.diograph[id]
  dioriesToBeDeleted = [storyDiory]

  if (optsWithDefaults.linkedDiories && storyDiory.links) {
    Object.values(storyDiory.links).forEach((link) => {
      const linkedDiory = this.diograph[link.id]
      dioriesToBeDeleted.push(linkedDiory)
    })
  }

  if (!optsWithDefaults.dryRun) {
    await Promise.all(
      dioriesToBeDeleted.map(async (dioryToBeDeleted) => {
        delete this.diograph[dioryToBeDeleted.id]
        if (optsWithDefaults.deleteThumbnail) {
          if (!this.client) {
            throw new Error("Client missing, can't delete thumbnail")
          }
          await this.client.deleteThumbnail(`${dioryToBeDeleted.id}.jpg`)
        }
        return dioryToBeDeleted
      }),
    )
  }

  return dioriesToBeDeleted
}

export { deleteDiory }
