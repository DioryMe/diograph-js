import { retrieveMetadata } from './metadata'
import { generateThumbnail } from './thumbnailer'

async function dioryImageGenerator(fileContent: Buffer, filePath: string, contentUrl: string) {
  const thumbnailBuffer = await generateThumbnail(fileContent)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl,
    ...retrieveMetadata(),
  }
  return { typeSpecificDiory: { data: [schema] }, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryImageGenerator }
