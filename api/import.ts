import { DiographJson } from '..'
import * as fileType from 'file-type'
import { stat } from 'fs/promises'
import { dioryImageGenerator } from '../generators'
import { readFile } from 'fs/promises'

async function importFile(this: DiographJson, filePath: string, contentUrl: string) {
  // Copy to temp here and use tmp file from then on...
  const fileContent = await readFile(filePath)

  const { diory, thumbnailBuffer } = await dioryGenerator(filePath, fileContent, contentUrl)
  const createdDiory = this.createDiory(diory) // <-- tässä luodaan ID diorylle!!!
  this.addThumbnail(thumbnailBuffer, diory)

  return {
    diory,
  }
}

async function dioryGenerator(filePath: string, fileContent: Buffer, contentUrl: string) {
  const { birthtime, mtime } = (await stat(filePath)) || {}
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
    filePath,
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

function generateTypeSpecificDiory(
  encodingFormat: any,
  fileContent: Buffer,
  filePath: string,
  contentUrl: string,
) {
  const type = encodingFormat.mime.split('/')[0]
  switch (type) {
    case 'image':
      return dioryImageGenerator(fileContent, filePath, contentUrl)
    case 'video':
    // return dioryVideoGenerator(fileContent)
    case 'audio':
    // return dioryAudioGenerator(fileContent)
    // case 'application':
    // case 'text':
    default:
  }
  return {
    typeSpecificDiory: {
      '@context': 'https://schema.org',
      '@type': 'DigitalDocument',
      contentUrl,
    },
    thumbnailBuffer: fileContent,
    cid: 'sadfasdf',
  }
}

function importFolder(this: DiographJson, url: string) {}

export { importFile, importFolder }
