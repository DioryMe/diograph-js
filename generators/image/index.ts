import { DioryGeneratorData } from '../../types'
import { retrieveMetadata } from './metadata'
import { generateThumbnail } from './thumbnailer'

async function dioryImageGenerator(
  fileContent: Buffer,
  filePath: string,
  contentUrl: string,
): Promise<DioryGeneratorData> {
  const thumbnailBuffer = await generateThumbnail(fileContent)

  const typeSpecificDiory = await retrieveMetadata(filePath, contentUrl)

  return { typeSpecificDiory, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryImageGenerator }
