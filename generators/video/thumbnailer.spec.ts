import { generateThumbnail } from './thumbnailer'

describe('generateThumbnail', () => {
  beforeEach(() => {
    process.env.FFMPEG_PATH = 'some-path'
  })

  // it('works', async () => {
  //   const returnValue = await generateThumbnail('some-path')
  //   expect(returnValue).toEqual()
  // })

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
