import { executeFfmpegInChildProcess } from './ffmpeg'
import { readFile } from 'fs/promises'

async function generateThumbnail(sourceFilePath: string, time: number = 3) {
  const pathToFfmpeg = process.env.FFMPEG_PATH
  if (!pathToFfmpeg) {
    throw new Error('FFMPEG_PATH not defined, video/generateThumbnail requires it')
  }
  return executeFfmpegInChildProcess(pathToFfmpeg, sourceFilePath, time).then(
    async ({ returnObject, tmpPath }) => {
      const ffmpegOutput: string = returnObject.stderr
      let thumbnailBuffer
      try {
        thumbnailBuffer = await readFile(tmpPath)
      } catch (e) {
        console.log(returnObject)
        console.log(e)
      }
      return { thumbnailBuffer, ffmpegOutput }
    },
  )
}

export { generateThumbnail }
