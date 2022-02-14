import { DiographJson } from '..'
import * as fileType from 'file-type'
import { stat } from 'fs/promises'
import { dioryImageGenerator } from '../generators'
import { readFile } from 'fs/promises'
import { basename } from 'path/posix'

async function importDioryFromFile(this: DiographJson, filePath: string, contentUrl: string) {
  // Copy to temp here and use tmp file from then on...
  const fileContent = await readFile(filePath)

  const { diory, thumbnailBuffer } = await dioryGenerator(filePath, fileContent, contentUrl)
  const createdDiory = this.createDiory(diory)
  if (thumbnailBuffer) {
    await this.connector.addThumbnail(thumbnailBuffer, createdDiory)
  }
  return {
    diory: createdDiory,
    contentUrl,
  }
}

async function dioryGenerator(filePath: string, fileContent: Buffer, contentUrl: string) {
  const { birthtime, mtime } = (await stat(filePath)) || {}
  const baseDiory = {
    text: basename(filePath),
    created: birthtime && birthtime.toISOString(),
    modified: mtime && mtime.toISOString(),
  }

  const encodingFormat = await fileType.fromBuffer(fileContent)

  if (!encodingFormat) {
    throw new Error("Couldn't detect file type")
  }
  const { typeSpecificDiory, thumbnailBuffer, cid } = await generateTypeSpecificDiory(
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
    thumbnailBuffer,
    cid,
  }
}

async function generateTypeSpecificDiory(
  encodingFormat: any,
  fileContent: Buffer,
  filePath: string,
  contentUrl: string,
) {
  const type = encodingFormat.mime.split('/')[0]
  switch (type) {
    case 'image':
      return await dioryImageGenerator(fileContent, filePath, contentUrl)
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
      data: [
        {
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          contentUrl,
        },
      ],
    },
    thumbnailBuffer: undefined,
    cid: 'sadfasdf',
  }
}

function importFolder(this: DiographJson, url: string) {}

export { importDioryFromFile, importFolder }
