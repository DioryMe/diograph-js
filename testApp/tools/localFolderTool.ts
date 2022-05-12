import { Connection } from '../../connection'
import { LocalContentSourceClient } from '../../clients'
import { Diory } from '../../diory'
import { generateDioryFromFolder } from '../../generators/folder'
import { generateDioryFromFile } from '../../generators'

class LocalFolderTool {
  client: LocalContentSourceClient

  constructor(connection: Connection) {
    this.client = new LocalContentSourceClient({ address: connection.address }, connection)
  }

  addContent = (sourceFileContent: Buffer, id: string) => {
    return this.client.addContent(sourceFileContent, id)
  }

  // ==========================0 ==============================
  // This is localClient specific and should be extracted away...
  generateDioriesFromPaths = async (filePaths: string[], subfolderPaths: string[]) => {
    const subfolderDiories: Diory[] = await Promise.all(
      subfolderPaths.map((subfolderPath) => generateDioryFromFolder(subfolderPath)),
    )
    const fileDiories: Diory[] = await Promise.all(
      filePaths.map((filePath) => generateDioryFromFile(filePath)),
    )
    return subfolderDiories.concat(fileDiories)
  }

  generateDiograph = async (
    folderPath: string,
    filePaths: string[] = [],
    subfolderPaths: string[] = [],
  ) => {
    const diories = await this.generateDioriesFromPaths(filePaths, subfolderPaths)
    const rootDiory = generateDioryFromFolder(folderPath)

    return diories.concat([rootDiory])
  }
  // ==========================0 ==============================

  list = async (path: string) => {
    // => should we call for "localFolder tool" to get generated diories?
    //    - getTool instead of getClient?
    //    - localFolder tool has client

    // ==========================0 ==============================
    // This is localClient specific and should be extracted away...
    const { absolutePath, filePaths, subfolderPaths } = await this.client.list(path)

    const generatedDiories: Diory[] = await this.generateDiograph(
      absolutePath,
      filePaths,
      subfolderPaths,
    )
    // ==========================0 ==============================

    return generatedDiories
  }
}

export { LocalFolderTool }
