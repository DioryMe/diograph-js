import { IDioryProps, IDioryObject, IDiographObject } from '../types'

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
