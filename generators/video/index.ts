import { retrieveMetadata } from './metadata'
import { generateThumbnail } from './thumbnailer'

async function dioryVideoGenerator(fileContent: Buffer, filePath: string, contentUrl: string) {
  const thumbnailBuffer = await generateThumbnail(filePath)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    contentUrl,
    ...retrieveMetadata(),
  }
  return { typeSpecificDiory: { data: [schema] }, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryVideoGenerator }
