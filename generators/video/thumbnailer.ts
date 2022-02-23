// Promisified version of execFile to execute the ffmpeg command safely as child_process
const execFile = require('util').promisify(require('child_process').execFile)
import { join } from 'path'
import { readFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

function executeFfmpegInChildProcess({ pathToFfmpeg, sourceFilePath, time }: any) {
  const tmpPath = join('/', 'tmp', `${uuidv4()}.jpg`)
  // prettier-ignore
  return execFile(pathToFfmpeg, [
    '-y',
    '-i', sourceFilePath,
    '-vframes', 1,
    '-an',
    '-ss', time,
    tmpPath
  ]).then(async (returnObject: any) => {
    return { returnObject, tmpPath }
  })
}

async function generateThumbnail(sourceFilePath: string, time: number = 3) {
  const pathToFfmpeg = process.env.FFMPEG_PATH
  executeFfmpegInChildProcess({ pathToFfmpeg, sourceFilePath, time }).then(
    async ({ returnObject, tmpPath }: any) => {
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
