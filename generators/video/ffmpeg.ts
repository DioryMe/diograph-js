// Promisified version of execFile to execute the ffmpeg command safely as child_process
const execFile = require('util').promisify(require('child_process').execFile)
import { join } from 'path'
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

export { executeFfmpegInChildProcess }
