import { Connector } from './baseConnector'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import * as getStream from 'get-stream'
import { Readable } from 'stream'

interface S3ConnectorConfig {
  bucket?: {
    name: string
    region: string
  }
  baseUrl?: string
  credentials?: {
    AWS_ACCESS_KEY_ID: string
    AWS_SECRET_ACCESS_KEY: string
    AWS_SESSION_TOKEN?: string
  }
}

class S3Connector extends Connector {
  bucketName: string
  bucketRegion: string
  baseUrl: string

  constructor(config: S3ConnectorConfig = {}) {
    super(config.baseUrl || 'baseUrl')
    this.bucketName = (config.bucket && config.bucket.name) || 'diory-camera-upload'
    this.bucketRegion = (config.bucket && config.bucket.region) || 'eu-west-1'
    this.baseUrl = config.baseUrl || 'https://diory-camera-upload.s3.eu-west-1.amazonaws.com'
  }

  getDataobject = async (
    contentUrl: string = '6597aed6-c8b0-45b3-a65d-da603a0f3a1d/xGround_cover2.png',
  ) => {
    const s3 = new S3Client({
      // FIXME: Why this has to be added? I would like to remove this...
      // PermanentRedirect: The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.
      region: this.bucketRegion,
    })

    const params = {
      Bucket: this.bucketName,
      Key: contentUrl,
    }

    const command = new GetObjectCommand(params)
    const data = await s3.send(command)

    if (data.Body instanceof Readable) {
      return getStream.buffer(data.Body as any)
    } else {
      throw new Error('Unknown object stream type.')
    }
  }
}

export { S3Connector }
