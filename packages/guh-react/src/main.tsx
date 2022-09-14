/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Guh, ChangeEvent } from '../lib';

const App = () => {
    const onChange = (event: ChangeEvent) => {
        console.log('text changed', event.detail.value)
    }

    const uploadMedia = (files: File[]) => {
        return files.map(it => ({
            url: it.name,
            alt: 'it.name',
        }))
    }

    return <Guh onChange={onChange} uploadMedia={uploadMedia} value='fdfoduso' />
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
