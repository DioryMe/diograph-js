import Ajv from 'ajv'
const ajv = new Ajv({ allErrors: true })
// const addFormats = require('ajv-formats')
// addFormats(ajv)

const diographSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: {
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
          required: ['id', 'path'],
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
  },
  // TODO: Make '/' required
  // required: ['/'],
}

const cidMappingSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  additionalProperties: {
    type: 'string',
  },
}

const validateCIDMapping = (cidMappingObject: object) => {
  validate(cidMappingSchema, cidMappingObject)
}

const roomConfigDataSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['address', 'clientType'],
  properties: {
    id: { type: 'string' },
    address: { type: 'string' },
    clientType: { type: 'string', enum: ['LocalClient', 'S3Client'] },
  },
}

// const connectionConfigDataSchema = roomConfigDataSchema;

const validateRoomConfigData = (configDataObject: object) => {
  validate(roomConfigDataSchema, configDataObject)
}

const validateConnectionConfigData = validateRoomConfigData

const connectionDataSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['address'],
  properties: {
    id: { type: 'string' },
    diograph: diographSchema,
    address: { type: 'string' },
  },
}

const validateConnectionData = (connectionDataObject: object) => {
  validate(connectionDataSchema, connectionDataObject)
}

const validate = (schema: object, objectToValidate: object) => {
  const validate = ajv.compile(schema)

  const isValid = validate(objectToValidate)

  if (!isValid) {
    console.log('Object is not valid based on schema: ' + JSON.stringify(validate.errors))
    throw new Error('Object is not valid based on schema: ' + JSON.stringify(validate.errors))
  }
}

const validateDiograph = (diographObject: object) => {
  validate(diographSchema, diographObject)
}

export {
  validateDiograph,
  validateCIDMapping,
  validateConnectionConfigData,
  validateRoomConfigData,
  validateConnectionData,
}
