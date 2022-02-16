import { DiographJson } from '..'
import * as fileType from 'file-type'
import { readFile, stat } from 'fs/promises'
import { dioryImageGenerator, dioryVideoGenerator } from '../generators'
import { basename } from 'path/posix'

async function importDioryFromFile(this: DiographJson, filePath: string, contentUrl: string) {
  // Copy to temp here and use tmp file from then on...
  const fileContent = await readFile(filePath)

  const { diory, thumbnailBuffer } = await dioryGenerator(filePath, fileContent, contentUrl)
  const createdDiory = this.createDiory(diory)
  if (thumbnailBuffer) {
    const thumbnailContentUrl: string = await this.connector.addThumbnail(
      thumbnailBuffer,
      `${createdDiory.id}.jpg`,
    )
    this.update(createdDiory.id, { image: thumbnailContentUrl })
  }
  return {
    diory: this.getDiory(createdDiory.id),
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

// TODO: This doesn't create only type specific diory but creates also thumbnail...
async function generateTypeSpecificDiory(
  encodingFormat: any,
  fileContent: Buffer,
  filePath: string,
  contentUrl: string,
) {
  const type = encodingFormat.mime.split('/')[0]
  switch (type) {
    case 'image':
      // TODO: imageDiory can't be typed as Diory as it doesn't have id yet...
      const imageDiory = await dioryImageGenerator(fileContent, filePath, contentUrl)
      imageDiory.typeSpecificDiory.data[0]['encodingFormat'] = encodingFormat.mime
      return imageDiory
    case 'video':
      // TODO: videoDiory can't be typed as Diory as it doesn't have id yet...
      const videoDiory = await dioryVideoGenerator(fileContent, filePath, contentUrl)
      videoDiory.typeSpecificDiory.data[0]['encodingFormat'] = encodingFormat.mime
      return videoDiory
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
