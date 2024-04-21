export const connectionData = {
  connections: [
    {
      address: 'some-address',
      clientType: 'LocalClient',
      contentUrls: {
        'pixnio-public-domain-test-content.txt':
          '/Scouts BSA International/pixnio-public-domain-test-content.txt',
        bafkreidqzn2oioyvd62dc4cxvtbuwxcq6p7v5b3ro2i5yoofpa4ouppimy:
          '/Scouts BSA International/PIXNIO-54454-6138x4092.jpeg',
        bafkreicuh7r63n4peyr6bluc3ebenq4lw4jh463d3mpdilnwaysn3us324:
          '/Scouts BSA International/PIXNIO-53555-1782x1188.jpeg',
      },
      diograph: {
        diory13: {
          id: 'diory13',
          text: 'Diory 13',
          image:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOMPvD6PwAGiwMHcHyXEAAAAABJRU5ErkJggg==',
          modified: '2020-01-03T14:03:04.751Z',
          created: '2020-01-03T14:03:04.751Z',
        },
      },
    },
  ],
}

export const connectionDataWithoutDiograph = {
  connections: [
    {
      address: 'some-address',
      clientType: 'LocalClient',
      contentUrls: {
        'pixnio-public-domain-test-content.txt':
          '/Scouts BSA International/pixnio-public-domain-test-content.txt',
        bafkreidqzn2oioyvd62dc4cxvtbuwxcq6p7v5b3ro2i5yoofpa4ouppimy:
          '/Scouts BSA International/PIXNIO-54454-6138x4092.jpeg',
        bafkreicuh7r63n4peyr6bluc3ebenq4lw4jh463d3mpdilnwaysn3us324:
          '/Scouts BSA International/PIXNIO-53555-1782x1188.jpeg',
      },
    },
  ],
}

export const dioryFixture = {
  id: '5456c2c3-4a69-4d80-bd2f-caa9945cff71',
  text: 'some-video.mov',
  created: '2020-07-05T09:39:40.000Z',
  modified: '2020-07-05T09:39:40.000Z',
  data: [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      contentUrl: 'bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji',
      encodingFormat: 'video/mp4',
    },
  ],
}
