import { join } from 'path-browserify'

declare global {
  interface Window {
    channelsApi: any
  }
}

class ElectronClient {
  address: string
  type: string

  constructor(address: string) {
    this.address = window.channelsApi['getPath']()
    this.type = this.constructor.name
  }

  readTextItem = async (url: string) => {
    const filePath = join(this.address, url)
    return window.channelsApi['readTextFile'](filePath)
  }

  readItem = async (url: string) => {
    const filePath = join(this.address, url)
    return window.channelsApi['readItem'](filePath)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    const filePath = join(this.address, url)
    return window.channelsApi['writeItem'](filePath, fileContent)
  }

  deleteItem = async (url: string) => {
    const filePath = join(this.address, url)
    // return window.channelsApi['deleteItem'](filePath, fileContent)
  }
}

export { ElectronClient }
