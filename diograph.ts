import { readFile, writeFile } from 'fs/promises'

interface DiographJsonParams {
  path: string
}

interface DiographJson {
  path: string
  rootId: string
  diograph: Diograph
}

interface Diograph {
  [key: string]: Diory
}

interface Diory {
  id: string
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: Array<object>
  style?: object
  links: object
}

class DiographJson {
  path: string
  rootId: string = ''
  diograph: Diograph = {}

  constructor({ path }: DiographJsonParams) {
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
    const diographJsonContents = {
      rootId: this.rootId,
      diograph: this.diograph,
    }

    const fileContent = JSON.stringify(diographJsonContents, null, 2)
    return writeFile(this.path, fileContent).then(() => {
      console.log(`diograph.save(): Saved diograph.json to ${this.path}`)
    })
  }
}

export default DiographJson
