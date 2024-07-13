import { IDioryDateGeoSearchProps, IDioryObject, IDioryProps } from '../types'
import {
  DioryFilterFunction,
  allKeysExist,
  allMatchToQuery,
  allFilteredByDate,
  allFilteredByLatlng,
} from './utils'

describe('allKeysExist()', () => {
  describe('given text query', () => {
    let allKeysExistWithTextQuery: DioryFilterFunction
    beforeEach(() => {
      const query = { text: 'some-text' }
      allKeysExistWithTextQuery = allKeysExist(query)
    })

    it('returns true with text prop', () => {
      const diory = { id: 'some-id', text: 'other-text' }
      const result = allKeysExistWithTextQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false without text prop', () => {
      const diory = { id: 'some-id' }
      const result = allKeysExistWithTextQuery(diory)

      expect(result).toBe(false)
    })
  })
})
describe('allMatchToQuery()', () => {
  describe('given query with id and text', () => {
    let allMatchToQueryWithTextQuery: DioryFilterFunction
    beforeEach(() => {
      const query = { id: 'some-id', text: 'some-text' }
      allMatchToQueryWithTextQuery = allMatchToQuery(query)
    })

    it('returns true if id and text matches', () => {
      const diory = { id: 'some-id', text: 'some-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false if only text matches', () => {
      const diory = { id: 'other-id', text: 'some-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(false)
    })
  })

  describe('given query with text only', () => {
    let allMatchToQueryWithTextQuery: DioryFilterFunction
    beforeEach(() => {
      const query = { text: 'some-text' }
      allMatchToQueryWithTextQuery = allMatchToQuery(query)
    })

    it('returns true if text matches', () => {
      const diory = { id: 'some-id', text: 'some-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(true)
    })

    it("returns false if text doesn't match", () => {
      const diory = { id: 'some-id', text: 'other-text' }
      const result = allMatchToQueryWithTextQuery(diory)

      expect(result).toBe(false)
    })
  })
})

describe('allFilteredByDate()', () => {
  describe('given query with date', () => {
    let allFilteredByDateWithDateQuery: DioryFilterFunction
    beforeEach(() => {
      const query = { date: '2020-01-11T00:00:00.000Z' }
      allFilteredByDateWithDateQuery = allFilteredByDate(query)
    })

    it('returns true if date/timestamp is during the same day', () => {
      const diory = { id: 'some-id', date: '2020-01-11T11:11:11.000Z' }
      const result = allFilteredByDateWithDateQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false if date is completely different day', () => {
      const diory = { id: 'some-id', date: '2020-01-12T12:12:12.000Z' }
      const result = allFilteredByDateWithDateQuery(diory)

      expect(result).toBe(false)
    })
  })

  describe('given query with dateStart', () => {
    let allFilteredByDateWithDateStartQuery: DioryFilterFunction
    beforeEach(() => {
      const query = { dateStart: '2020-01-11T11:11:11.000Z' }
      allFilteredByDateWithDateStartQuery = allFilteredByDate(query)
    })

    it('returns true if date is after dateStart', () => {
      const diory = { id: 'some-id', date: '2020-01-11T12:12:12.000Z' }
      const result = allFilteredByDateWithDateStartQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false if date is before dateStart', () => {
      const diory = { id: 'some-id', date: '2020-01-11T10:10:10.000Z' }
      const result = allFilteredByDateWithDateStartQuery(diory)

      expect(result).toBe(false)
    })
  })

  describe('given query with dateEnd', () => {
    let allFilteredByDateWithDateEndQuery: DioryFilterFunction
    beforeEach(() => {
      const query = { dateEnd: '2020-01-11T11:11:11.000Z' }
      allFilteredByDateWithDateEndQuery = allFilteredByDate(query)
    })

    it('returns true if date is before dateEnd', () => {
      const diory = { id: 'some-id', date: '2020-01-11T10:10:10.000Z' }
      const result = allFilteredByDateWithDateEndQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false if date is after dateEnd', () => {
      const diory = { id: 'some-id', date: '2020-01-12T12:12:12.000Z' }
      const result = allFilteredByDateWithDateEndQuery(diory)

      expect(result).toBe(false)
    })
  })

  describe('given query with dateStart and dateEnd', () => {
    let allFilteredByDateWithDateStartAndDateEndQuery: DioryFilterFunction
    let query: IDioryDateGeoSearchProps
    beforeEach(() => {
      query = { dateStart: '2020-01-11T10:10:10.000Z', dateEnd: '2020-01-11T12:12:12.000Z' }
      allFilteredByDateWithDateStartAndDateEndQuery = allFilteredByDate(query)
    })

    it('returns true if date is between dateStart and dateEnd', () => {
      const diory = { id: 'some-id', date: '2020-01-11T11:11:11.000Z' }
      const result = allFilteredByDateWithDateStartAndDateEndQuery(diory)

      expect(result).toBe(true)
    })

    it('returns true if date is equal with dateStart', () => {
      const diory = { id: 'some-id', date: query.dateStart }
      const result = allFilteredByDateWithDateStartAndDateEndQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false if date is before dateStart', () => {
      const diory = { id: 'some-id', date: '2020-01-11T09:09:09.000Z' }
      const result = allFilteredByDateWithDateStartAndDateEndQuery(diory)

      expect(result).toBe(false)
    })

    it('returns true if date is equal with dateEnd', () => {
      const diory = { id: 'some-id', date: query.dateEnd }
      const result = allFilteredByDateWithDateStartAndDateEndQuery(diory)

      expect(result).toBe(true)
    })

    it('returns false if date is after dateEnd', () => {
      const diory = { id: 'some-id', date: '2020-01-11T13:13:13.000Z' }
      const result = allFilteredByDateWithDateStartAndDateEndQuery(diory)

      expect(result).toBe(false)
    })
  })
})

describe('allFilteredByLatlng', () => {
  it('should return true for all diories if no latlngStart and latlngEnd are provided', () => {
    const queryDiory: IDioryDateGeoSearchProps = {}
    const filterFunction: DioryFilterFunction = allFilteredByLatlng(queryDiory)
    const diory: IDioryObject = { id: 'some-id', latlng: '60.1699,24.9384' }
    expect(filterFunction(diory)).toBe(true)
  })

  it('should return true for a diory within the specified latlng bounds', () => {
    const queryDiory: IDioryDateGeoSearchProps = {
      latlngStart: '60N,24E',
      latlngEnd: '61N,25E',
    }
    const filterFunction = allFilteredByLatlng(queryDiory)
    const dioryInsideOfArea: IDioryObject = { id: 'some-id', latlng: '60.5,24.5' }
    expect(filterFunction(dioryInsideOfArea)).toBe(true)
  })

  it('should return false for a diory outside the specified latlng bounds', () => {
    const queryDiory: IDioryDateGeoSearchProps = {
      latlngStart: '60N,24E',
      latlngEnd: '61N,25E',
    }
    const filterFunction = allFilteredByLatlng(queryDiory)
    const dioryOutsideOfArea: IDioryObject = { id: 'some-id', latlng: '59.9,23.9' }
    expect(filterFunction(dioryOutsideOfArea)).toBe(false)
  })
})
