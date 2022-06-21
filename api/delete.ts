import { Diograph } from '../core/diograph'
import { Diory } from '../core/diory'

interface DeleteOptions {
  linkedDiories: boolean
  dryRun: boolean
  deleteThumbnail: boolean
}

const DEFAULT_OPTIONS: DeleteOptions = {
  linkedDiories: false,
  dryRun: false,
  deleteThumbnail: false,
}

async function deleteDiory(this: Diograph, id: string, opts: object = {}): Promise<Diory[]> {
  let dioriesToBeDeleted

  const optsWithDefaults: DeleteOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }

  const storyDiory = this.getDiory(id)
  dioriesToBeDeleted = [storyDiory]

  if (optsWithDefaults.linkedDiories && storyDiory.links) {
    Object.values(storyDiory.links).forEach((link) => {
      const linkedDiory = this.getDiory(link.id)
      dioriesToBeDeleted.push(linkedDiory)
    })
  }

  if (!optsWithDefaults.dryRun) {
    await Promise.all(
      dioriesToBeDeleted.map(async (dioryToBeDeleted) => {
        this.diories = this.diories.filter((diory) => diory.id !== dioryToBeDeleted.id)
        return dioryToBeDeleted
      }),
    )
  }

  return dioriesToBeDeleted
}

export { deleteDiory }
