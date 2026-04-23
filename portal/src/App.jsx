import { useState, useEffect, useRef } from 'react'

// ─── Data ──────────────────────────────────────────────
const MODELS = [
  { id: 'gemma', name: 'Gemma 4', color: '#f472b6', tag: '26B' },
  { id: 'glm', name: 'GLM-4.7 Flash', color: '#a78bfa', tag: '30B' },
  { id: 'qwen', name: 'Qwen 3.5', color: '#60a5fa', tag: '35B' },
  { id: 'qwen27', name: 'Qwen3.6 27B', color: '#f87171', tag: '27B' },
]

const SECTIONS = [
  { id: 'noskill', label: 'No Skill', subtitle: 'Raw model output' },
  { id: 'frontend', label: 'Frontend Skill', subtitle: 'With design guidance' },
]

const PROMPT = `I want you to design the landing page for a note-taking application as essentially a second brain. You should design five iterations and each of them should be accessible within the slash one, slash two, slash three like pages directory. And then you should add a little button that lets me switch between them easily.`

function buildPages() {
  const pages = {}

  // ─── No Skill ────────────────────────────────────
  // All links are now relative and work natively
  pages['gemma-noskill'] = [
    { id: 'one', title: 'Minimalist', path: '/g/pages/one.html' },
    { id: 'two', title: 'Modern Tech', path: '/g/pages/two.html' },
    { id: 'three', title: 'Cyberpunk', path: '/g/pages/three.html' },
    { id: 'four', title: 'Elegant', path: '/g/pages/four.html' },
    { id: 'five', title: 'Playful', path: '/g/pages/five.html' },
  ]

  pages['glm-noskill'] = [
    { id: 'one', title: 'Design 1', path: '/l/slash-one/index.html' },
    { id: 'two', title: 'Design 2', path: '/l/slash-two/index.html' },
    { id: 'three', title: 'Design 3', path: '/l/slash-three/index.html' },
    { id: 'four', title: 'Design 4', path: '/l/slash-four/index.html' },
    { id: 'five', title: 'Design 5', path: '/l/slash-five/index.html' },
  ]

  pages['qwen-noskill'] = [
    { id: 'one', title: 'Clean Blue', path: '/q/pages/one/index.html' },
    { id: 'two', title: 'MindFlow', path: '/q/pages/two/index.html' },
    { id: 'three', title: 'Cognito', path: '/q/pages/three/index.html' },
    { id: 'four', title: 'Dark Neon', path: '/q/pages/four/index.html' },
    { id: 'five', title: 'Warm Minimal', path: '/q/pages/five/index.html' },
  ]

  pages['qwen27-noskill'] = [
    { id: 'one', title: 'Minimal Zen', path: '/q27/index.html#1' },
    { id: 'two', title: 'Dark Dev', path: '/q27/index.html#2' },
    { id: 'three', title: 'Gradient SaaS', path: '/q27/index.html#3' },
    { id: 'four', title: 'Bento Grid', path: '/q27/index.html#4' },
    { id: 'five', title: 'Brutalist', path: '/q27/index.html#5' },
  ]

  // ─── Frontend Skill ──────────────────────────────
  pages['gemma-frontend'] = [
    { id: 'one', title: 'Brutalist', path: '/gf/pages/one.html' },
    { id: 'two', title: 'Zen', path: '/gf/pages/two.html' },
    { id: 'three', title: 'Retro CRT', path: '/gf/pages/three.html' },
    { id: 'four', title: 'Noir', path: '/gf/pages/four.html' },
    { id: 'five', title: 'Ethereal', path: '/gf/pages/five.html' },
  ]

  pages['glm-frontend'] = [
    { id: 'one', title: 'I — Editorial', path: '/lf/slash-one/index.html' },
    { id: 'two', title: 'II — Terminal', path: '/lf/slash-two/index.html' },
    { id: 'three', title: 'III — Swiss', path: '/lf/slash-three/index.html' },
    { id: 'four', title: 'IV — Split', path: '/lf/slash-four/index.html' },
    { id: 'five', title: 'V — Cosmic', path: '/lf/slash-five/index.html' },
  ]

  pages['qwen-frontend'] = [
    { id: 'one', title: 'Brutalist', path: '/qf/pages/one.html' },
    { id: 'two', title: 'Cyber-Zen', path: '/qf/pages/two.html' },
    { id: 'three', title: 'Editorial', path: '/qf/pages/three.html' },
    { id: 'four', title: 'Retro-Fi', path: '/qf/pages/four.html' },
    { id: 'five', title: 'Organic', path: '/qf/pages/five.html' },
  ]

  pages['qwen27-frontend'] = [
    { id: 'one', title: 'Neural Organic', path: '/qf27/index.html#/1' },
    { id: 'two', title: 'Swiss Brutalist', path: '/qf27/index.html#/2' },
    { id: 'three', title: 'Terminal Retro', path: '/qf27/index.html#/3' },
    { id: 'four', title: 'Warm Journal', path: '/qf27/index.html#/4' },
    { id: 'five', title: 'Luxury Minimal', path: '/qf27/index.html#/5' },
  ]

  return pages
}

