# preact-lazyimage
> Lazy image loading made easy and simple for preact.

### Installation
```
npm i preact-lazyimage
```

#### Ready to use; just replace!
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

const App = () => (
    <LazyImg style={{width: '40px', height: '40px'}} src="./icon.png"></LazyImg>
);

render(<App/>, document.body);
```

Looking for lazy loading other elements? Check out `preact-lazyload`

### Additional Properties
```jsx
<LazyImg

startLazyLoad={e => {}} // Change what happens when element goes on screen
stopLazyLoad={e => {}} // Change what happens when element goes off screen
noCache={false} // Enable/Disable caching of images; false by default
src={src} // Set source for image

></LazyImg>
```

### Multiple Image Loading
> `preact-lazyimage` also supports "loading up" images in succession

```jsx
// image1.png -> image2.png -> image3.png
<LazyImg src={["./image1.png", "./image2.png", "./image3.png", ...]}></LazyImg>
```