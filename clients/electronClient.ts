declare global {
  interface Window {
    channelsApi: any
  }
}

class ElectronClient {
  address: string

  constructor() {
    this.address = window.channelsApi['getPath']()
  }

  readTextItem = async (url: string) => {
    return window.channelsApi['readTextFile'](url)
  }

  readItem = async (url: string) => {
    return window.channelsApi['readItem'](url)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    return window.channelsApi['writeItem'](url, fileContent)
  }

  deleteItem = async (url: string) => {
    // return rm(url)
  }
}

export { ElectronClient }
