import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { rm, readFile, writeFile, readdir } from 'fs/promises'
import { ConnectionData, Diograph } from './types'
import { generateDiograph } from './generators/diograph'

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

  initiate = async (path?: string) => {
    const diograph = await generateDiograph(path ? join(this.address, path) : this.address)

    const diographJson = {
      diograph: {
        ...this.diograph,
        ...diograph.diograph,
      },
      rootId: 'root123',
    }
    this.diograph = diographJson.diograph
    await writeFile(join(this.cachePath, 'diograph.json'), JSON.stringify(diographJson, null, 2))
  }

  loadOrInitiate = async (path: string = '/') => {
    // Load existing diograph if available
    if (existsSync(join(this.cachePath, 'diograph.json'))) {
      this.diograph = JSON.parse(
        await readFile(join(this.cachePath, 'diograph.json'), { encoding: 'utf8' }),
      ).diograph
      // return // <--- This will prevent duplicates when using CLI
    }
    // Should check if path already exists? Shouldn't load if not necessary...
    // if (!this.diograph.includes(path)) {
    // Initiate and add diograph.json
    await this.initiate(path)
    // }
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
