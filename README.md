# preact-lazyimage
> Lazy image loading made easy and simple for preact.

### Installation
```
npm i preact-lazyimage
```

#### Drop In Replacement!
```jsx
// Old
<img src="./image"></img>

// Replace with:

// Lazy Image Loading
<LazyImg src="./image"></LazyImg>
```

### Usage
```jsx
import { h } from 'preact';

import LazyImg from 'preact-lazyimage';

const App = () => <LazyImg style={{width: '40px', height: '40px'}} src="./icon.png"></LazyImg>;

render(<App/>, document.body);
```

Looking for lazy loading other elements? Check out [`preact-lazyload`](https://www.npmjs.com/package/preact-lazyload)

### Properties
```jsx
<LazyImg
  onLoad={imgElement => {}}   // Triggered when image loads
  onUnload={imgElement => {}} // Triggered when image unloads
  delay={0}                   // Delay lazy loading in milliseconds
  cache={true}                // Enable/Disable caching of images; true by default
  src={src}                   // Set source for image
  legacy={false}              // Use getBoundingClientRect instead of IntersectionObservers
  preloadWidth={0}            // Preload the images with an offset width, legacy must be set to `true`
  preloadHeight={0}           // Preload the images with an offset height, legacy must be set to `true`
  {...props}                  // Remaining properties are applied onto the image element
></LazyImg>
```
