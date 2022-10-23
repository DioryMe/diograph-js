# Diograph-js

## Usage

Install:

```
yarn install diograph-js
```

Example:

```js
import { Room, RoomClient } from 'diograph-js'
import { LocalClient } from '@diograph/local-client'

// Connect to room using RoomClient
const client = new LocalClient({ address: roomAddress })
const roomClient = new RoomClient(client)
const room = new Room(roomAddress, roomClient)

await room.loadRoom()

// Do stuff with diograph
const diory = room.diograph.getDiory('id-of-my-diory')
diograph.update(diory.id, { text: 'New name' })
room.saveRoom()
```

Example2:

```js
import { Diograph } from 'diograph-js'
import diographObject from './diograph.json'

const diograph = new Diograph()
diograph.mergeDiograph(diographObject)

const newDiory = diograph.createDiory({ text: 'New Diory' })
diograph.updateDiory(diory.id, { text: 'New name' })

dispatch(diograph.toObject())
writeFile('diograph.json', diograph.toObject())
newDiory.toObject()
```

# API

## RoomClient

### initiateRoom

- initiate default room.json content
- initiate default diograph.json content
- call loadRoom

### loadRoom

- load room.json
- initiate (ContentSource)Clients listen in room.json

### saveRoom

- save room.json
- save diograph.json

### deleteRoom

- delete room.json, diograph.json and images/ folder(?)

### addClient

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
```
