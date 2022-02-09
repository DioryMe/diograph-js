import { DiographJson } from '../diograph'
import { Diory } from '../types'

interface deleteOptions {
  force: boolean
  linkedDiories: boolean
  dryRun: boolean
}

const DEFAULT_OPTIONS: deleteOptions = {
  // deletes linkedDiories although they are linked
  // without this throws an error if any diories are linked to other diories
  force: false,
  linkedDiories: false,
  dryRun: false,
}

function deleteDiory(this: DiographJson, id: string, opts: object = {}): Array<Diory> {
  const optsWithDefaults: deleteOptions = {
    ...DEFAULT_OPTIONS,
    ...opts,
  }
  const dioryToBeDeleted = this.diograph[id]
  if (!optsWithDefaults.dryRun) {
    delete this.diograph[id]
    return [dioryToBeDeleted]
  }
  return [dioryToBeDeleted]
}

export { deleteDiory }
