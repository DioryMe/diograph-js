import {
  connectionData,
  connectionDataWithId,
  connectionDataWithoutDiograph,
  dioryFixture,
  roomConfigData,
  roomConfigDataWithId,
} from './validator-fixtures'
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
      if (!fixture) throw new Error('Fixture is undefined')
      validateDiograph(fixture)
    })
  })

  describe('validateCidMapping', () => {
    it('validates cid mapping schema correctly', () => {
      const fixture = connectionData.connections[0].contentUrls
      if (!fixture) throw new Error('Fixture is undefined')
      validateCIDMapping(fixture)
    })
  })

  // TODO: Apply these when contentClientType -> clientType rename is done
  // - skipping these shouldn't have any other effect as validateRoomConfigData is tested
  describe('validateConnectionConfigData', () => {
    // it('ConnectionData is valid connection config', () => {
    //   const fixture = connectionData.connections[0]
    //   validateConnectionConfigData(fixture)
    // })
    // it('ConnectionDataWithoutDiograph is valid connection config', () => {
    //   const fixture = connectionDataWithoutDiograph.connections[0]
    //   validateConnectionConfigData(fixture)
    // })
  })

  describe('validateRoomConfigData', () => {
    it('RoomConfigData without id', () => {
      const fixture = roomConfigData
      validateRoomConfigData(fixture)
    })

    it('RoomConfigData with id', () => {
      const fixture = roomConfigDataWithId
      validateRoomConfigData(fixture)
    })
  })

  describe('validateConnectionData', () => {
    it('valid ConnectionData', () => {
      const fixture = connectionData.connections[0]
      validateConnectionData(fixture)
    })

    it('valid ConnectionData with id', () => {
      const fixture = connectionDataWithId.connections[0]
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
