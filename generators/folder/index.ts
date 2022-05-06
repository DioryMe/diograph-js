import { statSync } from 'fs'
import { basename } from 'path/posix'
import { Diory } from '../../diory'
import { DioryLinkObject, DioryObject } from '../../types'
import { generateDiory } from '../diory'

function getFirstImage(linkedDiorys: DioryObject[]) {
  const image = linkedDiorys
    .map(({ image }) => image)
    .find((image) => image && !/^data:/.exec(image))
  return image && { image }
}

function getAverage(array: any[] = []) {
  return array.length
    ? array.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / array.length
    : undefined
}

function getAverageLocation(linkedDiorys: DioryObject[]) {
  const locations = linkedDiorys.filter(({ latlng }) => latlng)
  const latitudes = locations.map(({ latlng }) => latlng && latlng.split(', ')[0])
  const longitudes = locations.map(({ latlng }) => latlng && latlng.split(', ')[1])
  return (
    locations.length && {
      latlng: `${getAverage(latitudes)}, ${getAverage(longitudes)}`,
    }
  )
}

// FIXME: Couldn't figure out the types
// function getAverageDate(linkedDiorys: Diory[]) {
//   const dates = linkedDiorys
//     .map(({ date }) => date)
//     .filter(Boolean)
//     .map(Date.parse)
//     // eslint-disable-next-line no-restricted-globals
//     .filter((date) => !isNaN(date))
//   return (
//     dates.length && {
//       date: new Date(getAverage(dates)).toISOString(),
//     }
//   )
// }

function generateLinks(dioryLinks: DioryLinkObject) {
  return (
    !!dioryLinks && {
      links: Object.entries(dioryLinks).reduce(
        (obj, [linkKey, { id }]) => ({
          ...obj,
          [linkKey]: { id },
        }),
        {},
      ),
    }
  )
}

function generateDioryFromFolder(folderPath: string, dioryLinks: DioryLinkObject = {}) {
  const linkedDiorys: DioryObject[] = Object.values(dioryLinks)
  return new Diory({
    ...generateDiory({
      ...getFirstImage(linkedDiorys),
      ...getAverageLocation(linkedDiorys),
      // ...getAverageDate(linkedDiorys),
      ...readFolderMetadata(folderPath),
    }),
    ...generateLinks(dioryLinks),
  })
}

function readFolderMetadata(folderPath: string = '') {
  const { birthtime, mtime } = statSync(folderPath) || {}
  return {
    text: basename(folderPath),
    created: birthtime && birthtime.toISOString(),
    modified: mtime && mtime.toISOString(),
  }
}

export { readFolderMetadata, generateDioryFromFolder }
