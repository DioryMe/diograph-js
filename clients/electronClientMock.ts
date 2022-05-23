declare global {
  interface Window {
    channelsApi: any
  }
}

class ElectronClientMock {
  constructor() {}

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
            },
          },
        ],
      })
    }

    if (url.split('/')[url.split('/').length - 1] === 'diograph.json') {
      return JSON.stringify({
        rootId: 'dio',
        diograph: {
          dio: {
            id: 'dio',
            text: 'text',
            image: '/thumbnail.jpg',
            // image: 'file:///Users/Jouni/Code/electron-diograph-js/test-image.jpg',
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
