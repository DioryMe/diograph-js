import { join, dirname } from 'path'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import { ConnectionData, DiographObject } from './types'
import { Diograph } from '.'

class Connection {
  address: string
  type: string
  contentUrls: string[]
  cachePath: string
  diograph: Diograph

  constructor({ address, type, contentUrls }: ConnectionData, cachePath: string) {
    this.address = address
    this.type = type
    this.contentUrls = contentUrls || []
    this.cachePath = cachePath
    this.diograph = new Diograph(join(this.cachePath, 'diograph.json'))
  }

  load = () => {
    if (existsSync(this.diograph.diographUrl)) {
      this.diograph.setDiograph(
        JSON.parse(readFileSync(this.diograph.diographUrl, { encoding: 'utf8' })).diograph,
      )
    }
  }

  cacheDiograph = async (diographObject: DiographObject) => {
    this.diograph.mergeDiograph(diographObject)
    // FIXME: Use RoomClient or something in here instead writeFile
    await writeFile(this.diograph.diographUrl, JSON.stringify(this.diograph.toJson(), null, 2))
  }

  toJson = (): ConnectionData => {
    return {
      address: this.address,
      type: this.type,
      contentUrls: [],
    }
  }
}

export { Connection }
