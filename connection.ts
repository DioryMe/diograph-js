import { join, dirname } from 'path'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import { ConnectionObject, DiographObject } from './types'
import { Diograph } from '.'

class Connection {
  address: string
  type: string
  contentUrls: string[]
  cachePath: string
  diograph: Diograph

  constructor({ address, type, contentUrls }: ConnectionObject, cachePath: string) {
    this.address = address
    this.type = type
    this.contentUrls = contentUrls || []
    this.cachePath = cachePath
    this.diograph = new Diograph(join(this.cachePath, 'diograph.json'))
  }

  load = () => {
    if (this.diograph.diographUrl && existsSync(this.diograph.diographUrl)) {
      this.diograph.setDiograph(
        JSON.parse(readFileSync(this.diograph.diographUrl, { encoding: 'utf8' })).diograph,
      )
    }
  }

  cacheDiograph = async (diographObject: DiographObject) => {
    if (!this.diograph.diographUrl) {
      throw new Error("Can't cacheDiograph: diographUrl is not defined")
    }
    this.diograph.mergeDiograph(diographObject)
    // FIXME: Use RoomClient or something in here instead writeFile
    await writeFile(this.diograph.diographUrl, this.diograph.toJson())
  }

  toConnectionObject = (): ConnectionObject => {
    return {
      address: this.address,
      type: this.type,
      contentUrls: [],
    }
  }
}

export { Connection }
