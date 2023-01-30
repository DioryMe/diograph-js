import { IDioryObject, IDiographObject } from './types'
import { Diory } from './diory'

const DIOGRAPH_ROOT_KEY = '/'

export function isDiographRoot(dioryObject: IDioryObject) {
  return dioryObject.id === DIOGRAPH_ROOT_KEY
}

export function getDiographRoot(diographObject: IDiographObject) {
  return diographObject[DIOGRAPH_ROOT_KEY]
}

export function setDiographRoot(diographObject: IDiographObject, rootObject: IDioryObject) {
  return diographObject[DIOGRAPH_ROOT_KEY] = new Diory({ id: rootObject.id })
}