const PAGES = buildPages()

// ─── Keyboard nav ─────────────────────────────────────
function useKeyboardNav(pages, currentPage, setCurrentPage) {
  useEffect(() => {
    function onKey(e) {
      if (!pages?.length || !currentPage) return
      const idx = pages.findIndex(p => p.id === currentPage.id)
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setCurrentPage(pages[(idx + 1) % pages.length])
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setCurrentPage(pages[(idx - 1 + pages.length) % pages.length])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pages, currentPage, setCurrentPage])
}

// ─── Components ────────────────────────────────────────
function ModelBadge({ model, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer w-full"
      style={{
        background: active ? `${model.color}12` : 'transparent',
        border: `1px solid ${active ? `${model.color}40` : 'var(--color-border)'}`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
        style={{
          background: active ? model.color : 'var(--color-dim)',
          boxShadow: active ? `0 0 8px ${model.color}60` : 'none',
        }}
      />
      <span
        className="text-sm font-medium transition-colors duration-200"
        style={{ color: active ? model.color : 'var(--color-muted)' }}
      >
        {model.name}
      </span>
      <span
        className="text-[10px] font-mono ml-auto px-1.5 py-0.5 rounded transition-colors duration-200"
        style={{
          background: active ? `${model.color}15` : 'var(--color-surface-2)',
          color: active ? `${model.color}cc` : 'var(--color-dim)',
        }}
      >
        {model.tag}
      </span>
    </button>
  )
}

function PageNav({ pages, currentPage, setCurrentPage, modelColor }) {
  return (
    <div className="flex flex-col gap-1">
      {pages.map((page, i) => {
        const isActive = currentPage?.id === page.id
        return (
          <button
            key={page.id}
            onClick={() => setCurrentPage(page)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-mono text-left transition-all duration-150 cursor-pointer"
            style={{
              background: isActive ? `${modelColor}14` : 'transparent',
              color: isActive ? modelColor : 'var(--color-dim)',
              borderLeft: isActive ? `2px solid ${modelColor}` : '2px solid transparent',
            }}
          >
            <span className="w-5 text-right opacity-40">{String(i + 1).padStart(2, '0')}</span>
            <span style={{ opacity: isActive ? 1 : 0.7 }}>{page.title}</span>
          </button>
        )
      })}
    </div>
  )
}

function Viewer({ page, modelColor }) {
  const iframeRef = useRef(null)

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm font-mono" style={{ color: 'var(--color-dim)' }}>Select a page</span>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-b shrink-0"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div
          className="flex-1 text-[11px] font-mono px-3 py-1 rounded-md truncate"
          style={{ background: 'var(--color-void)', color: 'var(--color-dim)' }}
        >
          localhost:43234{page.path}
        </div>
        <a
          href={page.path}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] font-mono px-2 py-1 rounded transition-colors no-underline"
          style={{ color: 'var(--color-dim)' }}
        >
          ↗ open
        </a>
      </div>

      {/* iframe */}
      <iframe
        key={page.path}
        ref={iframeRef}
        src={page.path}
        className="w-full flex-1 border-0"
        style={{ background: '#fff' }}
        title={page.title}
      />
    </div>
  )
}

// ─── Main App ──────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState('noskill')
  const [model, setModel] = useState('gemma')
  const [currentPage, setCurrentPage] = useState(null)

  const key = `${model}-${section}`
  const pages = PAGES[key] || []
  const currentModel = MODELS.find(m => m.id === model)
  const modelColor = currentModel?.color || '#fff'

  // Auto-select first page
  useEffect(() => {
    const p = PAGES[`${model}-${section}`]
    if (p?.length) setCurrentPage(p[0])
  }, [model, section])

  useKeyboardNav(pages, currentPage, setCurrentPage)

  const currentSection = SECTIONS.find(s => s.id === section)

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--color-void)' }}>
      {/* ─── Header ───────────────────────────────── */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b shrink-0"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-4">
          <h1
            className="text-xl tracking-wide"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-fg)', fontStyle: 'italic' }}
          >
            The Lab
          </h1>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded"
            style={{ color: 'var(--color-accent)', background: 'var(--color-accent-dim)' }}
          >
            small model showcase
          </span>
          {/* Prompt tooltip */}
          <div className="group relative">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded cursor-help"
              style={{ color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
            >
              prompt ✦
            </span>
            <div
              className="absolute top-full left-0 mt-2 p-4 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 w-[460px]"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--color-accent)' }}>
                Prompt given to all models
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {PROMPT}
              </p>
            </div>
          </div>
        </div>

        {/* Section toggle */}
        <div className="flex rounded-lg p-0.5" style={{ background: 'var(--color-surface-2)' }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className="px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: section === s.id ? 'var(--color-void)' : 'transparent',
                color: section === s.id ? 'var(--color-fg)' : 'var(--color-dim)',
                boxShadow: section === s.id ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono" style={{ color: 'var(--color-dim)' }}>
          ← → navigate
        </div>
      </header>

      {/* ─── Body ─────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">
        {/* ─── Sidebar ─────────────────────────── */}
        <aside
          className="w-72 shrink-0 flex flex-col border-r"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {/* Section info */}
          <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--color-dim)' }}>
              {currentSection?.subtitle}
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
              {currentSection?.label}
            </div>
          </div>

          {/* Models */}
          <div className="px-4 py-3 flex flex-col gap-1.5">
            {MODELS.map(m => (
              <ModelBadge
                key={m.id}
                model={m}
                active={model === m.id}
                onClick={() => setModel(m.id)}
              />
            ))}
          </div>

          <div className="mx-5 border-t" style={{ borderColor: 'var(--color-border)' }} />

          {/* Pages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--color-dim)' }}>
              Pages
            </div>
            <PageNav
              pages={pages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              modelColor={modelColor}
            />
          </div>

          {/* Quick compare */}
          <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] mb-2.5" style={{ color: 'var(--color-dim)' }}>
              Quick compare
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {MODELS.map(m => {
                const isActive = model === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg transition-all duration-150 cursor-pointer"
                    style={{
                      background: isActive ? `${m.color}10` : 'var(--color-surface-2)',
                      border: `1px solid ${isActive ? `${m.color}30` : 'var(--color-border)'}`,
                    }}
                  >
                    <span className="text-lg leading-none" style={{ color: m.color }}>
                      {m.id === 'gemma' ? '◆' : m.id === 'glm' ? '▲' : m.id === 'qwen' ? '●' : '■'}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: isActive ? m.color : 'var(--color-dim)' }}>
                      {m.name.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* ─── Viewer ──────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0">
          <Viewer page={currentPage} modelColor={modelColor} />
        </main>
      </div>
    </div>
  )
}
