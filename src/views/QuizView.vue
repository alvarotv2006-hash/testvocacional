<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { quizzes } from '../data/quizzes.js'
import TestVocacional from '../components/TestVocacional.vue'
import QuizEngine from '../components/QuizEngine.vue'

const route = useRoute()
const slug = computed(() => route.params.slug)
const quiz = computed(() => quizzes.find(q => q.slug === slug.value))

useHead(computed(() => ({
  title: quiz.value
    ? `${quiz.value.title} — TestVocacional`
    : 'Test — TestVocacional',
  meta: quiz.value ? [
    { name: 'description', content: quiz.value.description },
    { property: 'og:title', content: quiz.value.title },
    { property: 'og:description', content: quiz.value.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `https://www.testvocacional.es/tests/${quiz.value.slug}` },
    { name: 'keywords', content: `${quiz.value.title}, test personalidad, test gratis, ${quiz.value.category}` },
  ] : [],
  link: quiz.value
    ? [{ rel: 'canonical', href: `https://www.testvocacional.es/tests/${quiz.value.slug}` }]
    : [],
})))
</script>

<template>
  <!-- Quiz not found -->
  <div v-if="!quiz" class="max-w-2xl mx-auto px-5 py-24 text-center">
    <div class="text-5xl mb-4">😕</div>
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Test no encontrado</h1>
    <p class="text-gray-500 mb-6">Este test no existe o ha sido eliminado.</p>
    <RouterLink to="/tests" class="btn-primary">← Ver todos los tests</RouterLink>
  </div>

  <!-- Vocacional: use original component -->
  <TestVocacional v-else-if="slug === 'vocacional'" />

  <!-- Generic quizzes: use QuizEngine -->
  <QuizEngine v-else :quiz="quiz" />
</template>
