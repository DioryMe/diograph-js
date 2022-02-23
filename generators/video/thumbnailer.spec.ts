import { generateThumbnail } from './thumbnailer'
import { executeFfmpegInChildProcess } from './ffmpeg'

jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  readFile: () => new Promise((resolve) => resolve('some-thumbnail-buffer-content')),
}))
jest.mock('./ffmpeg')
const { execFileReturnObjectFixture } = require('./exec-file-return-object-fixture')

describe('generateThumbnail', () => {
  beforeEach(() => {
    ;(executeFfmpegInChildProcess as jest.Mock).mockResolvedValue({
      tmpPath: 'some-path',
      returnObject: execFileReturnObjectFixture,
    })

    process.env.FFMPEG_PATH = 'some-path'
  })

  it('works', async () => {
    const returnValue = await generateThumbnail('some-path')
    expect(returnValue.thumbnailBuffer).toEqual('some-thumbnail-buffer-content')
    expect(returnValue.ffmpegOutput).toEqual(execFileReturnObjectFixture.stderr)
  })

  describe('without FFMPEG env', () => {
    beforeEach(() => {
      delete process.env.FFMPEG_PATH
    })

    it('throws error', async () => {
      const errorMessage = 'FFMPEG_PATH not defined, video/generateThumbnail requires it'
      expect(generateThumbnail('some-path')).rejects.toThrowError(errorMessage)
    })
  })
})
