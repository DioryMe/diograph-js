import { Connection } from '../connection'

class ContentSourceClient {
  address: string
  connection?: Connection

  constructor(config: any, connection?: Connection) {
    if (!config.address) {
      throw new Error('No address given to room')
    }
    this.address = config.address
    this.connection = connection
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    // throw new Error('Not implemented.')
  }

  deleteItem = async (url: string) => {
    // throw new Error('Not implemented.')
  }

  readContent = (contentUrl: string) => {
    // return this.readItem(contentUrl)
  }

  addContent = async (sourceFileContent: Buffer, diory?: string) => {
    // Not implemented
    return 'Not implemented'
  }

  deleteContent = async (contentUrl: string) => {}
}

export { ContentSourceClient }
