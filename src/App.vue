<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref } from 'vue'

const menuOpen = ref(false)
const route = useRoute()
</script>

<template>
  <!-- NAVBAR -->
  <header class="sticky top-0 z-50 bg-white/85 backdrop-blur-2xl border-b border-gray-100/80 shadow-sm">
    <div class="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group" @click="menuOpen=false">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-200"
          style="background: linear-gradient(135deg, #7c3aed, #ec4899)">
          <span class="text-base">✨</span>
        </div>
        <span class="font-black text-gray-900 text-base tracking-tight">TestVocacional</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden sm:flex items-center gap-1">
        <RouterLink to="/tests"
          class="btn-ghost font-bold"
          :class="route.path.startsWith('/tests') ? '!text-violet-700 !bg-violet-50' : ''">
          🎯 Tests
        </RouterLink>
        <RouterLink to="/blog"
          class="btn-ghost font-bold"
          :class="route.path.startsWith('/blog') ? '!text-violet-700 !bg-violet-50' : ''">
          📝 Blog
        </RouterLink>
        <RouterLink to="/tests" class="btn-primary ml-3">
          Hacer test →
        </RouterLink>
      </nav>

      <!-- Mobile menu button -->
      <button @click="menuOpen = !menuOpen"
        class="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile dropdown -->
    <Transition enter-from-class="opacity-0 -translate-y-3" enter-active-class="transition duration-200"
      leave-to-class="opacity-0 -translate-y-3" leave-active-class="transition duration-150">
      <div v-if="menuOpen" class="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1 shadow-lg">
        <RouterLink @click="menuOpen=false" to="/tests"
          class="px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors flex items-center gap-2">
          🎯 Tests de personalidad
        </RouterLink>
        <RouterLink @click="menuOpen=false" to="/blog"
          class="px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors flex items-center gap-2">
          📝 Blog de orientación
        </RouterLink>
        <RouterLink @click="menuOpen=false" to="/tests/vocacional"
          class="px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors flex items-center gap-2">
          🎓 Test Vocacional
        </RouterLink>
        <div class="pt-2 pb-1 px-1">
          <RouterLink @click="menuOpen=false" to="/tests"
            class="btn-primary w-full text-center">
            Hacer test →
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>

  <main>
    <RouterView />
  </main>

  <!-- FOOTER -->
  <footer class="border-t border-gray-100 bg-white mt-16">
    <div class="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
          style="background: linear-gradient(135deg, #7c3aed, #ec4899)">
          <span class="text-xs">✨</span>
        </div>
        <span class="font-black text-gray-700">TestVocacional.es</span>
      </div>
      <p class="text-xs text-gray-400 font-medium">© 2025 TestVocacional · Tests de personalidad gratuitos</p>
      <div class="flex gap-5 text-xs">
        <RouterLink to="/privacidad" class="text-gray-400 hover:text-violet-600 transition-colors font-semibold">Privacidad</RouterLink>
        <RouterLink to="/aviso-legal" class="text-gray-400 hover:text-violet-600 transition-colors font-semibold">Aviso legal</RouterLink>
      </div>
    </div>
  </footer>
</template>
