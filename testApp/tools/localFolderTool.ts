import { Connection } from '../../connection'
import { LocalContentSourceClient } from '../../clients'
import { Diory } from '../../diory'
import { generateDioryFromFolder } from '../../generators/folder'
import { generateDioryFromFile } from '../../generators'

class LocalFolderTool {
  client: LocalContentSourceClient
  connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
    this.client = new LocalContentSourceClient({ address: connection.address }, connection)
  }

  addContent = (sourceFileContent: Buffer, id: string) => {
    return this.client.addContent(sourceFileContent, id)
  }

  list = async (path: string) => {
    const { absolutePath, filePaths, subfolderPaths } = await this.client.list(path)

    const dioryList: Diory[] = await this.generateDiograph(absolutePath, filePaths, subfolderPaths)

    this.addContentUrlsToConnection(dioryList)

    return this.toDiograph(dioryList)
  }

  // ---- Private methods

  private addContentUrlsToConnection = (dioryList: Diory[]) => {
    dioryList.forEach((diory) => {
      this.connection.addContentUrl(diory.id, '123abc', diory)
    })
  }

  private generateDioriesFromPaths = async (filePaths: string[], subfolderPaths: string[]) => {
    const subfolderDiories: Diory[] = await Promise.all(
      subfolderPaths.map((subfolderPath) => generateDioryFromFolder(subfolderPath)),
    )
    const fileDiories: Diory[] = await Promise.all(
      filePaths.map((filePath) => generateDioryFromFile(filePath)),
    )
    return subfolderDiories.concat(fileDiories)
  }

  private generateDiograph = async (
    folderPath: string,
    filePaths: string[] = [],
    subfolderPaths: string[] = [],
  ) => {
    const diories = await this.generateDioriesFromPaths(filePaths, subfolderPaths)
    const rootDiory = generateDioryFromFolder(folderPath)

    return diories.concat([rootDiory])
  }

  private toDiograph = (diories: Diory[]) => {
    const diograph: any = {}
    diories.forEach((diory: Diory) => (diograph[diory.id] = diory.toDioryObject()))
    return diograph
  }
}

export { LocalFolderTool }
