import { parseFfmpegOutput, parseLatlng, parseDate, parseDuration } from './ffmpeg-output-parser'

describe('parseLatlng', () => {
  it('fixture location', async () => {
    expect(parseLatlng('    location        : +65.4752+027.9785/')).toEqual('65.4752, 27.9785')
  })
})
