// TODO: Make alternative to this which uses Electron Local API actions
// - requires bare bones app with Electron Local API backend to work
// => skeleton for any diograph-js Electron app

import { Diory } from '..'
import { Diograph } from '../diograph'

declare global {
  interface Window {
    channelsApi: any
  }
}

class ElectronClient {
  constructor() {}

  readTextItem = async (url: string) => {
    return window.channelsApi['readTextFile'](url)
  }

  readItem = async (url: string) => {
    console.log('readItem')
    // return readFile(url)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    console.log('writeItem')
    // const dirPath = dirname(url)
    // if (!existsSync(dirPath)) {
    //   mkdirSync(dirPath, { recursive: true })
    // }
    // return writeFile(url, fileContent)
  }

  deleteItem = async (url: string) => {
    // return rm(url)
  }
}

export { ElectronClient }
