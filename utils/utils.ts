import { IDioryProps, IDioryObject, IDiographObject, IDiory } from '../types'
import { isAfter, isBefore, isEqual, startOfDay } from 'date-fns'
import { point as turfPoint, polygon as turfPolygon } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

export type DioryFilterFunction = (diory: IDioryObject) => boolean

// Checks that all keys in queryDiory exist in diory
export function allKeysExist(queryDiory: IDioryProps): DioryFilterFunction {
  return (diory: IDioryObject): boolean =>
    // @ts-ignore
    !Object.keys(queryDiory).some((prop) => !diory[prop])
}

// This can practically used only with: id, text (not with data?)
export function allMatchToQuery(queryDiory: IDioryProps): DioryFilterFunction {
  return (diory: IDioryObject): boolean =>
    !Object.entries(queryDiory).some(
      ([prop, query]) =>
        // @ts-ignore
        !diory[prop].toLowerCase().includes(query.toLowerCase()),
    )
}

// TODO: Support also created & modified dates?

/**
 * @description
 * queryDiory.date: on the same day as diory.date
 * queryDiory.dateStart: diory.date timestamp matches or is after queryDiory.dateStart
 * queryDiory.dateEnd: diory.date timestamp matches or is before queryDiory.dateEnd
 *
 * @param queryDiory - query as diory object
 * @returns - function that returns true if diory matches the query
 */

export function allFilteredByDate(queryDiory: IDioryProps): DioryFilterFunction {
  if (queryDiory.date) {
    return (diory: IDioryObject): boolean =>
      diory.date && queryDiory.date
        ? isEqual(startOfDay(diory.date), startOfDay(queryDiory.date))
        : false
  }
  if (queryDiory.dateStart || queryDiory.dateEnd) {
    return (diory: IDioryObject): boolean => {
      if (diory.date) {
        return (
          (queryDiory.dateStart
            ? isAfter(diory.date, queryDiory.dateStart) || isEqual(diory.date, queryDiory.dateStart)
            : true) &&
          (queryDiory.dateEnd
            ? isBefore(diory.date, queryDiory.dateEnd) || isEqual(diory.date, queryDiory.dateEnd)
            : true)
        )
      }
      return false
    }
  }
  return () => true
}

export function allFilteredByLatlng(queryDiory: IDioryProps): DioryFilterFunction {
  if (!(queryDiory.latlngStart && queryDiory.latlngEnd)) {
    return () => true
  }

  const [startLat, startLng] = queryDiory.latlngStart
    .replace('N', '')
    .replace('E', '')
    .replace(' ', '')
    .split(',')
    .map((latlng) => parseFloat(latlng))
  const [endLat, endLng] = queryDiory.latlngEnd
    .replace('N', '')
    .replace('E', '')
    .replace(' ', '')
    .split(',')
    .map((latlng) => parseFloat(latlng))

  const geoPolygon = [
    [
      [startLng, startLat],
      [startLng, endLat],
      [endLng, endLat],
      [endLng, startLat],
      [startLng, startLat],
    ],
  ]
  return (diory: IDioryObject): boolean => {
    if (diory.latlng) {
      const [lat, lng] = diory.latlng.split(',').map((latlng) => parseFloat(latlng))
      const pointObject = turfPoint([lng, lat])
      const polygonObject = turfPolygon(geoPolygon)
      return booleanPointInPolygon(pointObject, polygonObject)
    }
    return false
  }
}

export function reduceToDiographObject(
  diographObject: IDiographObject,
  diory: IDiory,
): IDiographObject {
  return {
    ...diographObject,
    [diory.id]: diory.toObject(),
  }
}
