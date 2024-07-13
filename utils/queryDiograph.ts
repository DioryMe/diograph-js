import { IDioryProps, IDioryObject, IDiographObject, IDioryDateGeoSearchProps } from '../types'
import { allFilteredByDate, allFilteredByLatlng } from './utils'

function allKeysExist(queryDiory: IDioryProps) {
  return (diory: IDioryObject): boolean =>
    // @ts-ignore
    !Object.keys(queryDiory).some((prop) => !diory[prop])
}

function allMatchToQuery(queryDiory: IDioryProps) {
  return (diory: IDioryObject): boolean =>
    !Object.entries(queryDiory).some(
      ([prop, query]) =>
        // @ts-ignore
        !diory[prop].toLowerCase().includes(query.toLowerCase()),
    )
}

function reduceToDiographObject(
  diographObject: IDiographObject,
  diory: IDioryObject,
): IDiographObject {
  return {
    ...diographObject,
    [diory.id]: diory,
  }
}

export function queryDiograph(queryDiory: IDioryProps, diograph: IDiographObject): IDiographObject {
  return Object.values(diograph)
    .filter(allKeysExist(queryDiory))
    .filter(allMatchToQuery(queryDiory))
    .reduce(reduceToDiographObject, {})
}

export function queryDiographByDateAndGeo(
  queryDiory: IDioryDateGeoSearchProps,
  diograph: IDiographObject,
): IDiographObject {
  return Object.values(diograph)
    .filter(allFilteredByDate(queryDiory))
    .filter(allFilteredByLatlng(queryDiory))
    .reduce(reduceToDiographObject, {})
}
