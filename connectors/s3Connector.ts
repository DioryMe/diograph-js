import { Connector } from './base'

class S3Connector extends Connector {
  constructor() {
    super()
  }

  print = () => {
    console.log(process.env.AWS_ACCESS_KEY_ID)
  }
}

export { S3Connector }
