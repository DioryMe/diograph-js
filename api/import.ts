import { DiographJson } from '..'
import * as fileType from 'file-type'
import { stat } from 'fs/promises'
import { dioryImageGenerator } from '../generators'

async function importFile(this: DiographJson, fileContent: Buffer, contentUrl: string) {
  const { diory, thumbnailBuffer } = await dioryGenerator(fileContent, contentUrl)
  const createdDiory = this.createDiory(diory) // <-- tässä luodaan ID diorylle!!!
  this.addThumbnail(thumbnailBuffer, diory)

  return {
    diory,
  }
}

async function dioryGenerator(fileContent: Buffer, contentUrl: string) {
  const { birthtime, mtime } = (await stat(fileContent)) || {}
  const baseDiory = {
    text: 'basename', // basename(filePath), => fileContent doesn't have basename!!!
    created: birthtime && birthtime.toISOString(),
    modified: mtime && mtime.toISOString(),
  }

  const encodingFormat = await fileType.fromBuffer(fileContent)

  if (!encodingFormat) {
    throw new Error("Couldn't detect file type")
  }
  const { typeSpecificDiory, thumbnailBuffer, cid } = generateTypeSpecificDiory(
    encodingFormat,
    fileContent,
    contentUrl,
  )

  return {
    diory: {
      // <-- tällä ei ole ID:tä vielä!!!!!
      ...baseDiory,
      ...typeSpecificDiory,
    },
    thumbnailBuffer: fileContent,
    cid,
  }
}

function generateTypeSpecificDiory(encodingFormat: any, fileContent: Buffer, contentUrl: string) {
  const type = encodingFormat.mime.split('/')[0]
  switch (type) {
    case 'image':
      return dioryImageGenerator(fileContent)
    case 'video':
    // return dioryVideoGenerator(fileContent)
    case 'audio':
    // return dioryAudioGenerator(fileContent)
    // case 'application':
    // case 'text':
    default:
  }
  return { typeSpecificDiory: { text: 'asdf' }, thumbnailBuffer: fileContent, cid: 'sadfasdf' }
}

function importFolder(this: DiographJson, url: string) {}

export { importFile, importFolder }
