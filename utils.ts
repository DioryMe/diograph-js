import { IDioryProps, IDioryObject } from './types'

export function allKeysExist(queryDiory: IDioryProps) {
  return (diory: IDioryObject): boolean =>
    // @ts-ignore
    !Object.keys(queryDiory).some((prop) => !diory[prop])
}

export function allMatchToQuery(queryDiory: IDioryProps) {
  return (diory: IDioryObject): boolean =>
    !Object.entries(queryDiory).some(
      ([prop, query]) =>
        // @ts-ignore
        !diory[prop].toLowerCase().includes(query.toLowerCase()),
    )
}
