import { existsSync, mkdirSync } from 'fs'
import { readFile, rm, writeFile } from 'fs/promises'
import { dirname } from 'path'

// TODO: Make alternative to this which uses Electron Local API actions
// - requires bare bones app with Electron Local API backend to work
// => skeleton for any diograph-js Electron app

class LocalClient {
  constructor() {}

  readTextItem = async (url: string) => {
    return readFile(url, { encoding: 'utf8' })
  }

  readItem = async (url: string) => {
    return readFile(url)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    const dirPath = dirname(url)
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
    return writeFile(url, fileContent)
  }

  deleteItem = async (url: string) => {
    return rm(url)
  }
}

export { LocalClient }
