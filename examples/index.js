import 'preact/debug';

import { h, render } from 'preact';

import './style';

import LazyImg from '../index.js';

const App = () => (
    <Fragment>
        {
            Array(120).fill("./icon.png").map(img => {
                return (
                    <LazyImg style={{width: '40px', height: '40px'}} src={img}></LazyImg>
                );
            })
        }
    </Fragment>
);

export default App;