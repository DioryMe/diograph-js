// Base64 colors are 1x1 png images generated with https://png-pixel.com/

const colors: string[] = [
  'mOMPvD6PwAGiwMHcHyXEA', // #5bc0eb
  'mP8c43hPwAHewLTbrmJlA', // #fcd600
  'mOcfdT2PwAGPgKeWQwJuA', // #9bc53d
  'mN8GmnyHwAGEAJzBJT/2A', // #e55934
  'mP8Van4HwAGngKVn65TsQ', // #fa7921
  'mMUMgn7DwACmQGdtDFX8A', // #123456
]

const prefix: string = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42'
const suffix: string = 'AAAABJRU5ErkJggg=='

const getRandom = (array: string[]): string => array[Math.floor(Math.random() * array.length)]

export const getDefaultImage = (): string => {
  return `data:image/png;base64,${prefix}${getRandom(colors)}${suffix}`
}
