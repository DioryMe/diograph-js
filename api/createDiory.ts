import { DioryAttributes, DioryLinkObject } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { Diory } from '../diory'

function createDiory(
  { text, date, image, latlng, created, modified, data }: DioryAttributes,
  id?: string,
  links?: DioryLinkObject,
) {
  const diory = new Diory({
    id: id || uuidv4(),
    ...(text && { text }),
    ...(image && { image }),
    ...(date && { date }),
    ...(latlng && { latlng }),
    ...(created && { created }),
    ...(modified && { modified }),
    ...(data && { data }),
    ...(links && { links }),
  })
  return diory
}

export { createDiory }
