import { Connector } from './base'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

class S3Connector extends Connector {
  constructor() {
    super()
  }

  print = async () => {
    const s3 = new S3Client({})

    const params = {
      Bucket: 'diory-camera-upload',
      Key: '6597aed6-c8b0-45b3-a65d-da603a0f3a1d/xGround_cover2.png',
    }

    // Get S3 object and write it to baseUrl (=/tmp)
    const command = new GetObjectCommand(params)
    const data = await s3.send(command)
    console.log(data)
  }
}

export { S3Connector }
