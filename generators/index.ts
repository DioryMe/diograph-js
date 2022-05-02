import { dioryImageGenerator } from './image'
import { dioryVideoGenerator } from './video'
import { dioryAudioGenerator } from './audio'
import { baseData, generateDiory } from './diory'
import { fromFile } from 'file-type'
import { readFile } from 'fs/promises'

async function typeSpecificData(filePath: string) {
  const defaultSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    contentUrl: filePath,
  }

  const fileType = await fromFile(filePath)
  if (!fileType || !fileType.mime) {
    return { data: [defaultSchema] }
  }
  defaultSchema.encodingFormat = fileType.mime

  const type = fileType.mime.split('/')[0]
  switch (type) {
    case 'image':
      const fileContent = await readFile(filePath)
      return (await dioryImageGenerator(fileContent, filePath, filePath)).typeSpecificDiory
    case 'video':
      return (await dioryVideoGenerator(filePath, filePath)).typeSpecificDiory
    case 'audio':
      defaultSchema['@type'] = 'AudioObject'
      break
    // case 'application':
    // case 'text':
    default:
  }

  return { data: [defaultSchema] }
}

async function generateDioryFromFile(filePath: string) {
  return generateDiory({
    ...(await baseData(filePath)),
    ...(await typeSpecificData(filePath)),
  })
}

export { dioryImageGenerator, dioryVideoGenerator, dioryAudioGenerator, generateDioryFromFile }
