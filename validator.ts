import Ajv from 'ajv'
import { CIDMapping, IDiographObject } from './types'
const ajv = new Ajv({ allErrors: true })
// const addFormats = require('ajv-formats')
// addFormats(ajv)

const clientTypeEnum = ['LocalClient', 'S3Client']

const validate = (schema: object, objectToValidate: object) => {
  const validate = ajv.compile(schema)

  const isValid = validate(objectToValidate)

  if (!isValid) {
    console.log('Object is not valid based on schema: ' + JSON.stringify(validate.errors))
    throw new Error('Object is not valid based on schema: ' + JSON.stringify(validate.errors))
  }
}

const diorySchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'created', 'modified'],
  properties: {
    id: { type: 'string' },
    text: { type: 'string' },
    date: { type: 'string' /* format: 'date-time' */ },
    latlng: { type: 'string' /* format: 'geolocation' */ },
    image: { type: 'string' },
    modified: { type: 'string' /* format: 'date-time' */ },
    created: { type: 'string' /* format: 'date-time' */ },
    links: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          path: { type: 'string' },
        },
        required: ['id'],
        additionalProperties: false,
      },
    },
    data: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['@context', '@type', 'contentUrl', 'encodingFormat'],
        properties: {
          '@context': { type: 'string' },
          '@type': { type: 'string' },
          contentUrl: { type: 'string' },
          encodingFormat: { type: 'string' },
          height: { type: 'number' },
          width: { type: 'number' },
          duration: { type: 'string' },
        },
      },
    },
  },
}

const validateDiory = (dioryObject: object) => {
  validate(diorySchema, dioryObject)
}

const diographSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: diorySchema,
  // TODO: Make '/' required
  // required: ['/'],
}

const validateDiograph = (diographObject: IDiographObject) => {
  validate(diographSchema, diographObject)
}

const cidMappingSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: {
    type: 'string',
  },
}

const validateCIDMapping = (cidMappingObject: CIDMapping) => {
  validate(cidMappingSchema, cidMappingObject)
}

// type: RoomConfigData or ConnectionConfigData
const roomConfigDataSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['address', 'clientType'],
  properties: {
    id: { type: 'string' },
    address: { type: 'string' },
    clientType: { type: 'string', enum: clientTypeEnum },
  },
}

// const connectionConfigDataSchema = roomConfigDataSchema;

// type: RoomConfigData
const validateRoomConfigData = (configDataObject: object) => {
  validate(roomConfigDataSchema, configDataObject)
}

// type: ConnectionConfigData
const validateConnectionConfigData = validateRoomConfigData

// type: ConnectionData
const connectionDataSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['address', 'diograph', 'contentUrls'],
  properties: {
    id: { type: 'string' },
    address: { type: 'string' },
    clientType: { type: 'string', enum: clientTypeEnum },
    diograph: diographSchema,
    contentUrls: cidMappingSchema,
  },
}

const validateConnectionData = (connectionDataObject: object) => {
  validate(connectionDataSchema, connectionDataObject)
}

export {
  validateDiory,
  validateDiograph,
  validateCIDMapping,
  validateConnectionConfigData,
  validateRoomConfigData,
  validateConnectionData,
}
