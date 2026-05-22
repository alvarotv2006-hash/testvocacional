<script setup>
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import AdSlot from '../components/AdSlot.vue'
import { quizzes } from '../data/quizzes.js'
import { articles } from '../data/articles.js'

useHead({
  title: 'Tests de Personalidad Gratis 2025 — Descúbrete en 2 Minutos',
  meta: [
    { name: 'description', content: 'Tests de personalidad gratuitos para jóvenes. ¿Quién es tu chico/chica ideal? ¿Qué tipo de amigo eres? ¿Qué personaje de serie eres? Sin registro, resultado inmediato.' },
    { property: 'og:title', content: 'Tests de Personalidad Gratis 2025' },
    { property: 'og:description', content: 'Tests rápidos y gratuitos. Descubre tu perfil y comparte con tus amigos.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.testvocacional.es' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'keywords', content: 'tests personalidad, test chico ideal, test amigo, test vocacional, tests jóvenes gratis' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.testvocacional.es' }],
})

const featured = articles.slice(0, 3)
const articleColors = {
  'Orientación':     { bg: '#f5f3ff', text: '#7c3aed' },
  'Mercado laboral': { bg: '#fef3c7', text: '#d97706' },
  'Test':            { bg: '#ecfdf5', text: '#059669' },
  'Por perfil':      { bg: '#eff6ff', text: '#2563eb' },
}
function catStyle(cat) {
  return articleColors[cat] || { bg: '#f3f4f6', text: '#6b7280' }
}
</script>

<template>
  <!-- ══ HERO ══════════════════════════════════════════════════════════════ -->
  <section class="relative overflow-hidden noise-overlay animated-gradient min-h-[92vh] flex items-center">
    <!-- Decorative blobs -->
    <div class="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

    <div class="relative w-full max-w-6xl mx-auto px-5 py-20 flex flex-col lg:flex-row items-center gap-16">
      <!-- LEFT copy -->
      <div class="flex-1 text-center lg:text-left animate-fade-up">
        <div class="glass inline-flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-full mb-8">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Gratis · Sin registro · Resultado inmediato
        </div>

        <h1 class="text-white font-black mb-5 leading-[0.95]"
          style="font-size: clamp(3rem, 8vw, 6rem); letter-spacing: -0.02em">
          ¿Cuánto te<br>conoces? ✨
        </h1>
        <p class="text-white/80 text-xl mb-10 max-w-lg leading-relaxed mx-auto lg:mx-0">
          Tests rápidos y gratuitos. Descubre tu personalidad, comparte con tus amigos y sorpréndete.
        </p>

        <div class="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
          <RouterLink to="/tests"
            class="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white font-black text-base shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/30"
            style="color: #7c3aed">
            Ver todos los tests
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </RouterLink>
          <RouterLink to="/blog"
            class="glass inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-white font-bold text-base hover:bg-white/20 transition-all duration-200">
            📝 Blog
          </RouterLink>
        </div>

        <!-- Social proof -->
        <div class="flex items-center gap-3 justify-center lg:justify-start">
          <div class="flex -space-x-2.5">
            <div v-for="(c, i) in ['#f59e0b','#8b5cf6','#ec4899','#06b6d4','#ef4444']" :key="i"
              class="w-9 h-9 rounded-full border-[2.5px] border-white text-xs flex items-center justify-center font-black text-white shadow-md"
              :style="{ background: c }">{{ ['A','M','J','S','P'][i] }}</div>
          </div>
          <div class="text-white/90 text-sm">
            <span class="font-black text-white text-base">+20.000</span> ya lo han hecho
          </div>
        </div>
      </div>

      <!-- RIGHT: floating test cards preview -->
      <div class="flex-shrink-0 relative w-full max-w-xs hidden lg:block">
        <!-- Main card float-1 -->
        <div class="glass rounded-3xl p-5 float-1 shadow-2xl">
          <div class="text-5xl mb-3">💘</div>
          <h3 class="text-white font-black text-lg mb-1">¿Quién es tu chico/chica ideal?</h3>
          <p class="text-white/70 text-sm mb-4">10 preguntas · Resultado inmediato</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="t in ['Romántico/a','Aventurero/a','Intelectual','Divertido/a']" :key="t"
              class="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">{{ t }}</span>
          </div>
        </div>
        <!-- Small card top-right float-2 -->
        <div class="glass rounded-2xl p-4 float-2 absolute -top-4 -right-8 shadow-xl">
          <div class="text-3xl mb-1">🎉</div>
          <p class="text-white font-black text-sm">Alma de la Fiesta</p>
          <p class="text-white/60 text-xs font-semibold">87% compatibilidad</p>
        </div>
        <!-- Small card bottom-left float-3 -->
        <div class="glass rounded-2xl p-4 float-3 absolute -bottom-6 -left-8 shadow-xl">
          <div class="text-3xl mb-1">📺</div>
          <p class="text-white font-black text-sm">El/La Rebelde</p>
          <p class="text-white/60 text-xs font-semibold">72% match</p>
        </div>
      </div>
    </div>

    <!-- Bottom wave -->
    <svg class="absolute bottom-0 left-0 right-0 w-full" style="margin-bottom:-2px"
      viewBox="0 0 1440 70" preserveAspectRatio="none" fill="white">
      <path d="M0,35 Q180,70 360,35 Q540,0 720,35 Q900,70 1080,35 Q1260,0 1440,35 L1440,70 L0,70 Z"/>
    </svg>
  </section>

  <!-- ══ TESTS GRID ═════════════════════════════════════════════════════════ -->
  <section class="bg-white pt-8 pb-20">
    <div class="max-w-6xl mx-auto px-5">
      <div class="flex items-end justify-between mb-12">
        <div>
          <p class="text-xs font-black text-violet-600 uppercase tracking-widest mb-2">🎯 Tests</p>
          <h2 style="font-size: clamp(1.8rem,4vw,2.75rem)" class="font-black text-gray-900 leading-tight">
            ¿Cuál haces primero?
          </h2>
        </div>
        <RouterLink to="/tests"
          class="hidden sm:inline-flex items-center gap-1.5 text-sm font-black text-violet-600 hover:text-violet-800 transition-colors group">
          Ver todos
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>

      <!-- Grid 2+3 layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <RouterLink
          v-for="q in quizzes"
          :key="q.slug"
          :to="`/tests/${q.slug}`"
          class="quiz-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col shadow-xl"
          :style="{ background: `linear-gradient(145deg, ${q.color} 0%, ${q.color}99 100%)` }">

          <div class="relative p-7 flex-1">
            <!-- Noise texture on card -->
            <div class="absolute inset-0 opacity-[0.06] pointer-events-none rounded-3xl"
              style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E')"></div>
            <!-- HOT badge -->
            <span v-if="q.hot"
              class="absolute top-0 right-6 glass text-white text-xs font-black px-3 py-1.5 rounded-b-xl shadow-lg">
              🔥 HOT
            </span>
            <!-- Emoji -->
            <div class="text-6xl mb-5 leading-none group-hover:scale-110 transition-transform duration-300">{{ q.emoji }}</div>
            <!-- Category pill -->
            <span class="glass inline-block text-white text-xs font-black px-3 py-1.5 rounded-full mb-4">
              {{ q.category }}
            </span>
            <!-- Title -->
            <h3 class="text-white font-black text-xl leading-tight mb-2.5">{{ q.title }}</h3>
            <!-- Desc -->
            <p class="text-white/75 text-sm leading-relaxed line-clamp-2">{{ q.description }}</p>
          </div>

          <!-- Bottom bar -->
          <div class="glass-dark px-7 py-4 flex items-center justify-between">
            <span class="text-white/60 text-xs font-bold">⏱ {{ q.readTime }}</span>
            <span class="text-white font-black text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              Empezar
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Ad -->
  <div class="max-w-3xl mx-auto px-5 pb-12">
    <AdSlot slot-id="home-mid" />
  </div>

  <!-- ══ BLOG ═══════════════════════════════════════════════════════════════ -->
  <section class="dot-pattern py-20 bg-[#fafafa]">
    <div class="max-w-6xl mx-auto px-5">
      <div class="flex items-end justify-between mb-12">
        <div>
          <p class="text-xs font-black text-violet-600 uppercase tracking-widest mb-2">📝 Blog</p>
          <h2 style="font-size: clamp(1.8rem,4vw,2.75rem)" class="font-black text-gray-900 leading-tight">
            Elige tu camino
          </h2>
        </div>
        <RouterLink to="/blog"
          class="hidden sm:inline-flex items-center gap-1.5 text-sm font-black text-violet-600 hover:text-violet-800 transition-colors group">
          Ver todos
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
      <div class="grid sm:grid-cols-3 gap-6">
        <RouterLink v-for="a in featured" :key="a.slug" :to="`/blog/${a.slug}`"
          class="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col border border-gray-100">
          <div class="h-2 w-full" :style="{ background: catStyle(a.category).text }"></div>
          <div class="p-7 flex flex-col flex-1">
            <div class="text-4xl mb-4">{{ a.emoji }}</div>
            <span class="text-xs font-black px-3 py-1.5 rounded-xl w-fit mb-4"
              :style="{ background: catStyle(a.category).bg, color: catStyle(a.category).text }">
              {{ a.category }}
            </span>
            <h3 class="font-black text-gray-900 group-hover:text-violet-700 transition-colors leading-snug mb-3 flex-1 text-lg">
              {{ a.title }}
            </h3>
            <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-5">{{ a.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
              <span class="font-bold">⏱ {{ a.readTime }}</span>
              <span class="font-black text-violet-600 group-hover:text-violet-800 transition-colors">Leer →</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
