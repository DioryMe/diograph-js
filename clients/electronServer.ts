import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

class ElectronServer {
  apiActions = () => {
    return {
      getPath: this.getPath,
      writeItem: this.writeItem,
      readTextFile: this.readTextFile,
      readitem: this.readItem,
    }
  }

  getPath = () => '/Users/Jouni/EmptyRoom' || join(__dirname, 'test-folder')

  // Client read & write
  writeItem = (url: string, fileContentArrayBuffer: ArrayBuffer) => {
    const fileContent = Buffer.from(fileContentArrayBuffer)
    const dirPath = dirname(url)
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
    return writeFileSync(url, fileContent)
  }

  readTextFile = (filePath: string) => readFileSync(filePath, { encoding: 'utf-8' })

  readItem = (url: string) => readFileSync(url)
}

export { ElectronServer }
