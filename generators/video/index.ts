import { generateThumbnail } from './thumbnailer'
import { parseFfmpegOutput } from './parse-ffmpeg-output'
import { DioryGeneratorData } from '../../types'

async function dioryVideoGenerator(
  filePath: string,
  contentUrl: string,
): Promise<DioryGeneratorData> {
  const { thumbnailBuffer, ffmpegOutput } = await generateThumbnail(filePath)
  const { date, latlng, duration } = parseFfmpegOutput(ffmpegOutput)

  const typeSpecificDiory = {
    ...(date && { date }),
    ...(latlng && { latlng }),
    data: [
      {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        contentUrl,
        ...(duration && { duration }),
        encodingFormat: '',
      },
    ],
  }

  return { typeSpecificDiory, thumbnailBuffer, cid: 'sadfasdf' }
}

export { dioryVideoGenerator }
