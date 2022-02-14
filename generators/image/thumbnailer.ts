import * as sharp from 'sharp'

const MAX_HEIGHT = 360
const MAX_WIDTH = 480

const generateThumbnail = async (fileContent: Buffer) => {
  return await sharp(fileContent)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside' })
    // TODO: Detect file format: .png, .gif etc.
    .jpeg()
    .toBuffer()
}

export { generateThumbnail }
