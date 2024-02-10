import { IDioryProps, IDioryObject, IDiographObject, IDiory } from '../types'

type DioryFilterFunction = (diory: IDioryObject) => boolean

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

export function reduceToDiographObject(
  diographObject: IDiographObject,
  diory: IDiory,
): IDiographObject {
  return {
    ...diographObject,
    [diory.id]: diory.toObject(),
  }
}
