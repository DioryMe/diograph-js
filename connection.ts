import { join, dirname } from 'path'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import { ConnectionData, Diograph } from './types'

class Connection {
  address: string
  type: string
  contentUrls: string[]
  cachePath: string
  diograph: Diograph = {}

  constructor({ address, type, contentUrls }: ConnectionData, cachePath: string) {
    this.address = address
    this.type = type
    this.contentUrls = contentUrls || []
    this.cachePath = cachePath
  }

  load = () => {
    if (existsSync(join(this.cachePath, 'diograph.json'))) {
      this.diograph = JSON.parse(
        readFileSync(join(this.cachePath, 'diograph.json'), { encoding: 'utf8' }),
      ).diograph
    }
  }

  cacheDiograph = async (diograph: Diograph) => {
    const diographJson: any = {
      diograph: {
        ...this.diograph,
        ...diograph.diograph,
      },
      // diograph, // <-- this will prevent duplicates
      rootId: 'root123',
    }
    this.diograph = diographJson.diograph
    await writeFile(join(this.cachePath, 'diograph.json'), JSON.stringify(diographJson, null, 2))
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
