import { statSync } from 'fs'
import { basename } from 'path/posix'
import { DioryAttributes } from '../../types'
import { v4 as uuid } from 'uuid'
import { getDefaultImage } from './getDefaultImage'

function generateDiory({ text, date, image, latlng, created, modified, data }: DioryAttributes) {
  return {
    id: uuid(),
    ...(text && { text }),
    ...(image ? { image } : { image: getDefaultImage() }),
    ...(date && { date }),
    ...(latlng && { latlng }),
    ...(created && { created }),
    ...(modified && { modified }),
    ...(data && { data }),
  }
}

async function baseData(filePath: string) {
  const { birthtime, mtime } = statSync(filePath) || {}
  return {
    text: basename(filePath),
    created: birthtime && birthtime.toISOString(),
    modified: mtime && mtime.toISOString(),
  }
}

export { generateDiory, baseData }
