import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import QuestionCard from '../components/QuestionCard'

const CHAPTERS_KEY = 'echo-chapters'
const HERO_FULL = '당신의 이야기는\n한 권의 책이 될 가치가 있습니다'
const HERO_TYPING_MS = 30
type ChapterStatus = 'not-started' | 'in-progress' | 'completed'
interface ChapterItem {
  id: string
  title: string
  status: ChapterStatus
  createdAt: string
  updatedAt: string
}
const DEFAULT_CHAPTERS: ChapterItem[] = [
  { id: '1', title: '챕터 1: 어린 시절', status: 'not-started', createdAt: '', updatedAt: '' },
]

export default function Home() {
  const [chapters, setChapters] = useLocalStorage(CHAPTERS_KEY, DEFAULT_CHAPTERS)
  const [heroText, setHeroText] = useState('')

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setHeroText(HERO_FULL.slice(0, i + 1))
      i += 1
      if (i >= HERO_FULL.length) clearInterval(id)
    }, HERO_TYPING_MS)
    return () => clearInterval(id)
  }, [])

  const handleAddChapter = () => {
    const id = String(Date.now())
    const newChapter = {
      id,
      title: `챕터 ${chapters.length + 1}`,
      status: 'not-started' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setChapters([...chapters, newChapter])
  }

  const hasAnyChapter = chapters.some((c) => c.status !== 'not-started' || c.title !== `챕터 ${chapters.indexOf(c) + 1}`)

  return (
    <div className="max-w-[960px] mx-auto">
      <section className="text-center py-12 sm:py-16">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-charcoal mb-4 animate-fade-in hero-text whitespace-pre-line">
          {heroText}
        </h1>
        <Link
          to="/interview"
          className="inline-block mt-6 px-8 py-3 bg-espresso text-cream font-ui font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/20 hover:ring-2 hover:ring-gold/50 transition-all duration-200"
          aria-label="새 챕터 시작하기"
        >
          새 챕터 시작하기
        </Link>
      </section>

      <section className="mt-12 border-t border-sand/50 pt-8">
        <h2 className="font-heading font-semibold text-xl text-charcoal mb-4">작성 현황</h2>
        {!hasAnyChapter && chapters.length <= 1 ? (
          <p className="text-sand font-body py-6">아직 시작한 이야기가 없습니다. 위에서 새 챕터를 시작해 보세요.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {chapters.map((ch) => (
              <Link key={ch.id} to="/interview">
                <QuestionCard title={ch.title} status={ch.status} />
              </Link>
            ))}
            <button
              type="button"
              onClick={handleAddChapter}
              className="rounded-xl border-2 border-dashed border-sand text-sand hover:border-gold hover:text-gold p-4 font-ui transition-colors flex items-center justify-center gap-2"
              aria-label="새 챕터 추가"
            >
              <span className="text-2xl">+</span> 새 추가
            </button>
          </div>
        )}
      </section>

      <section className="mt-12 py-6 text-center text-sand text-sm font-ui">
        지금까지 127명이 자신의 이야기를 기록하고 있습니다
      </section>
    </div>
  )
}
