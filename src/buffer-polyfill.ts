import __buffer_polyfill from 'vite-plugin-node-polyfills/shims/buffer'

globalThis.Buffer = globalThis.Buffer || __buffer_polyfill
