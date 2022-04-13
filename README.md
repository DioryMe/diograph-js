# Diograph-js

## Usage

Install:

```
yarn install diograph-js
```

Example:

```js
import { Room, LocalRoomClient } from 'diograph-js'

// Connect to room using LocalRoomClient
const roomAddress = join(__dirname)
const roomClient = new LocalRoomClient({ address: roomAddress })
const room = new Room(roomAddress, roomClient)
await room.loadRoom()

// Load diograph and do stuff with it!
const diographJson = room.diograph
diographJson.loadDiograph().then(() => {
  const diory = diographJson.getDiory('id-of-my-diory')
  diographJson.update(diory.id, { text: 'New name' })
  diographJson.saveDiograph()
})
```

# API

## RoomClient

### initiateRoom

- initiate default room.json content
- initiate default diograph.json content

### loadRoom

- load room.json
- initiate (ContentSource)Clients listen in room.json

### saveRoom

- save room.json
- save diograph.json

### deleteRoom

- delete room.json, diograph.json and images/ folder(?)

## Diograph

### saveDiograph

### search

## Diory

### createDiory

### getDiory

### update

### deleteDiory

# Development

```
yarn
yarn build-watch
yarn test
yarn manual-test
```
