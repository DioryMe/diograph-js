import { dioryImageGenerator } from './image'
import { dioryVideoGenerator } from './video'
import { statSync } from 'fs'
import { basename } from 'path/posix'
import { fromFile } from 'file-type'
import { readFile } from 'fs/promises'
import { DioryAttributes, DioryGeneratorData, DioryObject } from '../types'
import { Diory } from '../diory'
import { getDefaultImage } from './diory/getDefaultImage'
import { v4 as uuidv4 } from 'uuid'

class Generator {
  generatedDioryData = async (filePath: string): Promise<DioryGeneratorData> => {
    const defaultSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      contentUrl: filePath,
    }

    const fileType = await fromFile(filePath)
    if (!fileType || !fileType.mime) {
      return { typeSpecificDiory: { data: [defaultSchema] } }
    }
    defaultSchema.encodingFormat = fileType.mime

    const type = fileType.mime.split('/')[0]
    switch (type) {
      case 'image':
        const fileContent = await readFile(filePath)
        return dioryImageGenerator(fileContent, filePath, filePath, fileType.mime)
      case 'video':
        return dioryVideoGenerator(filePath, filePath)
      case 'audio':
        defaultSchema['@type'] = 'AudioObject'
        break
      // case 'application':
      // case 'text':
      default:
    }

    return { typeSpecificDiory: { data: [defaultSchema] } }
  }

  generateDiory = ({
    text,
    date,
    image,
    latlng,
    created,
    modified,
    data,
  }: DioryAttributes): DioryObject => {
    return {
      id: uuidv4(),
      ...(text && { text }),
      ...(image ? { image } : { image: getDefaultImage() }),
      ...(date && { date }),
      ...(latlng && { latlng }),
      ...(created && { created }),
      ...(modified && { modified }),
      ...(data && { data }),
    }
  }

  baseData = (filePath: string): DioryAttributes => {
    const { birthtime, mtime } = statSync(filePath) || {}
    return {
      text: basename(filePath),
      created: birthtime && birthtime.toISOString(),
      modified: mtime && mtime.toISOString(),
    }
  }

  generateDioryFromFile = async (filePath: string) => {
    const { typeSpecificDiory, thumbnailBuffer } = await this.generatedDioryData(filePath)
    const dioryObject = this.generateDiory({
      ...this.baseData(filePath),
      ...typeSpecificDiory,
    })
    return new Diory(dioryObject, thumbnailBuffer)
  }
}

export { dioryImageGenerator, dioryVideoGenerator, Generator }
