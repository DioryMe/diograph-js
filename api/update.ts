import { Diograph } from '../diograph'
import { Diory } from '../diory'
import { DioryAttributes } from '../types'

function update(this: Diograph, id: string, payload: DioryAttributes): Diory | undefined {
  // Check that only valid keys are given
  Object.keys(payload).forEach((key) => {
    if (!['text', 'image', 'latlng', 'date', 'data', 'style'].includes(key))
      throw new Error('extra key')
  })

  const diory = this.getDiory(id)
  if (!diory) {
    return
  }
  const updatedDiory = new Diory({ ...diory.toDioryObject(), ...payload })
  this.addDiory(updatedDiory)
  return this.getDiory(id)
}

export { update }
