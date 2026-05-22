import HomeView from '../views/HomeView.vue'

// vite-ssg gestiona el router internamente — solo exportamos las rutas
export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/tests',
    name: 'tests',
    component: () => import('../views/TestsView.vue'),
  },
  {
    path: '/tests/:slug',
    name: 'quiz',
    component: () => import('../views/QuizView.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'article',
    component: () => import('../views/ArticleView.vue'),
  },
  {
    path: '/privacidad',
    name: 'privacidad',
    component: () => import('../views/PrivacidadView.vue'),
  },
  {
    path: '/aviso-legal',
    name: 'aviso-legal',
    component: () => import('../views/AvisoLegalView.vue'),
  },
]

export default routes
