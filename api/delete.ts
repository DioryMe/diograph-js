import { DiographJson } from '../diograph'
import { Diory } from '../types'

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
  this: DiographJson,
  id: string,
  opts: object = {},
): Promise<Array<Diory>> {
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
          if (!this.connector) {
            throw new Error("Connector missing, can't delete thumbnail")
          }
          await this.connector.deleteThumbnail(`${dioryToBeDeleted.id}.jpg`)
        }
        return dioryToBeDeleted
      }),
    )
  }

  return dioriesToBeDeleted
}

export { deleteDiory }
