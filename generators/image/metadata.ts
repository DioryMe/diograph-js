const { readFileSync } = require('fs')
const { load } = require('exifreader')
const FileType = require('file-type')

function readExifTags(imagePath = '') {
  const file = readFileSync(imagePath)
  return load(file.buffer)
}

function formatHour(hour: number) {
  return `0${hour % 24}`.slice(-2)
}

function getDateTime(dateTime: any) {
  if (!dateTime) {
    return
  }
  const [year, month, date, hour, min, sec] = dateTime.value[0].split(/\D/)
  return `${[year, month, date].join('-')}T${[formatHour(hour), min, sec].join(':')}.000Z`
}

function getDate({ DateTime, DateTimeOriginal }: any) {
  const date = getDateTime(DateTime) || getDateTime(DateTimeOriginal)
  return date && { date }
}

function getIsoDate(isoDate: any) {
  return isoDate && isoDate.value.slice(0, 23) + 'Z' // eslint-disable-line prefer-template
}

function getCreated({ DateCreated, CreateDate }: any) {
  const created = getIsoDate(DateCreated) || getIsoDate(CreateDate)
  return created && { created }
}

function getLatLng({ GPSLatitude = {}, GPSLongitude = {} }: any) {
  const latitude = GPSLatitude.description
  const longitude = GPSLongitude.description
  return latitude && longitude && { latlng: `${latitude}, ${longitude}` }
}

async function generateSchema(tags: any, imagePath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: imagePath,
    height: tags && tags['Image Height'] && tags['Image Height'].value,
    width: tags && tags['Image Width'] && tags['Image Width'].value,
    encodingFormat: (await FileType.fromFile(imagePath)).mime,
  }
}

async function retrieveMetadata(imagePath: string) {
  if (!imagePath) {
    return
  }
  try {
    const tags = readExifTags(imagePath)
    return {
      text: undefined,
      image: imagePath,
      ...getDate(tags),
      ...getLatLng(tags),
      ...getCreated(tags),
      data: [
        {
          ...(await generateSchema(tags, imagePath)),
        },
      ],
    }
  } catch (error) {
    console.info(`Error reading image ${imagePath}: ${error}`)
  }
}

export { retrieveMetadata }
