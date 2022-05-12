import { existsSync, lstatSync } from 'fs'
import { readdir } from 'fs/promises'
import { generateDioryFromFile } from '..'
import { Diory } from '../../diory'
import { generateDioryFromFolder } from '../folder'
import { getPath, isFile, isFolder, isValid } from './dirent-utils'

async function generateDioriesFromPaths(filePaths: string[], subfolderPaths: string[]) {
  const subfolderDiories: Diory[] = await Promise.all(
    subfolderPaths.map((subfolderPath) => generateDioryFromFolder(subfolderPath)),
  )
  const fileDiories: Diory[] = await Promise.all(
    filePaths.map((filePath) => generateDioryFromFile(filePath)),
  )
  return subfolderDiories.concat(fileDiories)
}

async function generateDiograph(
  folderPath: string,
  filePaths: string[] = [],
  subfolderPaths: string[] = [],
) {
  const diories = await generateDioriesFromPaths(filePaths, subfolderPaths)
  const rootDiory = generateDioryFromFolder(folderPath)

  return diories.concat([rootDiory])
}

export { generateDiograph }
