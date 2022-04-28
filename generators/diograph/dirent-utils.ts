import { Dirent } from 'fs'
import { resolve } from 'path'

const ignoredFiles = ['diograph.json', 'Icon', 'Thumbs.db']

function isValid(dirent: Dirent) {
  return !(ignoredFiles.includes(dirent.name) || isHiddenFile(dirent.name))
}

function isHiddenFile(filename: string) {
  return /^\./.test(filename)
}

function isFile(dirent: Dirent) {
  return dirent.isFile()
}

function isFolder(dirent: Dirent) {
  return dirent.isDirectory()
}

function getPath(folderPath: string) {
  return (dirent: Dirent) => resolve(folderPath, dirent.name)
}

export { getPath, isFolder, isHiddenFile, isFile, isValid }
