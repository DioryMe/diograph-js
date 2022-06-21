import { Diograph } from '../core/diograph'
import { DioryAttributes } from '../types'
import { Diory } from '../core/diory'

function update(this: Diograph, id: string, payload: DioryAttributes): Diory {
  // Check that only valid keys are given
  Object.keys(payload).forEach((key) => {
    if (!['text', 'image', 'latlng', 'date', 'data', 'style'].includes(key))
      throw new Error('extra key')
  })

  const diory = this.getDiory(id)
  if (!diory) {
    throw new Error('Diory not found!')
  }
  diory.dioryAttributes = { ...diory.dioryAttributes, ...payload }
  diory.extractDioryAttributes(diory.dioryAttributes)
  return this.getDiory(id)
}

export { update }
