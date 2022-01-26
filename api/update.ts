import DiographJson from '../diograph'
import { Diory, DioryAttributes } from '../types'

function update(this: DiographJson, id: string, payload: DioryAttributes): Diory {
  // Check that only valid keys are given
  Object.keys(payload).forEach((key) => {
    if (!['text', 'image', 'latlng', 'date', 'data', 'style'].includes(key))
      throw new Error('extra key')
  })

  let diory = { ...this.diograph[id], ...payload }
  this.diograph[id] = diory
  return this.get(id)
}

export { update }
