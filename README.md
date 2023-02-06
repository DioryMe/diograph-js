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
const diograph = new Diograph(diographObject)
```

### Diograph
```
diograph.addDiograph(diographObject)
diograph.queryDiograph({ text: 'some-text' })
diograph.resetDiograph()
diograph.toObject()
diograph.toJson()

diograph.getDiory(someDiory)
diograph.addDiory(someDiory)
diograph.updateDiory(someDiory)
diograph.removeDiory(someDiory)
diograph.addDioryLink(someDiory, linkedDiory)
diograph.removeDioryLink(someDiory, linkedDiory)
```

### Root diory
```
diograph.setRoot(someDiory)
diograph.getRoot()
```

### Diory
```
const diory = new Diory()
diory.updateDiory(dioryObject)

diory.addLink(linkedDiory)
diory.removeLink(linkedDiory)

diory.toObject()
diory.toJson()
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
