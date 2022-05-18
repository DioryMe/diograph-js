// TODO: Make alternative to this which uses Electron Local API actions
// - requires bare bones app with Electron Local API backend to work
// => skeleton for any diograph-js Electron app

import { Diory } from '..'
import { Diograph } from '../diograph'

class ElectronClient {
  constructor() {}

  readTextItem = async (url: string) => {
    const diory = new Diory({
      id: 'some-id',
      image: 'images/some-id.jpg',
      links: {
        'some-other-id': {
          id: 'some-other-id',
        },
      },
    })
    const diory2 = new Diory({
      id: 'some-other-id',
    })
    const diory3 = new Diory({
      id: 'some-else-id',
      links: {
        'some-id': {
          id: 'some-id',
        },
      },
    })
    const diograph = new Diograph('some-path/diograph.json')
    diograph.setDiograph({
      'some-id': diory,
      'some-other-id': diory2,
      'some-else-id': diory3,
    })

    return JSON.stringify({ diograph: diograph.toDiographObject(), rootId: 'roottiidee')
  }

  readItem = async (url: string) => {
    console.log('readItem')
    // return readFile(url)
  }

  writeItem = async (url: string, fileContent: Buffer | string) => {
    console.log('writeItem')
    // const dirPath = dirname(url)
    // if (!existsSync(dirPath)) {
    //   mkdirSync(dirPath, { recursive: true })
    // }
    // return writeFile(url, fileContent)
  }

  deleteItem = async (url: string) => {
    // return rm(url)
  }
}

export { ElectronClient }
