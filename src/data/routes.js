import { articles } from './articles.js'
import { quizzes } from './quizzes.js'

export function includedRoutes(paths) {
  return paths
    .filter(p => !p.includes(':'))                              // quita rutas dinámicas
    .concat(articles.map(a => `/blog/${a.slug}`))               // rutas de artículos
    .concat(quizzes.map(q => `/tests/${q.slug}`))               // rutas de tests
}
