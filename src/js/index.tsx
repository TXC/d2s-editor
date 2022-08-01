import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './components/App'
import utils from './utils'
import '../scss/index.scss'

window.uuid = utils.UUIDv4()
window.palettes = {}

const el = document.getElementById('app')
if (el === null) {
    throw 'Can\'t find element to bind to'
}

const root = ReactDOM.createRoot(el)
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
