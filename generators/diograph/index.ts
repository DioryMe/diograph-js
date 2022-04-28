import { existsSync, lstatSync } from 'fs'
import { readdir } from 'fs/promises'
import { basename } from 'path/posix'
import { generateDioryFromFile } from '..'
import { Diory, DioryLink, DioryLinkObject } from '../../types'
import { generateDioryFromFolder } from '../folder'
import { getPath, isFile, isFolder, isValid } from './dirent-utils'

async function getFileAndSubfolderPaths(folderPath: string) {
  if (!(existsSync(folderPath) && lstatSync(folderPath).isDirectory())) {
    throw new Error(`Path is not folder ${folderPath}`)
  }
  const dirents = await readdir(folderPath, { withFileTypes: true })
  return {
    filePaths: dirents.filter(isFile).filter(isValid).map(getPath(folderPath)),
    subfolderPaths: dirents.filter(isFolder).filter(isValid).map(getPath(folderPath)),
  }
}

async function generateDioryLinksFromFiles(filePaths: string[]) {
  return Promise.all(
    filePaths.map((filePath) =>
      generateDioryFromFile(filePath).then((diory) => {
        const linkKey = basename(filePath)
        return generateDioryLink({ linkKey, diory })
      }),
    ),
  ).then((fileDiographs) =>
    fileDiographs.reduce(
      (obj, dioryLink) => ({
        ...obj,
        ...dioryLink,
      }),
      {},
    ),
  )
}

function generateDioryLink({ linkKey, diory }: any): DioryLinkObject {
  return {
    [linkKey]: diory,
  }
}

function reduceDiorysToDiograph(diorys: Diory[]) {
  return diorys.reduce(
    (obj, diory) => ({
      ...obj,
      ...(diory && diory.id ? { [diory.id]: diory } : {}),
    }),
    {},
  )
}

// function reduceSubfolderDiographsToDiograph(subfolderDiographs) {
//   return subfolderDiographs.reduce(
//     (obj, { diograph }) => ({
//       ...obj,
//       ...diograph,
//     }),
//     {},
//   )
// }

async function generateDiograph(folderPath: string): Promise<any> {
  const { filePaths = [], subfolderPaths = [] } = (await getFileAndSubfolderPaths(folderPath)) || {}

  const fileDioryLinks = await generateDioryLinksFromFiles(filePaths)

  // const subfolderDiographs = await Promise.all(subfolderPaths.map(generateDiograph))

  // const subfolderDioryLinks = reduceSubfolderDiographsToDioryLinks(subfolderDiographs)

  const dioryLinks: DioryLinkObject = {
    ...fileDioryLinks,
    // ...subfolderDioryLinks,
  }

  const rootDiory = generateDioryFromFolder(folderPath, dioryLinks)

  return {
    linkKey: basename(folderPath),
    rootId: rootDiory.id,
    diograph: {
      ...reduceDiorysToDiograph([rootDiory]),
      ...reduceDiorysToDiograph(Object.values(fileDioryLinks)),
      // ...reduceSubfolderDiographsToDiograph(subfolderDiographs),
    },
  }
}

export { generateDiograph }