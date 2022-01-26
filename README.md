# Diograph-js

## Usage

Install:

```
yarn install diograph-js
```

Example:

```js
import DiographJson from 'diograph-js'

const diographJson = new DiographJson({ path: 'diograph.json' })

diographJson.load().then(() => {
  const diory = diographJson.get('id-of-my-diory')
  diographJson.update(diory.id, { text: 'New name' })
  diographJson.save()
})
```

## API

### load

### save

### get

### search

### update

## Development

```
yarn
yarn build
node test.js
```
