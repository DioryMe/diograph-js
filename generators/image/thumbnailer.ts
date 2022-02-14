import { DiographJson } from '../../diograph'
import { Diory } from '../../types'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import * as sharp from 'sharp'

const MAX_HEIGHT = 360
const MAX_WIDTH = 480
/*

interface ResizeImageParams {
  sourceFilePath: string
  destinationFilePath: string
}

const resizeAndSaveImage = async ({
  sourceFilePath,
  destinationFilePath,
}: ResizeImageParams): Promise<void> => {

  const image = await loadImage(sourceFilePath)
  let { width, height } = image

  if (width > height) {
    if (width > MAX_WIDTH) {
      height *= MAX_WIDTH / width
      width = MAX_WIDTH
    }
  } else if (height > MAX_HEIGHT) {
    width *= MAX_HEIGHT / height
    height = MAX_HEIGHT
  }

  const canvas = createCanvas(width, height)
  canvas.getContext('2d').drawImage(image, 0, 0, width, height)
  const imageFileContents = await canvas.toBuffer()

  return writeFile(destinationFilePath, imageFileContents)
}
*/

const generateThumbnail = async (fileContent: Buffer) => {
  return await sharp(fileContent)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside' })
    .jpeg()
    .toBuffer()

  // async (diograph: DiographJson, diory: Diory): Promise<string | null> => {
  /*
  // contentUrl must exist in order to make a thumbnail
  if (!(diory.data && diory.data[0] && diory.data[0].contentUrl)) return null

  // // image must be null or start with data to verify that thumbnail doesn't yet exist
  // if (diory.image && !/^data\:image\/png\;base64/.exec(diory.image)) return null

  // TODO: Sanitize file url to absolute path (REMOVE THIS HORRORNESS!)
  let sanitisedContentUrl
  const { contentUrl } = diory.data[0]
  sanitisedContentUrl = contentUrl.replace(/%20/g, ' ')
  sanitisedContentUrl = sanitisedContentUrl.replace(/a%CC%88/g, 'ä')
  sanitisedContentUrl = sanitisedContentUrl.replace(/o%CC%88/g, 'ö')

  const dioryThumbnailPath = join(diograph.imageFolder, `${diory.id}.jpg`)
  const params = {
    sourceFilePath: join(diograph.path, sanitisedContentUrl),
    destinationFilePath: join(diograph.path, dioryThumbnailPath),
  }

  return resizeAndSaveImage(params).then(() => dioryThumbnailPath)

  */
  // console.log('Image thumbnail generator not implemented')
  // return 'imageThumbnailPath'
}

export { generateThumbnail }
