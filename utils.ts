import { IDioryProps, IDioryObject } from './types'

export function allKeysExist(queryDiory: IDioryProps) {
  return (diory: IDioryObject): boolean =>
    !Object.keys(queryDiory).some((prop) => !diory[prop])
}

export function allMatchToQuery(queryDiory: IDioryProps) {
  return (diory: IDioryObject): boolean =>
    !Object.entries(queryDiory).some(([prop, query]) =>
      !diory[prop].toLowerCase().includes(query.toLowerCase())
    )
}
