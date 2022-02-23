import { dioryVideoGenerator } from '.'
import { generateThumbnail } from './thumbnailer'

jest.mock('./thumbnailer')
const { execFileReturnObjectFixture } = require('./ffmpeg-return-object-fixture')
;(generateThumbnail as jest.Mock).mockResolvedValue({
  thumbnailBuffer: 'some-buffer',
  ffmpegOutput: execFileReturnObjectFixture.stderr,
})

describe('dioryVideoGenerator', () => {
  beforeEach(() => {})

  it('works', async () => {
    const { thumbnailBuffer, typeSpecificDiory } = await dioryVideoGenerator(
      'some-path',
      'some-content-url',
    )
    expect(thumbnailBuffer).toEqual('some-buffer')
    expect(typeSpecificDiory.date).toEqual('2020-06-30T08:18:22.000000Z')
    expect(typeSpecificDiory.latlng).toEqual('65.4752, 27.9785')
    expect(typeSpecificDiory.data[0].duration).toEqual('00:00:34.56')
  })
})
