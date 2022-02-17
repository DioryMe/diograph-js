// Promisified version of execFile to execute the ffmpeg command safely as child_process
const execFile = require('util').promisify(require('child_process').execFile)
const pathToFfmpeg = require('ffmpeg-static')
import { join } from 'path'
import { readFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

async function generateThumbnail(sourceFilePath: string, time: number = 3) {
  const tmpPath = join('/', 'tmp', `${uuidv4()}.jpg`)
  // prettier-ignore
  return execFile(pathToFfmpeg, [
    '-y',
    '-i', sourceFilePath,
    '-vframes', 1,
    '-an',
    '-ss', time,
    tmpPath
  ]).then((async (returnObject: any) => {
    const ffmpegOutput: string = returnObject.stderr
    const thumbnailBuffer = await readFile(tmpPath)
    return { thumbnailBuffer, ffmpegOutput }
  })
}

export { generateThumbnail }
