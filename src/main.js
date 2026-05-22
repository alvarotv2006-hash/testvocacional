import './assets/main.css'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router/index.js'

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior: () => ({ top: 0 }) },
  ({ app, router, head }) => {
    // head lo provee vite-ssg automáticamente — solo necesitamos usarlo en los componentes
  }
)
