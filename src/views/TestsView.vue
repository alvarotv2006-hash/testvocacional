<script setup>
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { quizzes } from '../data/quizzes.js'
import AdSlot from '../components/AdSlot.vue'

useHead({
  title: 'Tests de Personalidad Gratis 2025 — TestVocacional',
  meta: [
    { name: 'description', content: 'Tests de personalidad gratuitos para jóvenes. ¿Quién es tu chico/chica ideal? ¿Qué personaje de serie eres? ¿Qué tipo de amigo eres? Resultado inmediato y comparte en Instagram.' },
    { property: 'og:title', content: 'Tests de Personalidad Gratis — TestVocacional' },
    { property: 'og:url', content: 'https://www.testvocacional.es/tests' },
    { name: 'keywords', content: 'tests de personalidad, test chico ideal, test amigo, test personaje serie, test jóvenes gratis' },
  ],
  link: [{ rel: 'canonical', href: 'https://www.testvocacional.es/tests' }],
})
</script>

<template>
  <!-- HEADER GRADIENT -->
  <div class="relative overflow-hidden noise-overlay animated-gradient">
    <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
    <div class="max-w-6xl mx-auto px-5 pt-14 pb-20 text-white text-center relative z-10">
      <div class="glass inline-flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-full mb-6">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        Todos los tests · Gratis · Sin registro
      </div>
      <h1 class="font-black mb-4 leading-tight"
        style="font-size: clamp(2.5rem,7vw,5rem); letter-spacing:-0.02em">
        ¿Cuánto te conoces? ✨
      </h1>
      <p class="text-white/80 text-xl max-w-lg mx-auto">
        Elige un test, responde en 2 minutos y comparte con tus amigos.
      </p>
    </div>
    <svg class="w-full block" style="margin-bottom:-2px" viewBox="0 0 1440 60"
      preserveAspectRatio="none" fill="white">
      <path d="M0,30 Q180,60 360,30 Q540,0 720,30 Q900,60 1080,30 Q1260,0 1440,30 L1440,60 L0,60 Z"/>
    </svg>
  </div>

  <!-- GRID -->
  <div class="bg-white pt-8 pb-20">
    <div class="max-w-6xl mx-auto px-5">
      <AdSlot slot-id="tests-top" class="mb-12" />
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <RouterLink
          v-for="q in quizzes"
          :key="q.slug"
          :to="`/tests/${q.slug}`"
          class="quiz-card group rounded-3xl overflow-hidden cursor-pointer flex flex-col shadow-xl"
          :style="{ background: `linear-gradient(145deg, ${q.color} 0%, ${q.color}99 100%)` }">

          <div class="relative p-7 flex-1">
            <span v-if="q.hot"
              class="absolute top-0 right-6 glass text-white text-xs font-black px-3 py-1.5 rounded-b-xl">
              🔥 HOT
            </span>
            <div class="text-6xl mb-5 leading-none group-hover:scale-110 transition-transform duration-300">{{ q.emoji }}</div>
            <span class="glass inline-block text-white text-xs font-black px-3 py-1.5 rounded-full mb-4">
              {{ q.category }}
            </span>
            <h2 class="text-white font-black text-xl leading-tight mb-2.5">{{ q.title }}</h2>
            <p class="text-white/75 text-sm leading-relaxed">{{ q.description }}</p>
          </div>

          <div class="glass-dark px-7 py-4 flex items-center justify-between">
            <span class="text-white/60 text-xs font-bold">⏱ {{ q.readTime }} · {{ q.date }}</span>
            <span class="text-white font-black text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
              Empezar
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
