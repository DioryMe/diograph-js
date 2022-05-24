declare global {
  interface Window {
    channelsApi: any
  }
}

class ElectronClientMock {
  address: string

  constructor() {
    this.address = 'NO PATH FOR MOCK CLIENT'
  }

  readTextItem = async (url: string) => {
    if (url.split('/')[url.split('/').length - 1] === 'room.json') {
      return JSON.stringify({
        diographUrl: 'diograph.json',
        connections: [
          {
            id: 'native-connection',
            address: './Diory Content',
            type: 'local',
            contentUrls: {
              'this-is-CID': {
                diory: {
                  id: '987-def', // <-- should this be CID?
                  text: 'test-image.jpg',
                  image:
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8c43hPwAHewLTbrmJlAAAAABJRU5ErkJggg==',
                },
                internalPath: 'test-image.jpg',
              },
              'test-image-jpg-content-url': {
                diory: {
                  id: 'test-image-jpg-content-url',
                  text: 'test-image.jpg',
                  image:
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8c43hPwAHewLTbrmJlAAAAABJRU5ErkJggg==',
                },
                internalPath: 'test-image.jpg',
              },
            },
          },
        ],
      })
    }

    if (url.split('/')[url.split('/').length - 1] === 'diograph.json') {
      return JSON.stringify({
        rootId: 'uuid-1',
        diograph: {
          'uuid-1': {
            id: 'uuid-1',
            text: 'test-image.jpg',
            image:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8c43hPwAHewLTbrmJlAAAAABJRU5ErkJggg==',
            data: [{ contentUrl: 'test-image-jpg-content-url' }],
          },
        },
      })
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
