// Promisified version of execFile to execute the ffmpeg command safely as child_process
const execFile = require('util').promisify(require('child_process').execFile)
import { join } from 'path'
import { readFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

// source: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/cccb632e91d7eb1f345ac04afa663b3813711ed4/types/node/child_process.d.ts#L1012
interface execFileReturnObject {
  stdout: string
  stderr: string
}

interface executeFfmpegInChildProcessReturnObject {
  returnObject: execFileReturnObject
  tmpPath: string
}

async function executeFfmpegInChildProcess(
  pathToFfmpeg: string,
  sourceFilePath: string,
  time: number,
): Promise<executeFfmpegInChildProcessReturnObject> {
  const tmpPath = join('/', 'tmp', `${uuidv4()}.jpg`)
  // prettier-ignore
  const returnObject: execFileReturnObject = await execFile(pathToFfmpeg, [
    '-y',
    '-i', sourceFilePath,
    '-vframes', 1,
    '-an',
    '-ss', time,
    tmpPath
  ])
  return { returnObject, tmpPath }
}

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
