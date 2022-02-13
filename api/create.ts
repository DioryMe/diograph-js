import { DioryAttributes } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { DiographJson } from '..'

function createDiory(this: DiographJson{ text, date, image, latlng, created, modified, data }: DioryAttributes) {
  const diory = {
    id: uuidv4(),
    ...(text && { text }),
    ...(image && { image }),
    ...(date && { date }),
    ...(latlng && { latlng }),
    ...(created && { created }),
    ...(modified && { modified }),
    ...(data && { data }),
  }
  this.diograph[diory.id] = diory
  return diory
}

export { createDiory }
