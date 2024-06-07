import { ConnectionData, IDioryObject, RoomConfigData } from './types'

export const roomConfigData: RoomConfigData = {
  address: '/this/is/its/address',
  clientType: 'LocalClient',
}

export const roomConfigDataWithId: RoomConfigData = {
  id: 'room-1',
  address: '/this/is/its/address',
  clientType: 'LocalClient',
}

export const connectionData: { connections: ConnectionData[] } = {
  connections: [
    {
      address: 'some-address',
      contentClientType: 'LocalClient',
      contentUrls: {
        'pixnio-public-domain-test-content.txt':
          '/Scouts BSA International/pixnio-public-domain-test-content.txt',
        bafkreidqzn2oioyvd62dc4cxvtbuwxcq6p7v5b3ro2i5yoofpa4ouppimy:
          '/Scouts BSA International/PIXNIO-54454-6138x4092.jpeg',
        bafkreicuh7r63n4peyr6bluc3ebenq4lw4jh463d3mpdilnwaysn3us324:
          '/Scouts BSA International/PIXNIO-53555-1782x1188.jpeg',
      },
      diograph: {
        '/': {
          id: '/',
          text: 'root-diory',
          created: '2022-06-01T07:30:07.991Z',
          modified: '2022-06-01T07:30:08.003Z',
        },
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

export const connectionDataWithoutDiograph: { connections: ConnectionData[] } = {
  connections: [
    {
      address: 'some-address',
      contentClientType: 'LocalClient',
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

export const connectionDataWithId: { connections: ConnectionData[] } = {
  connections: [
    {
      id: 'some-id',
      address: 'some-address',
      contentClientType: 'LocalClient',
      contentUrls: {
        'pixnio-public-domain-test-content.txt':
          '/Scouts BSA International/pixnio-public-domain-test-content.txt',
        bafkreidqzn2oioyvd62dc4cxvtbuwxcq6p7v5b3ro2i5yoofpa4ouppimy:
          '/Scouts BSA International/PIXNIO-54454-6138x4092.jpeg',
        bafkreicuh7r63n4peyr6bluc3ebenq4lw4jh463d3mpdilnwaysn3us324:
          '/Scouts BSA International/PIXNIO-53555-1782x1188.jpeg',
      },
      diograph: {
        '/': {
          id: '/',
          text: 'root-diory',
          created: '2022-06-01T07:30:07.991Z',
          modified: '2022-06-01T07:30:08.003Z',
        },
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

export const dioryFixture: IDioryObject = {
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
