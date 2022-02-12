import { DiographJson } from '../diograph'

describe('get', () => {
  let diographJson: DiographJson

  beforeEach(async () => {
    diographJson = new DiographJson({ baseUrl: 'fixtures' })
    await diographJson.load()
  })

  it('text search works', () => {
    const expectedResults = [diographJson.get('generic-content')]
    expect(diographJson.search('generic', 'text')).toEqual(expectedResults)
  })

  it('data search works', () => {
    const expectedResults = [diographJson.get('5456c2c3-4a69-4d80-bd2f-caa9945cff71')]
    expect(diographJson.search('VideoObject', 'data')).toEqual(expectedResults)
  })
})
