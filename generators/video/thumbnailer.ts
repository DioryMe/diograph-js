// Promisified version of execFile to execute the ffmpeg command as child_process
const execFile = require('util').promisify(require('child_process').execFile)
const pathToFfmpeg = require('ffmpeg-static')

async function generateThumbnail(
  sourceFilePath: string,
  destinationFilePath: string,
  time: number,
) {
  // prettier-ignore
  return execFile(pathToFfmpeg, [
    '-y',
    '-i', sourceFilePath,
    '-vframes', 1,
    '-an',
    '-ss', time,
    destinationFilePath
  ])
}

export { generateThumbnail }
