import { readFile, writeFile } from 'fs/promises'

interface DiographParams {
  path: string
}

interface Diograph {
  rootId: string
  diograph: Diograph2
}

interface Diograph2 {
  [key: string]: Diory
}

interface Diory {
  id: string
  text: string
  image?: string
  latlng?: string
  date?: string
  data?: Array<object>
  style?: object
  links: object
}

class Diograph {
  path: string
  rootId: string = ''
  diograph: Diograph2 = {}

  constructor({ path }: DiographParams) {
    this.path = path
  }

  load = () => {
    return readFile(this.path, { encoding: 'utf8' }).then((diographJsonContents) => {
      const parsedJson = JSON.parse(diographJsonContents)
      this.rootId = parsedJson.rootId
      this.diograph = parsedJson.diograph
    })
  }

  get = (id: string): Diory => {
    return this.diograph[id]
  }

  save = () => {
    const diographJson = {
      rootId: this.rootId,
      diograph: this.diograph,
    }

    const fileContent = JSON.stringify(diographJson, null, 2)
    return writeFile('diograph.json', fileContent).then(() => {
      console.log(`diograph.save(): Saved diograph.json to ${this.path}`)
    })
  }
}

export default Diograph
