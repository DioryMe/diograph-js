interface DiographParams {
  path: string
}

class Diograph {
  path: string

  constructor({ path }: DiographParams) {
    this.path = path
  }

  load = () => {
    console.log(this.path)
    // parsed_diograph = JSON.parse(File.read(path))
    // diograph = parsed_diograph['diograph']
    // root_id = parsed_diograph['rootId']
  }
}

export default Diograph
