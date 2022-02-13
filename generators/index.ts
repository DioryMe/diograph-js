function dioryImageGenerator(fileContent: Buffer, filePath: string, contentUrl: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl,
  }
  return { typeSpecificDiory: { data: [schema] }, thumbnailBuffer: fileContent, cid: 'sadfasdf' }
}

export { dioryImageGenerator }
