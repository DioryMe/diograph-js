import { retrieveMetadata } from './metadata'
import { generateThumbnail } from './thumbnailer'

function dioryImageGenerator(fileContent: Buffer, filePath: string, contentUrl: string) {
  const thumbnailBuffer = generateThumbnail()
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl,
    ...retrieveMetadata(),
  }
  return { typeSpecificDiory: { data: [schema] }, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryImageGenerator }
