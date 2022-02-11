import { DiographJson } from '..'
import * as fileType from 'file-type'
import { generateImageObject } from '../generators'

async function importFile(this: DiographJson, url: string) {
  const filePath = url
  const encodingFormat = await fileType.fromFile(filePath)

  if (!encodingFormat) {
    throw new Error("Couldn't detect file type")
  }

  const type = encodingFormat.mime.split('/')[0]
  switch (type) {
    case 'image':
      return generateImageObject(filePath, this.imageFolder)
    case 'video':
      throw new Error('Not implemented')
    case 'audio':
      throw new Error('Not implemented')
    // case 'application':
    // case 'text':
    default:
  }
}

function importFolder(this: DiographJson, url: string) {}

export { importFile, importFolder }
