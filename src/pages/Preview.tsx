import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { refineText } from '../utils/textRefiner'

const STORAGE_KEY = 'echo-chapter-1'
interface ChatEntry {
  questionId: number
  question: string
  answer: string
  followUp: string
  answeredAt: string
}

export default function Preview() {
  const [saved] = useLocalStorage<ChatEntry[]>(STORAGE_KEY, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link to="/" className="text-espresso font-ui text-sm hover:text-gold transition-colors" aria-label="돌아가기">
          ← 돌아가기
        </Link>
        <h1 className="font-heading font-semibold text-charcoal">자서전 미리보기</h1>
      </div>

      {saved.length === 0 ? (
        <p className="text-sand py-12 text-center">아직 답변이 없습니다. 인터뷰에서 이야기를 채워 보세요.</p>
      ) : (
        <div className="space-y-8">
          {saved.map((entry, i) => (
            <div
              key={entry.answeredAt + i}
              className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-start animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="rounded-xl border border-sand bg-warm p-4">
                <p className="text-xs text-sand font-ui mb-2">나의 답변</p>
                <p className="font-body text-charcoal whitespace-pre-wrap">"{entry.answer}"</p>
              </div>
              <div className="hidden md:flex items-center justify-center text-gold text-2xl" aria-hidden>
                →
              </div>
              <div className="rounded-xl border border-sand bg-warm p-4">
                <p className="text-xs text-sand font-ui mb-2">자서전 문체</p>
                <p className="font-body text-charcoal italic whitespace-pre-wrap">
                  {refineText(entry.answer, entry.question)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-4 print:hidden">
        <Link
          to="/photo-demo"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-sand bg-warm text-charcoal font-ui hover:border-gold transition-colors"
          aria-label="사진 추가 페이지로 이동"
        >
          📷 사진 추가하기
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-espresso text-cream font-ui hover:ring-2 hover:ring-gold/50 transition-all"
          aria-label="PDF로 저장 (인쇄)"
        >
          📥 PDF로 저장
        </button>
      </div>
    </div>
  )
}
