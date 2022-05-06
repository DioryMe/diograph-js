import { readFile } from 'fs/promises'
import { Diograph } from '../diograph'

describe('search', () => {
  let diograph: Diograph

  beforeEach(async () => {
    diograph = new Diograph('fixtures')
    // TODO: Parse JSON with Diograph.parseJSON (=class method)
    const diographFixture = await readFile('fixtures/diograph.json', { encoding: 'utf-8' }).then(
      (data) => {
        return JSON.parse(data)
      },
    )
    diograph.setDiograph(diographFixture.diograph)
  })

  it('text search works', () => {
    const expectedResults = [diograph.getDiory2('generic-content')]
    expect(diograph.search('generic', 'text')).toEqual(expectedResults)
  })

  it('data search works', () => {
    const expectedResults = [diograph.getDiory2('5456c2c3-4a69-4d80-bd2f-caa9945cff71')]
    expect(diograph.search('VideoObject', 'data')).toEqual(expectedResults)
  })
})
