import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './_store';
import { App } from './App';
import './index.css';

// setup fake backend
// import { fakeBackend } from './_helpers';
//fakeBackend();

const container = document.getElementById('root');
const root = createRoot(container);

// <React.StrictMode> this is what makes the frontend call all backend endpoints twice. 
// And it is by purpose to find side effects of faulty rendering issues (I think...) -> explained more here: https://stackoverflow.com/a/67595503

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
