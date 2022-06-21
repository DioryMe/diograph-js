import { DioryAttributes } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { Diograph } from '..'
import { Diory } from '../core/diory'

function createDiory(
  this: Diograph,
  { text, date, image, latlng, created, modified, data }: DioryAttributes,
) {
  const diory = new Diory({
    id: uuidv4(),
    ...(text && { text }),
    ...(image && { image }),
    ...(date && { date }),
    ...(latlng && { latlng }),
    ...(created && { created }),
    ...(modified && { modified }),
    ...(data && { data }),
  })
  this.addDiory(diory)
  return diory
}

export { createDiory }
