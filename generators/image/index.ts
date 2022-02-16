import { retrieveMetadata } from './metadata'
import { generateThumbnail } from './thumbnailer'

async function dioryImageGenerator(fileContent: Buffer, filePath: string, contentUrl: string) {
  const thumbnailBuffer = await generateThumbnail(fileContent)

  const typeSpecificDiory = await retrieveMetadata(filePath)

  return { typeSpecificDiory, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryImageGenerator }
