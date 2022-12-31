# Diograph-js

## Install

```
npm install diograph-js
# or
yarn add diograph-js
```

## Usage

```
import { Diograph } from 'diograph-js'
const diograph = new Diograph()
diograph.createDiory({ text: 'Hello diory!' })
console.log('Hello Diograph!', diograph)
```

## API
```
const diograph = new Diograph(diographObject, rootId)
```

### Diograph
```
diograph.addDiograph(diographObject)
diograph.queryDiograph({ text: 'some-text' })
diograph.resetDiograph()
diograph.toObject()
diograph.toJson()
```

### Diory
```
diograph.addDiory(someDiory)
diograph.createDiory(someDiory)
diograph.getDiory(someDiory)
diograph.updateDiory(someDiory)
diograph.deleteDiory(someDiory)
diograph.createLink(someDiory, linkedDiory)
diograph.deleteLink(someDiory, linkedDiory)
```

## Development

Compile typescript in real time to `/dist` folder:

```
yarn build-watch
```

Run unit tests in the background:

```
yarn test-watch
```
