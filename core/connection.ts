import { ConnectionObject } from '../types'
// import { makeRelative } from '../utils/makeRelative'
import { Diograph } from './diograph'
import { join } from 'path-browserify'

export interface ContentUrlObject {
  // "CID <-> internalPath" pairs
  [key: string]: string
}

class Connection {
  address: string
  contentClientType: string
  contentUrls: ContentUrlObject
  diograph: Diograph

  constructor({ address, contentClientType, contentUrls = {}, diograph = {} }: ConnectionObject) {
    if (!address || !contentClientType) {
      throw new Error(
        `Invalid connectionData: address: ${address}, contentClient: ${contentClientType}`,
      )
    }
    this.address = address
    this.contentClientType = contentClientType
    this.contentUrls = contentUrls || {}
    this.diograph = new Diograph()
    if (diograph && Object.keys(diograph).length) {
      this.diograph.mergeDiograph(diograph)
    }
  }

  getClient = () => {
    if (this.contentClientType === 'LocalClient') {
      try {
        const { LocalClient } = require('@diograph/local-client')
        return new LocalClient()
      } catch (e) {
        console.log(e)
        console.log(
          'Connection#getClient: LocalClient not available, falling back to ElectronClient',
        )
        const { ElectronClient } = require('../clients/electronClient')
        return new ElectronClient()
      }
    }

    if (this.contentClientType === 'S3Client') {
      try {
        const { S3Client } = require('@diograph/s3-client')
        return new S3Client()
      } catch (e) {
        console.log(e)
        throw new Error('Connection#getClient: S3Client not available, dont know what to do...')
      }
    }

    throw new Error(
      `Connection#getClient: contentClientType '${this.contentClientType}' not available!`,
    )
  }

  addContentUrl = (CID: string, internalPath: string) => {
    this.contentUrls[CID] = internalPath
  }

  getContent = (contentUrl: string) => {
    if (this.contentUrls[contentUrl]) {
      return join(this.address, this.contentUrls[contentUrl])
    }
  }

  readContent = async (contentUrl: string) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return this.getClient().readItem(filePath)
  }

  addContent = async (fileContent: Buffer | string, contentId: string) => {
    const relativeInternalPath = contentId
    const absoluteInternalPath = join(this.address, contentId)

    await this.getClient().writeItem(absoluteInternalPath, fileContent)

    this.addContentUrl(contentId, relativeInternalPath)

    return relativeInternalPath
  }

  deleteContent = async (contentUrl: string) => {
    const filePath: string | undefined = this.getContent(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return this.getClient().deleteItem(filePath)
  }

  toObject = (roomAddress?: string): ConnectionObject => ({
    // TODO: Make some kind of exception for relative paths (for demo-content-room which can't have absolute paths...)
    // address: roomAddress ? makeRelative(roomAddress, this.address) : this.address,
    address: this.address,
    contentClientType: this.contentClientType,
    contentUrls: this.contentUrls,
    diograph: this.diograph.toObject(),
  })
}

export { Connection }
