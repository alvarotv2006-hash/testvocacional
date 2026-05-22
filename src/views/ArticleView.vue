<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { articles } from '../data/articles.js'
import { quizzes } from '../data/quizzes.js'
import AdSlot from '../components/AdSlot.vue'

const route = useRoute()
const article = computed(() => articles.find(a => a.slug === route.params.slug))

// ── SEO ─────────────────────────────────────────────────────────────────
useHead(computed(() => ({
  title: article.value
    ? `${article.value.title} — TestVocacional`
    : 'Artículo — TestVocacional',
  meta: article.value ? [
    { name: 'description', content: article.value.description },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://www.testvocacional.es/blog/${article.value.slug}` },
    { name: 'keywords', content: `${article.value.title}, orientación vocacional, test vocacional` },
  ] : [],
  link: article.value
    ? [{ rel: 'canonical', href: `https://www.testvocacional.es/blog/${article.value.slug}` }]
    : [],
})))

// ── Category styles ──────────────────────────────────────────────────────
const categoryMeta = {
  'Orientación':     { bg: '#f5f3ff', text: '#7c3aed', grad: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', icon: '🧭' },
  'Mercado laboral': { bg: '#fef3c7', text: '#d97706', grad: 'linear-gradient(135deg, #d97706 0%, #f97316 100%)', icon: '💼' },
  'Test':            { bg: '#ecfdf5', text: '#059669', grad: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', icon: '📊' },
  'Por perfil':      { bg: '#eff6ff', text: '#2563eb', grad: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', icon: '👤' },
  'Personalidad':    { bg: '#fdf4ff', text: '#a21caf', grad: 'linear-gradient(135deg, #a21caf 0%, #db2777 100%)', icon: '🧬' },
}
function catStyle(cat) {
  return categoryMeta[cat] || { bg: '#f3f4f6', text: '#6b7280', grad: 'linear-gradient(135deg, #6b7280, #4b5563)', icon: '📝' }
}

// ── Reading progress bar ─────────────────────────────────────────────────
const readingProgress = ref(0)
function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight > 0) readingProgress.value = Math.min(100, (scrollTop / docHeight) * 100)
}
onMounted(() => window.addEventListener('scroll', updateProgress, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', updateProgress))

// ── Related data ─────────────────────────────────────────────────────────
const relatedQuizzes = computed(() => {
  if (!article.value?.relatedTests?.length) return []
  return article.value.relatedTests
    .map(slug => quizzes.find(q => q.slug === slug))
    .filter(Boolean)
})

const relatedArticlesData = computed(() => {
  if (!article.value?.relatedArticles?.length) return []
  return article.value.relatedArticles
    .map(slug => articles.find(a => a.slug === slug))
    .filter(Boolean)
    .slice(0, 3)
})

// ── Section preview (from ## headings) ───────────────────────────────────
const sectionPreview = computed(() => {
  if (!article.value?.content) return []
  const matches = [...article.value.content.matchAll(/^## (.+)$/gm)]
  return matches.map(m => m[1]).slice(0, 6)
})

// ── Content renderer ─────────────────────────────────────────────────────
function renderContent(text) {
  if (!text) return ''
  return text.trim()
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-12 mb-4 pb-2 border-b border-gray-100">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-800 mt-8 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim())
      if (cells.some(c => /^[-\s]+$/.test(c))) return ''
      return `<tr class="border-b border-gray-100">${cells.map(c =>
        `<td class="px-4 py-2.5 text-sm text-gray-700">${c.trim()}</td>`).join('')}</tr>`
    })
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-gray-700 my-1.5"><span class="text-violet-400 mt-1 shrink-0 text-base leading-none">•</span><span>$1</span></li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="flex items-start gap-2 text-gray-700 my-1.5"><span class="text-violet-600 font-bold shrink-0 w-5 text-sm">$1.</span><span>$2</span></li>')
    .split(/\n\n+/)
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (block.startsWith('<h')) return block
      if (block.startsWith('<li')) return `<ul class="space-y-0.5 my-5 ml-1">${block}</ul>`
      if (block.startsWith('<tr')) return `<div class="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm"><table class="w-full"><tbody>${block}</tbody></table></div>`
      return `<p class="text-gray-600 leading-relaxed my-4 text-[15px]">${block}</p>`
    })
    .join('\n')
}
</script>

<template>
  <!-- ── Reading progress bar (fixed at page top) ──────────────────────── -->
  <div class="reading-progress" :style="{ width: readingProgress + '%' }"></div>

  <div v-if="article">

    <!-- ── Gradient Hero Header ──────────────────────────────────────────── -->
    <div class="noise-overlay relative overflow-hidden"
         :style="{ background: catStyle(article.category).grad }">
      <div class="max-w-2xl mx-auto px-5 py-12 sm:py-16 relative z-10">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-white/70 mb-6 flex-wrap">
          <RouterLink to="/" class="hover:text-white transition-colors">Inicio</RouterLink>
          <span>/</span>
          <RouterLink to="/blog" class="hover:text-white transition-colors">Blog</RouterLink>
          <span>/</span>
          <span class="text-white/90 truncate max-w-[200px]">{{ article.title }}</span>
        </nav>

        <!-- Category badge -->
        <span class="bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 inline-block">
          {{ catStyle(article.category).icon }} {{ article.category }}
        </span>

        <!-- Emoji -->
        <div class="text-5xl sm:text-6xl mb-4 float-1 inline-block">{{ article.emoji }}</div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-4xl font-extrabold text-white leading-tight mt-3 mb-4">
          {{ article.title }}
        </h1>

        <!-- Description -->
        <p class="text-white/80 text-base leading-relaxed mb-6">{{ article.description }}</p>

        <!-- Meta row -->
        <div class="flex items-center gap-3 text-sm text-white/70 font-medium">
          <span class="flex items-center gap-1.5">
            <span>⏱</span> {{ article.readTime }} de lectura
          </span>
          <span>·</span>
          <span class="flex items-center gap-1.5">
            <span>📅</span> {{ article.date }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── Content area ──────────────────────────────────────────────────── -->
    <div class="max-w-2xl mx-auto px-5 py-10">

      <!-- What you'll learn preview -->
      <div v-if="sectionPreview.length > 0"
           class="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">En este artículo</p>
        <ul class="space-y-2">
          <li v-for="(section, i) in sectionPreview" :key="i"
              class="flex items-start gap-2 text-sm text-gray-700">
            <span class="font-bold text-violet-400 shrink-0">{{ i + 1 }}.</span>
            <span>{{ section }}</span>
          </li>
        </ul>
      </div>

      <AdSlot slot-id="article-top" class="mb-8" />

      <!-- Article Content -->
      <article class="prose-custom" v-html="renderContent(article.content)" />

      <AdSlot slot-id="article-bottom" class="mt-10 mb-10" />

      <!-- ── Related Tests ────────────────────────────────────────────── -->
      <div v-if="relatedQuizzes.length > 0" class="mt-10">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Tests relacionados</h3>
        <div class="grid gap-4" :class="relatedQuizzes.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'">
          <RouterLink
            v-for="quiz in relatedQuizzes" :key="quiz.slug"
            :to="quiz.isExternal ? '/' : `/tests/${quiz.slug}`"
            class="group relative rounded-2xl overflow-hidden p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            :style="{ background: `linear-gradient(135deg, ${quiz.color} 0%, ${quiz.color}cc 100%)` }">
            <!-- glow blob -->
            <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
                 :style="{ background: 'white' }"></div>
            <div class="relative z-10">
              <div class="text-3xl mb-2">{{ quiz.emoji }}</div>
              <p class="font-extrabold text-base leading-tight mb-1">{{ quiz.title }}</p>
              <p class="text-white/75 text-xs mb-3">{{ quiz.readTime }} · Gratis</p>
              <span class="bg-white/25 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full group-hover:bg-white/40 transition-colors inline-block">
                Hacer test →
              </span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- ── Related Articles ─────────────────────────────────────────── -->
      <div v-if="relatedArticlesData.length > 0" class="mt-10">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Sigue leyendo</h3>
        <div class="space-y-3">
          <RouterLink
            v-for="rel in relatedArticlesData" :key="rel.slug"
            :to="`/blog/${rel.slug}`"
            class="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:border-violet-200 hover:shadow-md transition-all duration-200">
            <div class="text-3xl flex-shrink-0">{{ rel.emoji }}</div>
            <div class="flex-1 min-w-0">
              <span class="text-xs font-bold px-2 py-0.5 rounded-lg mb-1 inline-block"
                :style="{ background: catStyle(rel.category).bg, color: catStyle(rel.category).text }">
                {{ rel.category }}
              </span>
              <p class="font-bold text-gray-900 group-hover:text-violet-700 transition-colors text-sm leading-snug truncate">
                {{ rel.title }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">⏱ {{ rel.readTime }}</p>
            </div>
            <span class="text-violet-400 group-hover:text-violet-600 transition-colors text-lg flex-shrink-0">→</span>
          </RouterLink>
        </div>
      </div>

      <!-- ── Main CTA ─────────────────────────────────────────────────── -->
      <div class="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white text-center mt-10 noise-overlay relative overflow-hidden">
        <div class="text-4xl mb-3">🎯</div>
        <h3 class="text-xl font-extrabold mb-2">¿Listo para descubrir tu perfil?</h3>
        <p class="text-white/80 text-sm mb-5 max-w-sm mx-auto">Responde 15 preguntas y descubre qué carrera encaja mejor con tu personalidad.</p>
        <RouterLink to="/" class="bg-white text-violet-700 font-bold px-7 py-3 rounded-xl hover:bg-violet-50 transition-colors inline-block text-sm">
          Hacer el test gratis →
        </RouterLink>
      </div>

      <!-- Back link -->
      <div class="mt-8 flex items-center justify-between">
        <RouterLink to="/blog" class="text-sm text-violet-600 hover:text-violet-800 font-semibold transition-colors flex items-center gap-1">
          ← Volver al blog
        </RouterLink>
        <RouterLink to="/tests" class="text-sm text-gray-400 hover:text-violet-600 font-semibold transition-colors flex items-center gap-1">
          Ver todos los tests →
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- ── 404 ────────────────────────────────────────────────────────────── -->
  <div v-else class="max-w-2xl mx-auto px-5 py-24 text-center">
    <div class="text-5xl mb-4">😕</div>
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Artículo no encontrado</h1>
    <p class="text-gray-500 mb-6">Este artículo no existe o ha sido eliminado.</p>
    <RouterLink to="/blog" class="btn-primary">← Volver al blog</RouterLink>
  </div>
</template>
