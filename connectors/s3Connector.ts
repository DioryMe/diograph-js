import { Connector } from './baseConnector'
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
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
  client: S3Client

  constructor(config: S3ConnectorConfig = {}) {
    super()
    this.bucketName = (config.bucket && config.bucket.name) || 'diory-camera-upload'
    this.bucketRegion = (config.bucket && config.bucket.region) || 'eu-west-1'
    this.client = new S3Client({
      // FIXME: Why this has to be added? I would like to remove this...
      // PermanentRedirect: The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.
      region: this.bucketRegion,
    })
  }

  readItem = async (contentUrl: string) => {
    const params = {
      Bucket: this.bucketName,
      Key: contentUrl,
    }

    const command = new GetObjectCommand(params)
    const data = await this.client.send(command)

    if (!(data.Body instanceof Readable)) {
      throw new Error('Unknown object stream type.')
    }

    return getStream.buffer(data.Body)
  }

  readTextItem = async (contentUrl: string) => {
    return (await this.readItem(contentUrl)).toString()
  }

  getContentUrl = (diory: string) => {
    return diory
  }

  writeItem = async (fileContent: Buffer | string, diory?: string) => {
    const contentUrl = diory ? this.getContentUrl(diory) : this.getContentUrl(Date.now().toString())
    const command = new PutObjectCommand({
      Body: fileContent,
      Bucket: this.bucketName,
      Key: contentUrl,
    })
    const response = await this.client.send(command)

    console.log('writeItem', response.$metadata.httpStatusCode)

    return contentUrl
  }

  deleteItem = async (contentUrl: string) => {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: contentUrl,
    })
    const response = await this.client.send(command)

    console.log('deleteItem', response.$metadata.httpStatusCode)
  }
}

export { S3Connector }
