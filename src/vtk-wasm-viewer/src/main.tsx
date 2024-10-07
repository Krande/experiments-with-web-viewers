import {createRoot} from 'react-dom/client';
import React from 'react';
import App from './App';

const container = document.getElementById('root');
// @ts-ignore
const root = createRoot(container); // create a root
root.render(<App/>);
