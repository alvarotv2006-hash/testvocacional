<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import confetti from 'canvas-confetti'
import AdSlot from './AdSlot.vue'

const QUIZ_COLOR = '#7c3aed'

// ─── DATA ──────────────────────────────────────────────────────────────────
const profiles = {
  tecnico:     { name:'Técnico / Ingeniero',       icon:'⚙️',  color:'#6366f1', bg:'#eef2ff', careers:['Ingeniería Industrial','Informática','Arquitectura','Mecánica','Electrónica','Robótica','Obra Civil','Automoción'], famous:['Elon Musk ⚡','Nikola Tesla 🔧','Gustave Eiffel 🏗️'], desc:'Eres una persona práctica y resolutiva. Disfrutas trabajando con tecnología, herramientas y sistemas. Tu mayor satisfacción es transformar ideas abstractas en soluciones concretas y tangibles.' },
  cientifico:  { name:'Científico / Investigador', icon:'🔬',  color:'#8b5cf6', bg:'#f5f3ff', careers:['Medicina','Biología','Física','Química','Matemáticas','Farmacia','Biotecnología','Astrofísica'], famous:['Marie Curie 🧪','Albert Einstein 🌌','Stephen Hawking 🔭'], desc:'Tu mente es analítica y curiosa. Disfrutas investigando, haciendo preguntas y buscando respuestas con evidencia. El rigor científico y el descubrimiento son tu motor.' },
  creativo:    { name:'Creativo / Artístico',      icon:'🎨',  color:'#ec4899', bg:'#fdf2f8', careers:['Diseño Gráfico','Bellas Artes','Arquitectura','Moda','Publicidad','Animación','Fotografía','Música'], famous:['Picasso 🖌️','Coco Chanel 👗','Steve Jobs 🍎'], desc:'Eres una persona con una sensibilidad especial para la estética y la expresión. Piensas visualmente, tienes ideas originales y disfrutas creando cosas que conectan emocionalmente.' },
  social:      { name:'Social / Educador',         icon:'🤝',  color:'#f59e0b', bg:'#fffbeb', careers:['Psicología','Educación','Trabajo Social','Medicina','Enfermería','RRHH','Terapia Ocupacional','Logopedia'], famous:['Nelson Mandela 🕊️','María Montessori 📚','Gandhi ✌️'], desc:'Te importan las personas por encima de todo. Tienes una gran empatía, escuchas activamente y encuentras satisfacción en ayudar a otros a crecer o superar dificultades.' },
  lider:       { name:'Líder / Emprendedor',       icon:'🚀',  color:'#ef4444', bg:'#fef2f2', careers:['ADE','Derecho','Marketing','Relaciones Internacionales','Economía','Ciencias Políticas','Comunicación','MBA'], famous:['Jeff Bezos 📦','Oprah Winfrey 🎤','Napoleon Bonaparte ♟️'], desc:'Tienes visión de futuro, capacidad de persuadir y energía para liderar equipos hacia objetivos ambiciosos. Disfrutas tomando decisiones y asumiendo responsabilidad.' },
  analitico:   { name:'Analítico / Economista',    icon:'📊',  color:'#06b6d4', bg:'#ecfeff', careers:['Economía','Matemáticas','Estadística','Finanzas','Ingeniería','Actuaría','Data Science','Contabilidad'], famous:['Warren Buffett 💰','John Maynard Keynes 📈','Ada Lovelace 💻'], desc:'Piensas en sistemas y patrones. Disfrutas descomponiendo problemas complejos en partes, trabajando con datos y encontrando lógica donde otros ven caos.' },
  naturalista: { name:'Naturalista / Aventurero',  icon:'🌿',  color:'#16a34a', bg:'#f0fdf4', careers:['Biología','Veterinaria','Ciencias Ambientales','Educación Física','Geografía','Agronomía','Turismo','Nutrición'], famous:['David Attenborough 🌍','Usain Bolt 🏃','Jane Goodall 🐒'], desc:'Eres una persona conectada con el mundo natural y físico. Disfrutas al aire libre, con animales, el medioambiente o el deporte. Aprendes mejor con la experiencia directa.' },
  comunicador: { name:'Comunicador / Periodista',  icon:'🎙️', color:'#0ea5e9', bg:'#f0f9ff', careers:['Periodismo','Comunicación Audiovisual','Marketing Digital','Relaciones Públicas','Publicidad','Redes Sociales','Escritura Creativa','Locución'], famous:['Christiane Amanpour 📺','García Márquez ✍️','Michelle Obama 🎤'], desc:'Tienes un don para transmitir ideas, contar historias y conectar con audiencias. Disfrutas escribiendo, hablando en público o creando contenido que llega a mucha gente.' },
}

const questions = [
  { q:'¿Qué actividad disfrutas más en tu tiempo libre?', emoji:'🎯', a:[{t:'Construir, arreglar o hacer manualidades',s:{tecnico:3}},{t:'Leer, investigar o resolver puzzles complejos',s:{cientifico:3}},{t:'Dibujar, escribir, crear música o actuar',s:{creativo:3}},{t:'Quedar con amigos y ayudar a los demás',s:{social:3}}]},
  { q:'En un trabajo ideal, ¿qué es lo más importante?', emoji:'💼', a:[{t:'Resolver problemas técnicos desafiantes',s:{tecnico:2,analitico:1}},{t:'Descubrir cosas nuevas y hacer investigación',s:{cientifico:3}},{t:'Tener libertad creativa y expresarme',s:{creativo:3}},{t:'Ayudar e impactar positivamente en personas',s:{social:2,comunicador:1}}]},
  { q:'¿Cuál de estos proyectos te gustaría más?', emoji:'📚', a:[{t:'Construir un robot o circuito eléctrico',s:{tecnico:3}},{t:'Investigar y presentar un tema científico',s:{cientifico:2,analitico:1}},{t:'Crear una obra de teatro o exposición de arte',s:{creativo:3}},{t:'Organizar una campaña de ayuda solidaria',s:{social:2,lider:1}}]},
  { q:'¿Cómo prefieres trabajar?', emoji:'👥', a:[{t:'Solo/a, concentrado/a en mi tarea',s:{tecnico:1,cientifico:2,analitico:2}},{t:'En equipo pequeño con objetivos claros',s:{tecnico:1,naturalista:1}},{t:'Liderando a un grupo de personas',s:{lider:3}},{t:'Con mucha gente, en contacto continuo',s:{social:2,comunicador:2}}]},
  { q:'Cuando tienes un problema, ¿qué haces primero?', emoji:'🧩', a:[{t:'Busco información y datos para entenderlo',s:{cientifico:2,analitico:2}},{t:'Intento solucionarlo con mis manos',s:{tecnico:3}},{t:'Hablo con alguien para pedir opinión',s:{social:2,comunicador:1}},{t:'Pienso en la estrategia y los pasos',s:{lider:2,analitico:1}}]},
  { q:'¿Qué tipo de contenido consumes más?', emoji:'📖', a:[{t:'Ciencia, tecnología o divulgación',s:{cientifico:3,tecnico:1}},{t:'Arte, diseño, música o cultura',s:{creativo:3}},{t:'Negocios, liderazgo o emprendimiento',s:{lider:3}},{t:'Naturaleza, deporte, viajes o aventura',s:{naturalista:3}}]},
  { q:'¿Qué habilidad se te da mejor de forma natural?', emoji:'⭐', a:[{t:'Entender cómo funcionan los sistemas',s:{tecnico:3}},{t:'Analizar datos y encontrar patrones',s:{analitico:3,cientifico:1}},{t:'Comunicar ideas de forma convincente',s:{comunicador:3,lider:1}},{t:'Empatizar y entender a los demás',s:{social:3}}]},
  { q:'¿Qué impacto quieres tener en el mundo?', emoji:'🌍', a:[{t:'Crear tecnología que mejore la vida',s:{tecnico:2,cientifico:1}},{t:'Ayudar a personas en situaciones difíciles',s:{social:3}},{t:'Construir empresas que generen valor',s:{lider:3}},{t:'Proteger el medioambiente y la naturaleza',s:{naturalista:3}}]},
  { q:'¿Cómo imaginas tu lugar de trabajo ideal?', emoji:'🏢', a:[{t:'Un laboratorio, taller o espacio técnico',s:{tecnico:2,cientifico:2}},{t:'Un estudio creativo o espacio de diseño',s:{creativo:3}},{t:'Una oficina dinámica o sala de reuniones',s:{lider:2,analitico:1}},{t:'Al aire libre, en movimiento o con personas',s:{naturalista:2,social:1}}]},
  { q:'¿Qué asignatura disfrutabas más en el colegio?', emoji:'✏️', a:[{t:'Matemáticas, Física o Tecnología',s:{tecnico:2,analitico:2}},{t:'Lengua, Literatura o Historia',s:{comunicador:2,creativo:1}},{t:'Biología, Ciencias Naturales o Química',s:{cientifico:3,naturalista:1}},{t:'Educación Física o Artes Plásticas',s:{naturalista:2,creativo:2}}]},
  { q:'¿En qué tipo de empresa trabajarías?', emoji:'🏗️', a:[{t:'Una startup tecnológica o de innovación',s:{tecnico:2,lider:1}},{t:'Una ONG o empresa de impacto social',s:{social:3}},{t:'Una agencia creativa o empresa de medios',s:{creativo:2,comunicador:2}},{t:'Una empresa propia que yo mismo montara',s:{lider:3}}]},
  { q:'¿Qué valoras más en tu vida profesional?', emoji:'🎖️', a:[{t:'Resolver problemas complejos y aprender',s:{cientifico:2,analitico:2}},{t:'Tener libertad para ser creativo',s:{creativo:3}},{t:'Influir en decisiones y liderar',s:{lider:3}},{t:'Equilibrio vida-trabajo y estabilidad',s:{social:1,naturalista:2}}]},
  { q:'¿Qué actividad extracurricular preferirías?', emoji:'🎭', a:[{t:'Club de robótica o programación',s:{tecnico:3,analitico:1}},{t:'Grupo de teatro, música o arte',s:{creativo:3}},{t:'Voluntariado o servicio comunitario',s:{social:3}},{t:'Debate, periodismo escolar o podcast',s:{comunicador:3,lider:1}}]},
  { q:'¿Cómo aprendes mejor algo nuevo?', emoji:'🧠', a:[{t:'Practicando y tocando las cosas',s:{tecnico:3,naturalista:1}},{t:'Leyendo, investigando y tomando notas',s:{cientifico:2,analitico:2}},{t:'Escuchando a alguien que me lo explique',s:{social:1,comunicador:1}},{t:'Enseñándoselo a otra persona',s:{social:2,comunicador:2}}]},
  { q:'¿Dónde te sientes más en tu elemento?', emoji:'🌐', a:[{t:'Al aire libre, en la naturaleza o deporte',s:{naturalista:3}},{t:'En un espacio ordenado trabajando con datos',s:{analitico:3,cientifico:1}},{t:'En un escenario, cámara o micrófono',s:{comunicador:3,creativo:1}},{t:'Liderando una reunión o presentando ideas',s:{lider:3,comunicador:1}}]},
]

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

const progress = computed(() => Math.round((currentQ.value / questions.length) * 100))
const currentProfile = computed(() => topProfile.value ? profiles[topProfile.value] : null)

// ─── ACTIONS ────────────────────────────────────────────────────────────────
function startTest() {
  scores.value = Object.fromEntries(Object.keys(profiles).map(k => [k, 0]))
  currentQ.value = 0
  answerSelected.value = null
  screen.value = 'quiz'
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
}

function answer(opts, idx) {
  if (answerSelected.value !== null) return
  answerSelected.value = idx
  for (const [k, v] of Object.entries(opts)) scores.value[k] = (scores.value[k] || 0) + v
  setTimeout(() => {
    answerSelected.value = null
    if (currentQ.value < questions.length - 1) {
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

function unlockWithShare(platform) {
  if (typeof window === 'undefined') return
  const p = profiles[topProfile.value]
  const text = `Mi perfil vocacional es: ${p.name} ${p.icon}\n¿Cuál es el tuyo? Descúbrelo gratis:\nhttps://www.testvocacional.es/tests/vocacional`
  const url = 'https://testvocacional.es/tests/vocacional'
  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  } else if (platform === 'copy') {
    navigator.clipboard?.writeText(url).catch(() => {})
    copyDone.value = true
    setTimeout(() => { copyDone.value = false }, 2000)
  }
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
  return Object.entries(profiles)
    .map(([k, p]) => ({ key: k, ...p, pct: getPercent(k) }))
    .sort((a, b) => b.pct - a.pct)
}

function launchConfetti() {
  if (typeof window === 'undefined') return
  const colors = [QUIZ_COLOR, '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e']
  const opts = { particleCount: 120, spread: 80, colors, ticks: 400 }
  confetti({ ...opts, origin: { y: 0.6 } })
  setTimeout(() => confetti({ ...opts, particleCount: 60, origin: { x: 0.1, y: 0.7 } }), 250)
  setTimeout(() => confetti({ ...opts, particleCount: 60, origin: { x: 0.9, y: 0.7 } }), 400)
}

function shareWhatsApp() {
  const p = profiles[topProfile.value]
  const text = `Mi perfil vocacional es: ${p.name}\n\nDescubre el tuyo gratis en 3 minutos:\nhttps://www.testvocacional.es/tests/vocacional`
  if (typeof window !== 'undefined') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

function generateCard() {
  const p = profiles[topProfile.value]
  const pct = getPercent(topProfile.value)
  const S = 1080
  const cv = document.createElement('canvas')
  cv.width = S; cv.height = S
  const ctx = cv.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, S, S)
  grad.addColorStop(0, p.color); grad.addColorStop(1, p.color + 'aa')
  ctx.fillStyle = grad; ctx.fillRect(0, 0, S, S)
  ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(S * 0.88, S * 0.12, 220, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(S * 0.08, S * 0.9, 160, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  const cw = 740, ch = 560, cx0 = S / 2 - cw / 2, cy0 = S / 2 - ch / 2
  ctx.fillStyle = '#fff'; ctx.beginPath()
  ctx.roundRect(cx0, cy0, cw, ch, 44); ctx.fill()
  ctx.font = '110px serif'; ctx.textAlign = 'center'
  ctx.fillText(p.icon, S / 2, cy0 + 150)
  ctx.fillStyle = '#111827'; ctx.font = 'bold 52px Inter,Arial,sans-serif'
  ctx.fillText(p.name.length > 22 ? p.name.substring(0, 22) + '…' : p.name, S / 2, cy0 + 240)
  ctx.fillStyle = '#6b7280'; ctx.font = '32px Inter,Arial,sans-serif'
  ctx.fillText('Tu perfil vocacional', S / 2, cy0 + 290)
  const bw = 420, bh = 16, bx = S / 2 - 210, by = cy0 + 330
  ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.fill()
  ctx.fillStyle = p.color; ctx.beginPath(); ctx.roundRect(bx, by, bw * (pct / 100), bh, 8); ctx.fill()
  ctx.fillStyle = p.color; ctx.font = 'bold 46px Inter,Arial,sans-serif'
  ctx.fillText(`${pct}% compatibilidad`, S / 2, cy0 + 420)
  ctx.fillStyle = '#9ca3af'; ctx.font = '26px Inter,Arial,sans-serif'
  ctx.fillText('testvocacional.es', S / 2, cy0 + 468)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = 'bold 30px Inter,Arial,sans-serif'
  ctx.fillText('#TestVocacional', S / 2, S - 55)
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
  <!-- ── SHARE MODAL ─────────────────────────────────────────────────────── -->
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
          <a :href="shareCardUrl" download="mi-perfil-vocacional.png"
            class="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-white mb-3 text-sm transition-all hover:scale-105"
            :style="{ background: `linear-gradient(135deg, ${QUIZ_COLOR}, ${QUIZ_COLOR}cc)` }">
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
        <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

        <div class="relative w-full max-w-sm mx-auto px-5 animate-fade-up text-center">
          <div class="text-8xl mb-4 leading-none float-1">{{ currentProfile.icon }}</div>
          <div class="relative mb-8 select-none">
            <h2 class="font-black text-white leading-tight" style="font-size: clamp(2rem, 8vw, 3rem); filter: blur(8px);">
              {{ currentProfile.name }}
            </h2>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span class="text-4xl drop-shadow-lg">🔒</span>
            </div>
          </div>

          <div class="bg-white rounded-3xl p-7 shadow-2xl">
            <div class="text-3xl mb-2">🎉</div>
            <h3 class="font-black text-xl text-gray-900 mb-1">¡Tu perfil está listo!</h3>
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

            <p class="text-xs text-gray-400">🔥 +8.000 personas ya conocen su perfil</p>

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
  <section v-if="screen === 'intro'" class="relative overflow-hidden noise-overlay min-h-[calc(100vh-64px)] flex items-center"
    :style="{ background: `linear-gradient(145deg, ${QUIZ_COLOR} 0%, #9333ea 100%)` }">
    <div class="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>

    <div class="relative w-full max-w-2xl mx-auto px-5 py-16 text-center animate-fade-up">
      <span class="glass inline-block text-white text-xs font-black px-5 py-2.5 rounded-full mb-7 border border-white/30">
        🎓 Orientación Vocacional
      </span>
      <div class="text-8xl sm:text-9xl mb-6 leading-none float-1 select-none">🎓</div>
      <h1 class="text-white font-black leading-tight mb-5"
        style="font-size: clamp(2rem, 6vw, 3.5rem); letter-spacing: -0.01em">
        ¿Qué carrera es para ti?
      </h1>
      <p class="text-white/80 text-lg mb-10 max-w-md mx-auto leading-relaxed">
        Responde {{ questions.length }} preguntas y descubre qué perfil profesional se adapta a tu personalidad.
      </p>

      <!-- Stats -->
      <div class="glass inline-flex items-center gap-6 rounded-2xl px-8 py-4 mb-10 border border-white/30">
        <div class="text-center">
          <div class="text-2xl font-black text-white">{{ questions.length }}</div>
          <div class="text-xs text-white/60 font-bold uppercase tracking-wide">Preguntas</div>
        </div>
        <div class="w-px h-8 bg-white/25"></div>
        <div class="text-center">
          <div class="text-2xl font-black text-white">3 min</div>
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
        :style="{ color: QUIZ_COLOR }">
        Empezar el test
        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </button>

      <!-- Social proof -->
      <div class="flex items-center justify-center gap-3 mt-8">
        <div class="flex -space-x-2.5">
          <div v-for="(c, i) in ['#f59e0b','#8b5cf6','#ec4899','#06b6d4']" :key="i"
            class="w-8 h-8 rounded-full border-2 border-white/50 text-xs flex items-center justify-center font-black text-white"
            :style="{ background: c }">{{ ['A','M','J','S'][i] }}</div>
        </div>
        <p class="text-white/80 text-sm"><span class="font-black text-white">+12.000</span> ya lo han hecho</p>
      </div>

      <!-- Profile chips -->
      <div class="flex flex-wrap justify-center gap-2 mt-8">
        <span v-for="[k, p] in Object.entries(profiles)" :key="k"
          class="glass text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/25">
          {{ p.icon }} {{ p.name.split('/')[0].trim() }}
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
            <span :style="{ color: QUIZ_COLOR }">{{ progress }}%</span>
          </div>
          <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 ease-out"
              :style="{ width: progress + '%', background: `linear-gradient(90deg, ${QUIZ_COLOR}, #9333ea)` }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto px-5 py-10">
      <AdSlot slot-id="quiz-mid" class="mb-8" />
      <div class="animate-fade-up" :key="currentQ">
        <div class="text-5xl mb-6 leading-none">{{ questions[currentQ].emoji }}</div>
        <h2 class="font-black text-gray-900 leading-tight mb-8"
          style="font-size: clamp(1.5rem, 4vw, 2rem)">
          {{ questions[currentQ].q }}
        </h2>
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
              ? { borderColor: QUIZ_COLOR, background: QUIZ_COLOR }
              : { '--accent': QUIZ_COLOR }">
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
          :style="{ background: QUIZ_COLOR }"></div>
        <div class="absolute inset-2 rounded-full opacity-15 animate-ping"
          :style="{ background: QUIZ_COLOR, animationDelay: '0.3s' }"></div>
        <div class="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl text-5xl float-1"
          :style="{ background: `linear-gradient(135deg, ${QUIZ_COLOR}, #9333ea)` }">
          🎓
        </div>
      </div>
      <h2 class="font-black text-gray-900 mb-3" style="font-size: 1.75rem">
        Analizando tu perfil...
      </h2>
      <p class="text-gray-400 text-sm mb-6">Un momento, estamos calculando tu vocación ideal</p>
      <div class="flex justify-center gap-2">
        <div class="w-3 h-3 rounded-full animate-bounce" :style="{ background: QUIZ_COLOR }" style="animation-delay:0s"></div>
        <div class="w-3 h-3 rounded-full animate-bounce" :style="{ background: QUIZ_COLOR }" style="animation-delay:0.2s"></div>
        <div class="w-3 h-3 rounded-full animate-bounce" :style="{ background: QUIZ_COLOR }" style="animation-delay:0.4s"></div>
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
          Tu perfil vocacional
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
            <span class="text-sm font-bold text-gray-600 w-36 truncate shrink-0">{{ p.name.split('/')[0].trim() }}</span>
            <div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700"
                :style="{ width: p.pct + '%', background: `linear-gradient(90deg, ${p.color}, ${p.color}cc)` }"></div>
            </div>
            <span class="text-sm font-black w-10 text-right shrink-0" :style="{ color: p.color }">{{ p.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- Careers -->
      <div class="rounded-3xl border border-gray-100 p-7 bg-white shadow-sm animate-fade-up">
        <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">🎓 Carreras recomendadas</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="career in currentProfile.careers" :key="career"
            class="px-3.5 py-2 rounded-xl text-sm font-bold"
            :style="{ color: currentProfile.color, background: currentProfile.bg }">
            {{ career }}
          </span>
        </div>
      </div>

      <!-- Famous -->
      <div class="rounded-3xl border border-gray-100 p-7 bg-white shadow-sm animate-fade-up">
        <p class="text-xs font-black uppercase tracking-widest text-gray-400 mb-5">⭐ Personas famosas con tu perfil</p>
        <div class="flex flex-wrap gap-2.5">
          <span v-for="f in currentProfile.famous" :key="f"
            class="px-4 py-2.5 rounded-2xl text-sm font-bold border-2"
            :style="{ color: currentProfile.color, background: currentProfile.bg, borderColor: currentProfile.color + '33' }">
            {{ f }}
          </span>
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
