import { IDioryProps, IDioryObject, IDiographObject } from '@diory/types'

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

function reduceToDioriesObject(
  dioriesObject: IDiographObject,
  diory: IDioryObject,
): IDiographObject {
  return {
    ...dioriesObject,
    [diory.id]: diory,
  }
}

export function queryDiograph(queryDiory: IDioryProps, diories: IDiographObject): IDiographObject {
  return Object.values(diories)
    .filter(allKeysExist(queryDiory))
    .filter(allMatchToQuery(queryDiory))
    .reduce(reduceToDioriesObject, {})
}
