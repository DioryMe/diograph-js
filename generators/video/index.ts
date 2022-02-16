import { retrieveMetadata } from './metadata'
import { generateThumbnail } from './thumbnailer'

async function dioryVideoGenerator(fileContent: Buffer, filePath: string, contentUrl: string) {
  const { thumbnailBuffer, ffmpegOutput } = await generateThumbnail(filePath)
  const creationTime = ffmpegOutput.match(/(?<=creation_time\s\s\s:\s).*/)
  const latLng = ffmpegOutput.match(/(?<=location\s\s\s\s\s\s\s\s:\s\+).{16}/)
  // Hacky way to trim longitude's leading zero
  const splitter = latLng && latLng[0].match(/\+0/) ? '+0' : '0'
  const schema = {
    date: creationTime && creationTime[0],
    latLng: latLng && latLng[0].split(splitter).join(', '),
    data: {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      contentUrl,
      ...retrieveMetadata(),
    },
  }
  return { typeSpecificDiory: { data: [schema] }, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryVideoGenerator }
