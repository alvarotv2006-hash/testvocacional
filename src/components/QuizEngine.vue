<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import AdSlot from './AdSlot.vue'

const props = defineProps({
  quiz: { type: Object, required: true },
})

// ─── STATE ──────────────────────────────────────────────────────────────────
const screen = ref('intro')
const currentQ = ref(0)
const scores = ref({})
const topProfile = ref(null)
const shareModalOpen = ref(false)
const shareCardUrl = ref('')
const answerSelected = ref(null)
const skipVisible = ref(false)
const copyDone = ref(false)
const resultUnlocked = ref(false)

const questions = computed(() => props.quiz.questions)
const profiles = computed(() => props.quiz.profiles)
const progress = computed(() => Math.round((currentQ.value / questions.value.length) * 100))
const currentProfile = computed(() => topProfile.value ? profiles.value[topProfile.value] : null)

// ─── ACTIONS ────────────────────────────────────────────────────────────────
function startTest() {
  scores.value = Object.fromEntries(Object.keys(profiles.value).map(k => [k, 0]))
  currentQ.value = 0
  answerSelected.value = null
  screen.value = 'quiz'
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

function answer(opts, idx) {
  if (answerSelected.value !== null) return
  answerSelected.value = idx
  for (const [k, v] of Object.entries(opts)) {
    scores.value[k] = (scores.value[k] || 0) + v
  }
  setTimeout(() => {
    answerSelected.value = null
    if (currentQ.value < questions.value.length - 1) {
      currentQ.value++
      if (typeof window !== 'undefined') window.scrollTo({ top: 56, behavior: 'smooth' })
    } else {
      finishQuiz()
    }
  }, 350)
}

function finishQuiz() {
  screen.value = 'loading'
  setTimeout(() => {
    const sorted = Object.entries(scores.value).sort((a, b) => b[1] - a[1])
    topProfile.value = sorted[0][0]
    resultUnlocked.value = false
    skipVisible.value = false
    screen.value = 'result'
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { skipVisible.value = true }, 8000)
  }, 2200)
}

function buildShareText() {
  const p = profiles.value[topProfile.value]
  if (props.quiz.shareText) return props.quiz.shareText(p.name)
  return `¡Soy "${p.name}" ${p.icon}! ¿Cuál eres tú?\n→ testvocacional.es/tests/${props.quiz.slug}`
}

function unlockWithShare(platform) {
  if (typeof window === 'undefined') return
  const text = buildShareText()
  const url = `https://testvocacional.es/tests/${props.quiz.slug}`
  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  } else if (platform === 'copy') {
    navigator.clipboard?.writeText(url).catch(() => {})
    copyDone.value = true
    setTimeout(() => { copyDone.value = false }, 2000)
  }
  // Overlay desaparece y confetti tras la transición
  setTimeout(() => {
    resultUnlocked.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(launchConfetti, 450)
  }, 350)
}

function skipUnlock() {
  resultUnlocked.value = true
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(launchConfetti, 450)
}

function getPercent(key) {
  const total = Object.values(scores.value).reduce((a, b) => a + b, 0)
  return total ? Math.round((scores.value[key] / total) * 100) : 0
}

function sortedProfiles() {
  return Object.entries(profiles.value)
    .map(([k, p]) => ({ key: k, ...p, pct: getPercent(k) }))
    .sort((a, b) => b.pct - a.pct)
}

function launchConfetti() {
  if (typeof window === 'undefined') return
  const colors = [props.quiz.color, '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e']
  const opts = { particleCount: 120, spread: 80, colors, ticks: 400 }
  confetti({ ...opts, origin: { y: 0.6 } })
  setTimeout(() => confetti({ ...opts, particleCount: 60, origin: { x: 0.1, y: 0.7 } }), 250)
  setTimeout(() => confetti({ ...opts, particleCount: 60, origin: { x: 0.9, y: 0.7 } }), 400)
}

function shareWhatsApp() {
  const p = profiles.value[topProfile.value]
  const text = props.quiz.shareText(p.name)
  if (typeof window !== 'undefined') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

function generateCard() {
  const p = profiles.value[topProfile.value]
  const pct = getPercent(topProfile.value)
  const quiz = props.quiz
  const S = 1080
  const cv = document.createElement('canvas')
  cv.width = S; cv.height = S
  const ctx = cv.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, S, S)
  grad.addColorStop(0, quiz.color)
  grad.addColorStop(1, quiz.color + 'bb')
  ctx.fillStyle = grad; ctx.fillRect(0, 0, S, S)
  ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(S * 0.85, S * 0.15, 260, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(S * 0.1, S * 0.88, 180, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  // White card
  const cw = 760, ch = 600, cx0 = S / 2 - cw / 2, cy0 = S / 2 - ch / 2
  ctx.fillStyle = '#fff'; ctx.beginPath()
  ctx.roundRect(cx0, cy0, cw, ch, 48); ctx.fill()
  ctx.font = '110px serif'; ctx.textAlign = 'center'
  ctx.fillText(p.icon, S / 2, cy0 + 155)
  ctx.fillStyle = '#111827'; ctx.font = '700 60px Inter,Arial,sans-serif'
  ctx.fillText(p.name.length > 20 ? p.name.substring(0, 20) + '…' : p.name, S / 2, cy0 + 248)
  ctx.fillStyle = '#6b7280'; ctx.font = '32px Inter,Arial,sans-serif'
  ctx.fillText(quiz.shortTitle, S / 2, cy0 + 300)
  const bw = 440, bh = 16, bx = S / 2 - 220, by = cy0 + 338
  ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.fill()
  ctx.fillStyle = quiz.color; ctx.beginPath(); ctx.roundRect(bx, by, bw * (pct / 100), bh, 8); ctx.fill()
  ctx.fillStyle = quiz.color; ctx.font = '700 46px Inter,Arial,sans-serif'
  ctx.fillText(`${pct}% compatibilidad`, S / 2, cy0 + 428)
  ctx.fillStyle = '#9ca3af'; ctx.font = '26px Inter,Arial,sans-serif'
  ctx.fillText('testvocacional.es', S / 2, cy0 + 476)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = '700 28px Inter,Arial,sans-serif'
  ctx.fillText(quiz.shareTag || '#TestVocacional', S / 2, S - 55)
  return cv.toDataURL('image/png')
}

function openShareCard() {
  shareCardUrl.value = generateCard()
  shareModalOpen.value = true
}

function resetTest() {
  screen.value = 'intro'
  topProfile.value = null
  scores.value = {}
  currentQ.value = 0
  answerSelected.value = null
  skipVisible.value = false
  copyDone.value = false
  resultUnlocked.value = false
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- ── SHARE MODAL ────────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200"
      leave-to-class="opacity-0" leave-active-class="transition duration-150">
      <div v-if="shareModalOpen"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-4"
        @click.self="shareModalOpen = false">
        <div class="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-scale-in">
          <div class="text-center mb-5">
            <div class="text-4xl mb-2">🎉</div>
            <h3 class="font-black text-xl text-gray-900">Tu tarjeta de resultado</h3>
            <p class="text-sm text-gray-500 mt-1">Descarga y comparte en Instagram o WhatsApp</p>
          </div>
          <img :src="shareCardUrl" alt="Tarjeta resultado" class="w-full rounded-2xl mb-5 shadow-md" />
          <a :href="shareCardUrl" :download="`resultado-${quiz.slug}.png`"
            class="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-white mb-3 text-sm transition-all hover:scale-105"
            :style="{ background: `linear-gradient(135deg, ${quiz.color}, ${quiz.color}cc)` }">
            💾 Descargar imagen
          </a>
          <button @click="shareModalOpen = false"
            class="w-full py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══════════════════ UNLOCK OVERLAY ═══════════════════════════════════ -->
  <Teleport to="body">
    <Transition
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-105">
      <div v-if="screen === 'result' && !resultUnlocked && currentProfile"
        class="fixed inset-0 z-[100] flex items-center justify-center py-10 overflow-y-auto"
        :style="{ background: `linear-gradient(145deg, ${currentProfile.color} 0%, ${currentProfile.color} 100%)` }">
        <!-- blobs decorativos -->
        <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

        <div class="relative w-full max-w-sm mx-auto px-5 animate-fade-up text-center">
          <!-- emoji visible, nombre borroso con candado encima -->
          <div class="text-8xl mb-4 leading-none float-1">{{ currentProfile.icon }}</div>
          <div class="relative mb-8 select-none">
            <h2 class="font-black text-white leading-tight blur-md" style="font-size: clamp(2rem, 8vw, 3rem); filter: blur(8px);">
              {{ currentProfile.name }}
            </h2>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span class="text-4xl drop-shadow-lg">🔒</span>
            </div>
          </div>

          <!-- tarjeta de desbloqueo -->
          <div class="bg-white rounded-3xl p-7 shadow-2xl">
            <div class="text-3xl mb-2">🎉</div>
            <h3 class="font-black text-xl text-gray-900 mb-1">¡Tu resultado está listo!</h3>
            <p class="text-sm text-gray-500 mb-6 leading-relaxed">
              Compártelo con tus amigos para desbloquearlo
            </p>

            <div class="flex flex-col gap-3 mb-4">
              <button @click="unlockWithShare('whatsapp')"
                class="flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-white text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
                style="background: linear-gradient(135deg, #25D366, #128C7E)">
                💬 Compartir en WhatsApp
              </button>
              <button @click="unlockWithShare('twitter')"
                class="flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-white text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
                style="background: linear-gradient(135deg, #000000, #333333)">
                𝕏 Compartir en Twitter / X
              </button>
              <button @click="unlockWithShare('copy')"
                class="flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all duration-200 border-2"
                :class="copyDone ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'">
                {{ copyDone ? '✅ ¡Enlace copiado!' : '🔗 Copiar enlace' }}
              </button>
            </div>

            <p class="text-xs text-gray-400">🔥 +8.000 personas ya conocen su resultado</p>

            <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-700">
              <button v-if="skipVisible" @click="skipUnlock"
                class="mt-5 text-xs text-gray-300 hover:text-gray-500 transition-colors underline underline-offset-2 block w-full">
                Ver sin compartir →
              </button>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ══════════════════ INTRO ════════════════════════════════════════════ -->
  <section v-if="screen === 'intro'" class="relative overflow-hidden noise-overlay min-h-[calc(100vh-64px)] flex items-center">
    <div class="absolute inset-0" :style="{ background: `linear-gradient(145deg, ${quiz.color} 0%, ${quiz.color}88 100%)` }"></div>
    <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

    <div class="relative w-full max-w-2xl mx-auto px-5 py-16 text-center animate-fade-up">
      <span class="glass inline-block text-white text-xs font-black px-5 py-2.5 rounded-full mb-7 border border-white/30">
        {{ quiz.category }}
      </span>
      <div class="text-8xl sm:text-9xl mb-6 leading-none float-1 select-none">{{ quiz.emoji }}</div>
      <h1 class="text-white font-black leading-tight mb-5"
        style="font-size: clamp(2rem, 6vw, 3.5rem); letter-spacing: -0.01em">
        {{ quiz.title }}
      </h1>
      <p class="text-white/80 text-lg mb-10 max-w-md mx-auto leading-relaxed">
        {{ quiz.description }}
      </p>

      <!-- Stats -->
      <div class="glass inline-flex items-center gap-6 rounded-2xl px-8 py-4 mb-10 border border-white/30">
        <div class="text-center">
          <div class="text-2xl font-black text-white">{{ questions.length }}</div>
          <div class="text-xs text-white/60 font-bold uppercase tracking-wide">Preguntas</div>
        </div>
        <div class="w-px h-8 bg-white/25"></div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">{{ quiz.readTime }}</div>
          <div class="text-xs text-white/60 font-bold uppercase tracking-wide">Duración</div>
        </div>
        <div class="w-px h-8 bg-white/25"></div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">{{ Object.keys(profiles).length }}</div>
          <div class="text-xs text-white/60 font-bold uppercase tracking-wide">Perfiles</div>
        </div>
      </div>

      <br>
      <button @click="startTest"
        class="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white font-black text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/30 active:scale-100"
        :style="{ color: quiz.color }">
        Empezar el test
        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </button>

      <!-- Social proof -->
      <div class="flex items-center justify-center gap-3 mt-8">
        <div class="flex -space-x-2.5">
          <div v-for="(c,i) in ['#f59e0b','#8b5cf6','#ec4899','#06b6d4']" :key="i"
            class="w-8 h-8 rounded-full border-2 border-white/50 text-xs flex items-center justify-center font-black text-white"
            :style="{ background: c }">{{ ['A','M','J','S'][i] }}</div>
        </div>
        <p class="text-white/80 text-sm"><span class="font-black text-white">+8.000</span> ya lo han hecho</p>
      </div>

      <!-- Profile chips -->
      <div class="flex flex-wrap justify-center gap-2 mt-8">
        <span v-for="[k, p] in Object.entries(profiles)" :key="k"
          class="glass text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/25">
          {{ p.icon }} {{ p.name }}
        </span>
      </div>
    </div>

    <svg class="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 60"
      preserveAspectRatio="none" fill="white">
      <path d="M0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 L0,60 Z"/>
    </svg>
    <div class="h-8 bg-white absolute bottom-0 left-0 right-0"></div>
  </section>

  <!-- ══════════════════ QUIZ ══════════════════════════════════════════════ -->
  <section v-else-if="screen === 'quiz'" class="min-h-[calc(100vh-64px)] bg-white">
    <!-- Progress bar -->
    <div class="border-b border-gray-100 px-5 bg-white sticky top-16 z-40">
      <div class="max-w-2xl mx-auto py-4 flex items-center gap-4">
        <button @click="resetTest" class="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 p-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="flex-1">
          <div class="flex justify-between text-xs font-black mb-2" style="color: #9ca3af">
            <span>{{ currentQ + 1 }} / {{ questions.length }}</span>
            <span :style="{ color: quiz.color }">{{ progress }}%</span>
          </div>
          <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 ease-out"
              :style="{ width: progress + '%', background: `linear-gradient(90deg, ${quiz.color}, ${quiz.color}cc)` }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-5 py-10">
      <AdSlot slot-id="quiz-mid" class="mb-8" />
      <div class="animate-fade-up" :key="currentQ">
        <!-- Question -->
        <div class="text-5xl mb-6 leading-none">{{ questions[currentQ].emoji }}</div>
        <h2 class="font-black text-gray-900 leading-tight mb-8"
          style="font-size: clamp(1.5rem, 4vw, 2rem)">
          {{ questions[currentQ].q }}
        </h2>
        <!-- Answers -->
        <div class="grid sm:grid-cols-2 gap-3">
          <button
            v-for="(ans, idx) in questions[currentQ].a" :key="idx"
            @click="answer(ans.s, idx)"
            :disabled="answerSelected !== null"
            class="answer-btn group w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer relative overflow-hidden"
            :class="{
              'border-gray-100 bg-white hover:-translate-y-0.5 hover:shadow-lg': answerSelected === null,
              'border-gray-100 bg-white opacity-50': answerSelected !== null && answerSelected !== idx,
              'text-white shadow-xl scale-[1.01]': answerSelected === idx,
            }"
            :style="answerSelected === idx
              ? { borderColor: quiz.color, background: quiz.color }
              : { '--accent': quiz.color }">
            <div class="flex items-start gap-4">
              <span
                class="answer-letter w-9 h-9 rounded-xl border-2 flex items-center justify-center text-sm font-black shrink-0 transition-all duration-200"
                :class="answerSelected === idx ? 'bg-white/25 border-white/50 text-white' : 'border-gray-200 bg-gray-50 text-gray-400'">
                {{ String.fromCharCode(65 + idx) }}
              </span>
              <span class="text-sm font-semibold leading-relaxed pt-1 transition-colors"
                :class="answerSelected === idx ? 'text-white' : 'text-gray-700'">
                {{ ans.t }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════ LOADING ═══════════════════════════════════════════ -->
  <section v-else-if="screen === 'loading'"
    class="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 opacity-5 animated-gradient"></div>
    <div class="relative text-center animate-fade-up">
      <div class="relative w-28 h-28 mx-auto mb-8">
        <div class="absolute inset-0 rounded-full opacity-20 animate-ping"
          :style="{ background: quiz.color }"></div>
        <div class="absolute inset-2 rounded-full opacity-15 animate-ping"
          :style="{ background: quiz.color, animationDelay: '0.3s' }"></div>
        <div class="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl text-5xl float-1"
          :style="{ background: `linear-gradient(135deg, ${quiz.color}, ${quiz.color}cc)` }">
          {{ quiz.loadingEmoji || quiz.emoji }}
        </div>
      </div>
      <h2 class="font-black text-gray-900 mb-3" style="font-size: 1.75rem">
        {{ quiz.loadingText || 'Calculando tu resultado...' }}
      </h2>
      <p class="text-gray-400 text-sm mb-6">Un momento, estamos analizando tus respuestas</p>
      <div class="flex justify-center gap-2">
        <div class="w-3 h-3 rounded-full animate-bounce" :style="{ background: quiz.color }" style="animation-delay:0s"></div>
        <div class="w-3 h-3 rounded-full animate-bounce" :style="{ background: quiz.color }" style="animation-delay:0.2s"></div>
        <div class="w-3 h-3 rounded-full animate-bounce" :style="{ background: quiz.color }" style="animation-delay:0.4s"></div>
      </div>
    </div>
  </section>

  <!-- ══════════════════ RESULT ════════════════════════════════════════════ -->
  <section v-else-if="screen === 'result' && currentProfile" class="pb-24">
    <!-- Big hero banner -->
    <div class="relative overflow-hidden noise-overlay text-white text-center py-20"
      :style="{ background: `linear-gradient(145deg, ${currentProfile.color} 0%, ${currentProfile.color}99 100%)` }">
      <div class="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div class="relative max-w-2xl mx-auto px-5 animate-fade-up">
        <p class="glass-dark inline-block text-white/80 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Tu resultado
        </p>
        <div class="text-8xl mb-5 animate-pop-in">{{ currentProfile.icon }}</div>
        <h2 class="font-black text-white leading-tight mb-4"
          style="font-size: clamp(2.5rem, 8vw, 4rem); letter-spacing: -0.02em">
          {{ currentProfile.name }}
        </h2>
        <div class="glass inline-flex items-center gap-2 text-white font-black text-base px-6 py-2.5 rounded-full border border-white/30 mt-1">
          ⚡ {{ getPercent(topProfile) }}% compatibilidad
        </div>
      </div>
      <svg class="w-full absolute bottom-0" viewBox="0 0 1440 55"
        preserveAspectRatio="none" fill="white">
        <path d="M0,27 Q360,55 720,27 Q1080,0 1440,27 L1440,55 L0,55 Z"/>
      </svg>
      <div class="h-7 bg-white absolute bottom-0 left-0 right-0"></div>
    </div>

    <div class="max-w-2xl mx-auto px-5 pt-6 space-y-5">
      <AdSlot slot-id="result-top" />

      <!-- Description -->
      <div class="rounded-3xl p-7 border-2 animate-fade-up"
        :style="{ background: currentProfile.bg, borderColor: currentProfile.color + '44' }">
        <p class="text-xs font-black uppercase tracking-widest mb-3" :style="{ color: currentProfile.color }">
          ¿Quién eres?
        </p>
        <p class="text-gray-800 leading-relaxed font-medium text-base">{{ currentProfile.desc }}</p>
      </div>

      <!-- Profile breakdown -->
      <div class="rounded-3xl border border-gray-100 p-7 bg-white shadow-sm animate-fade-up">
        <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Tu perfil completo</p>
        <div class="space-y-4">
          <div v-for="p in sortedProfiles()" :key="p.key" class="flex items-center gap-3">
            <span class="text-xl w-8 text-center shrink-0">{{ p.icon }}</span>
            <span class="text-sm font-bold text-gray-600 w-36 truncate shrink-0">{{ p.name }}</span>
            <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700"
                :style="{ width: p.pct + '%', background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)` }"></div>
            </div>
            <span class="text-sm font-black w-10 text-right shrink-0" :style="{ color: p.color }">{{ p.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- Share -->
      <div class="grid sm:grid-cols-3 gap-3 pt-1 animate-fade-up">
        <button @click="openShareCard"
          class="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white shadow-xl hover:scale-105 transition-all duration-200"
          style="background: linear-gradient(135deg, #ec4899, #a855f7)">
          📸 Instagram
        </button>
        <button @click="shareWhatsApp"
          class="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white shadow-xl hover:scale-105 transition-all duration-200"
          style="background: linear-gradient(135deg, #22c55e, #16a34a)">
          💬 WhatsApp
        </button>
        <button @click="resetTest"
          class="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-gray-600 bg-gray-50 border-2 border-gray-100 hover:border-gray-200 hover:scale-105 transition-all">
          🔄 Repetir
        </button>
      </div>

      <!-- CTA more tests -->
      <div class="relative overflow-hidden noise-overlay animated-gradient rounded-3xl p-8 text-center animate-fade-up">
        <div class="text-4xl mb-3">👀</div>
        <p class="text-white font-black text-xl mb-1">¿Seguimos?</p>
        <p class="text-white/80 text-sm mb-5">Tenemos más tests que te van a sorprender</p>
        <RouterLink to="/tests"
          class="inline-block bg-white font-black px-8 py-3.5 rounded-2xl text-sm shadow-2xl hover:scale-105 transition-all"
          style="color: #7c3aed">
          Ver todos los tests →
        </RouterLink>
      </div>

      <AdSlot slot-id="result-bottom" />
    </div>
  </section>
</template>

<style scoped>
.answer-btn:not(:disabled):hover {
  border-color: var(--accent) !important;
  background: color-mix(in srgb, var(--accent) 6%, white) !important;
}
.answer-btn:not(:disabled):hover .answer-letter {
  background: var(--accent) !important;
  border-color: var(--accent) !important;
  color: white !important;
}
</style>
