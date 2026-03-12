import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import { questions } from '../data/questions'
import { useLocalStorage } from '../hooks/useLocalStorage'

const STORAGE_KEY = 'echo-chapter-1'
const CHAPTERS_KEY = 'echo-chapters'
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
interface ChatEntry {
  questionId: number
  question: string
  answer: string
  followUp: string
  answeredAt: string
}

const TYPING_MS = 30
const DELAY_AFTER_ANSWER = 1000
const TYPING_INDICATOR_MS = 800
const DELAY_BEFORE_NEXT = 1000

export default function Interview() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<{ type: 'ai' | 'user'; text: string; isTyping?: boolean }[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [input, setInput] = useState('')
  const [saved, setSaved] = useLocalStorage<ChatEntry[]>(STORAGE_KEY, [])
  const [showTyping, setShowTyping] = useState(false)
  const [heroDone, setHeroDone] = useState(false)
  const [chapters, setChapters] = useLocalStorage(CHAPTERS_KEY, DEFAULT_CHAPTERS)
  const bottomRef = useRef<HTMLDivElement>(null)

  const total = questions.length
  const currentQ = questions[currentIndex]
  const isComplete = currentIndex >= total && messages.length > 0

  useEffect(() => {
    if (saved.length > 0 && chapters[0]) {
      const next = [...chapters]
      next[0] = {
        ...next[0],
        status: isComplete ? 'completed' : 'in-progress',
        updatedAt: new Date().toISOString(),
      }
      setChapters(next)
    }
  }, [isComplete, saved.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showTyping])

  // 첫 질문 타이핑
  useEffect(() => {
    if (currentIndex > 0 || heroDone) return
    const q = questions[0]
    if (!q) return
    let i = 0
    const full = q.question
    const id = setInterval(() => {
      i += 1
      setMessages((prev) => {
        const next = [...prev]
        if (next.length === 0) next.push({ type: 'ai', text: full.slice(0, i) })
        else next[next.length - 1] = { ...next[next.length - 1], text: full.slice(0, i) }
        return next
      })
      if (i >= full.length) {
        clearInterval(id)
        setHeroDone(true)
      }
    }, TYPING_MS)
    return () => clearInterval(id)
  }, [currentIndex, heroDone])

  const sendAnswer = () => {
    const text = input.trim()
    if (!text || !currentQ) return

    setInput('')
    setMessages((prev) => [...prev, { type: 'user', text }])

    const followUpText = currentQ.followUp(text)
    const entry: ChatEntry = {
      questionId: currentQ.id,
      question: currentQ.question,
      answer: text,
      followUp: followUpText,
      answeredAt: new Date().toISOString(),
    }
    setSaved([...saved, entry])

    setShowTyping(true)
    setTimeout(() => {
      setShowTyping(false)
      setMessages((prev) => [...prev, { type: 'ai', text: followUpText }])
      setTimeout(() => {
        const nextIdx = currentIndex + 1
        setCurrentIndex(nextIdx)
        if (nextIdx < total) {
          setMessages((prev) => [...prev, { type: 'ai', text: questions[nextIdx].question }])
        }
      }, DELAY_BEFORE_NEXT)
    }, TYPING_INDICATOR_MS + DELAY_AFTER_ANSWER)
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="text-espresso font-ui text-sm hover:text-gold transition-colors"
          aria-label="돌아가기"
        >
          ← 돌아가기
        </Link>
        <h1 className="font-heading font-semibold text-charcoal">챕터 1: 어린 시절</h1>
      </div>

      <div className="space-y-4 min-h-[400px] pb-4">
        {messages.map((m, i) => (
          <ChatBubble
            key={i}
            message={m.text}
            sender={m.type}
            isTyping={m.isTyping}
          />
        ))}
        {showTyping && (
          <ChatBubble message="" sender="ai" isTyping />
        )}
        <div ref={bottomRef} />
      </div>

      {isComplete ? (
        <div className="text-center py-8 animate-fade-in">
          <p className="font-heading text-xl text-charcoal mb-4">🎉 첫 번째 챕터가 완성되었습니다!</p>
          <button
            type="button"
            onClick={() => navigate('/preview')}
            className="px-6 py-3 bg-espresso text-cream font-ui font-semibold rounded-xl hover:ring-2 hover:ring-gold/50 transition-all"
            aria-label="미리보기로 이동"
          >
            미리보기 보기
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
              placeholder="답변을 입력하세요"
              className="flex-1 rounded-xl border border-sand bg-warm px-4 py-3 font-body text-charcoal placeholder-sand focus:outline-none focus:ring-2 focus:ring-gold/50"
              aria-label="답변 입력"
            />
            <button
              type="button"
              onClick={sendAnswer}
              disabled={!input.trim() || !currentQ}
              className="px-5 py-3 bg-espresso text-cream font-ui font-semibold rounded-xl disabled:opacity-50 hover:shadow-md transition-all"
              aria-label="전송"
            >
              전송
            </button>
          </div>
          <div className="mt-3 flex justify-between text-sm text-sand font-ui">
            <span>진행</span>
            <span>
              ████{currentIndex < total ? '░░░░' : '████'} {Math.min(currentIndex + 1, total)}/{total}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
