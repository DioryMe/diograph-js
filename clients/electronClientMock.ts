declare global {
  interface Window {
    channelsApi: any
  }
}

class ElectronClientMock {
  address: string

  constructor() {
    this.address = 'demo-content-room'
  }

  readTextItem = async (url: string) => {
    if (url.split('/')[url.split('/').length - 1] === 'room.json') {
      return fetch('/demo-content-room/room.json').then((response) => response.text())
    }

    if (url.split('/')[url.split('/').length - 1] === 'diograph.json') {
      return fetch('/demo-content-room/diograph.json').then((response) => response.text())
    }

    throw new Error(`ElectronClientMock#readTextItem couldnt return ${url}`)
    // return window.channelsApi['readTextFile'](url)
  }

  readItem = async (url: string) => {
    // return window.channelsApi['readItem'](url)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    // return window.channelsApi['writeItem'](url, fileContent)
  }

  deleteItem = async (url: string) => {
    // return rm(url)
  }
}

export { ElectronClientMock }
