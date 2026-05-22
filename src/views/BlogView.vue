<script setup>
import { ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { articles } from '../data/articles.js'
import AdSlot from '../components/AdSlot.vue'

useHead({
  title: 'Blog de Orientación Vocacional — Guías para Elegir Carrera',
  meta: [
    { name: 'description', content: 'Artículos y guías prácticas sobre orientación vocacional, carreras con futuro, FP vs universidad y cómo elegir qué estudiar en 2025.' },
    { property: 'og:title', content: 'Blog de Orientación Vocacional' },
    { property: 'og:url', content: 'https://www.testvocacional.es/blog' },
    { name: 'keywords', content: 'orientación vocacional, qué carrera estudiar, carreras con futuro, FP o universidad, test vocacional blog' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.testvocacional.es/blog' }],
})

const categoryMeta = {
  'Orientación':     { bg: '#f5f3ff', text: '#7c3aed', grad: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', icon: '🧭' },
  'Mercado laboral': { bg: '#fef3c7', text: '#d97706', grad: 'linear-gradient(135deg, #d97706 0%, #f97316 100%)', icon: '💼' },
  'Test':            { bg: '#ecfdf5', text: '#059669', grad: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', icon: '📊' },
  'Por perfil':      { bg: '#eff6ff', text: '#2563eb', grad: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', icon: '👤' },
  'Personalidad':    { bg: '#fdf4ff', text: '#a21caf', grad: 'linear-gradient(135deg, #a21caf 0%, #db2777 100%)', icon: '🧬' },
}

const allCategoryNames = Object.keys(categoryMeta)
const activeCategory = ref('Todos')

const filteredArticles = computed(() => {
  if (activeCategory.value === 'Todos') return articles
  return articles.filter(a => a.category === activeCategory.value)
})

const featuredArticle = computed(() => filteredArticles.value[0] || null)
const gridArticles = computed(() => filteredArticles.value.slice(1))

function catStyle(cat) {
  return categoryMeta[cat] || { bg: '#f3f4f6', text: '#6b7280', grad: '#6b7280', icon: '📝' }
}

function countByCategory(cat) {
  return articles.filter(a => a.category === cat).length
}

const totalReadTime = computed(() =>
  filteredArticles.value.reduce((acc, a) => acc + (parseInt(a.readTime) || 0), 0)
)
</script>

<template>
  <div>
    <!-- ── HERO ─────────────────────────────────────────────────────────── -->
    <div class="animated-gradient noise-overlay relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-5 py-16 sm:py-20 text-center relative z-10">
        <!-- pill -->
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white/90 text-sm font-semibold mb-6">
          📚 {{ articles.length }} artículos · {{ allCategoryNames.length }} categorías
        </div>

        <h1 class="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-sm">
          Blog de Orientación Vocacional
        </h1>
        <p class="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Guías prácticas, tests de personalidad y consejos reales para elegir tu camino profesional con confianza.
        </p>

        <!-- quick category chips -->
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="cat in allCategoryNames" :key="cat"
            @click="activeCategory = cat"
            class="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90 text-xs font-semibold hover:bg-white/30 transition-colors cursor-pointer border border-white/20">
            {{ catStyle(cat).icon }} {{ cat }} · {{ countByCategory(cat) }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── MAIN CONTENT ──────────────────────────────────────────────────── -->
    <div class="max-w-6xl mx-auto px-5 py-10">

      <!-- Category Filter Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          @click="activeCategory = 'Todos'"
          :class="['flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200',
            activeCategory === 'Todos'
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
          Todos ({{ articles.length }})
        </button>
        <button
          v-for="cat in allCategoryNames" :key="cat"
          @click="activeCategory = cat"
          :class="['flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200',
            activeCategory === cat ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          :style="activeCategory === cat ? { background: catStyle(cat).grad } : {}">
          {{ catStyle(cat).icon }} {{ cat }} ({{ countByCategory(cat) }})
        </button>
      </div>

      <!-- Results summary -->
      <p class="text-sm text-gray-400 mb-6 font-medium">
        <span class="font-bold text-gray-600">{{ filteredArticles.length }}</span>
        artículo{{ filteredArticles.length !== 1 ? 's' : '' }}
        <span v-if="activeCategory !== 'Todos'"> en <strong>{{ activeCategory }}</strong></span>
        · {{ totalReadTime }} min de lectura total
      </p>

      <!-- ── Featured Article ──────────────────────────────────────────── -->
      <RouterLink
        v-if="featuredArticle"
        :to="`/blog/${featuredArticle.slug}`"
        class="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-violet-100 transition-all duration-300 hover:-translate-y-1 mb-6">
        <div class="h-2 w-full" :style="{ background: catStyle(featuredArticle.category).grad }"></div>
        <div class="p-6 sm:p-8 sm:flex gap-6 items-center">
          <!-- emoji -->
          <div class="text-6xl sm:text-8xl mb-4 sm:mb-0 flex-shrink-0 text-center sm:text-left">
            {{ featuredArticle.emoji }}
          </div>
          <!-- text -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="text-xs font-bold px-2.5 py-1 rounded-lg"
                :style="{ background: catStyle(featuredArticle.category).bg, color: catStyle(featuredArticle.category).text }">
                {{ catStyle(featuredArticle.category).icon }} {{ featuredArticle.category }}
              </span>
              <span class="text-xs bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-lg">⭐ Destacado</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 group-hover:text-violet-700 transition-colors leading-tight mb-2">
              {{ featuredArticle.title }}
            </h2>
            <p class="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
              {{ featuredArticle.description }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400 font-medium">⏱ {{ featuredArticle.readTime }} · {{ featuredArticle.date }}</span>
              <span class="text-sm font-bold text-violet-600 group-hover:text-violet-800 transition-colors">
                Leer artículo →
              </span>
            </div>
          </div>
        </div>
      </RouterLink>

      <AdSlot slot-id="blog-top" class="mb-6" />

      <!-- ── Articles Grid ─────────────────────────────────────────────── -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <RouterLink
          v-for="a in gridArticles" :key="a.slug"
          :to="`/blog/${a.slug}`"
          class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-violet-100 transition-all duration-200 hover:-translate-y-1 flex flex-col">
          <div class="h-1.5 w-full" :style="{ background: catStyle(a.category).grad }"></div>
          <div class="p-5 flex flex-col flex-1">
            <div class="text-4xl mb-3">{{ a.emoji }}</div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-lg w-fit mb-3"
              :style="{ background: catStyle(a.category).bg, color: catStyle(a.category).text }">
              {{ catStyle(a.category).icon }} {{ a.category }}
            </span>
            <h2 class="font-bold text-gray-900 group-hover:text-violet-700 transition-colors leading-snug mb-2 flex-1 text-lg">
              {{ a.title }}
            </h2>
            <p class="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-4">{{ a.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
              <span class="font-medium">⏱ {{ a.readTime }} · {{ a.date }}</span>
              <span class="font-semibold text-violet-500 group-hover:text-violet-700 transition-colors">Leer →</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <!-- Empty state -->
      <div v-if="filteredArticles.length === 0" class="text-center py-20">
        <div class="text-5xl mb-4">🔍</div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Pronto habrá artículos aquí</h3>
        <p class="text-gray-500 text-sm mb-6">Estamos preparando contenido para esta categoría.</p>
        <button @click="activeCategory = 'Todos'" class="btn-primary">Ver todos los artículos</button>
      </div>

      <!-- ── CTA Banner ─────────────────────────────────────────────────── -->
      <div class="mt-14 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white text-center noise-overlay relative overflow-hidden">
        <div class="text-4xl mb-3">🎯</div>
        <h3 class="text-xl sm:text-2xl font-extrabold mb-2">¿Todavía no sabes qué estudiar?</h3>
        <p class="text-white/80 text-sm mb-6 max-w-md mx-auto">Haz el test vocacional gratis. 15 preguntas, resultados al instante con carreras recomendadas para tu perfil.</p>
        <RouterLink to="/" class="bg-white text-violet-700 font-bold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors inline-block text-sm">
          Hacer el test gratis →
        </RouterLink>
      </div>

    </div>
  </div>
</template>
