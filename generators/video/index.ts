import { generateThumbnail } from './thumbnailer'

async function dioryVideoGenerator(filePath: string, contentUrl: string) {
  const { thumbnailBuffer, ffmpegOutput } = await generateThumbnail(filePath)

  const creationTime = ffmpegOutput.match(/(?<=creation_time\s\s\s:\s).*/)
  const latlng = ffmpegOutput.match(/(?<=location\s\s\s\s\s\s\s\s:\s\+).{16}/)
  const duration = ffmpegOutput.match(/(?<=Duration:\s).{11}/)
  // Hacky way to trim longitude's leading zero
  const splitter = latlng && latlng[0].match(/\+0/) ? '+0' : '0'

  const typeSpecificDiory = {
    date: creationTime && creationTime[0],
    latlng: latlng && latlng[0].split(splitter).join(', '),
    data: [
      {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        contentUrl,
        duration: duration && duration[0],
        encodingFormat: '',
      },
    ],
  }

  return { typeSpecificDiory, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryVideoGenerator }
