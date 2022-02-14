# Diograph-js

## Usage

Install:

```
yarn install diograph-js
```

Example:

```js
import { DiographJson } from 'diograph-js'

const diographJson = new DiographJson({ baseUrl: 'diograph.json' })

diographJson.loadDiograph().then(() => {
  const diory = diographJson.getDiory('id-of-my-diory')
  diographJson.update(diory.id, { text: 'New name' })
  diographJson.saveDiograph()
})
```

## API

### load

### save

### get

### search

### update

### delete

## Development

```
yarn
yarn build
node test.js
```
