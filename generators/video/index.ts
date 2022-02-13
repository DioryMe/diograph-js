import { retrieveMetadata } from './metadata'
import { generateThumbnail } from './thumbnailer'

function dioryVideoGenerator(fileContent: Buffer, filePath: string, contentUrl: string) {
  const thumbnailBuffer = generateThumbnail()
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    contentUrl,
    ...retrieveMetadata(),
  }
  return { typeSpecificDiory: { data: [schema] }, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryVideoGenerator }
