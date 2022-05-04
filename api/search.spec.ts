import { readFile } from 'fs/promises'
import { Diograph } from '../diograph'

describe('get', () => {
  let diographJson: Diograph

  beforeEach(async () => {
    diographJson = new Diograph('fixtures')
    const diograph = await readFile('fixtures/diograph.json', { encoding: 'utf-8' }).then(
      (data) => {
        return JSON.parse(data)
      },
    )
    diographJson.setDiograph(diograph.diograph)
  })

  it('text search works', () => {
    const expectedResults = [diographJson.getDiory('generic-content')]
    expect(diographJson.search('generic', 'text')).toEqual(expectedResults)
  })

  it('data search works', () => {
    const expectedResults = [diographJson.getDiory('5456c2c3-4a69-4d80-bd2f-caa9945cff71')]
    expect(diographJson.search('VideoObject', 'data')).toEqual(expectedResults)
  })
})
