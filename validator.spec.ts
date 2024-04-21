import { connectionData, connectionDataWithoutDiograph, dioryFixture } from './validator-fixtures'
import {
  validateDiory,
  validateDiograph,
  validateCIDMapping,
  validateRoomConfigData,
  validateConnectionConfigData,
  validateConnectionData,
} from './validator'

describe('validator', () => {
  describe('validateDiory', () => {
    it('validates diory schema correctly', () => {
      const fixture = dioryFixture
      validateDiory(fixture)
    })
  })

  describe('validateDiograph', () => {
    it('validates diograph schema correctly', () => {
      const fixture = connectionData.connections[0].diograph
      validateDiograph(fixture)
    })
  })

  describe('validateCidMapping', () => {
    it('validates cid mapping schema correctly', () => {
      const fixture = connectionData.connections[0].contentUrls
      validateCIDMapping(fixture)
    })
  })

  describe('validateConnectionConfigData', () => {
    it('ConnectionData is valid connection config', () => {
      const fixture = connectionData.connections[0]
      validateConnectionConfigData(fixture)
    })

    it('ConnectionDataWithoutDiograph is valid connection config', () => {
      const fixture = connectionDataWithoutDiograph.connections[0]
      validateConnectionConfigData(fixture)
    })
  })

  describe('validateRoomConfigData', () => {
    it('validates room config data schema correctly', () => {
      const fixture = connectionData.connections[0]
      validateRoomConfigData(fixture)
    })
  })

  describe('validateConnectionData', () => {
    it('valid ConnectionData', () => {
      const fixture = connectionData.connections[0]
      validateConnectionData(fixture)
    })

    it('invalid ConnectionData without diograph', () => {
      const fixture = connectionDataWithoutDiograph.connections[0]
      expect(() => validateConnectionData(fixture)).toThrowError(
        /must have required property 'diograph'/,
      )
    })
  })
})
