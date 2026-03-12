interface QuestionCardProps {
  title: string
  status: 'not-started' | 'in-progress' | 'completed'
  onClick?: () => void
  asButton?: boolean
}

/**
 * 홈 대시보드용 챕터/질문 카드. Link로 감쌀 때는 asButton=false.
 */
export default function QuestionCard({ title, status, onClick, asButton = false }: QuestionCardProps) {
  const statusLabel = status === 'completed' ? '완료 ✓' : status === 'in-progress' ? '진행중' : '시작하기'
  const statusColor = status === 'completed' ? 'text-sage' : status === 'in-progress' ? 'text-gold' : 'text-sand'

  const className = "w-full text-left rounded-xl border border-sand bg-warm p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-gold/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50"

  if (asButton) {
    return (
      <button type="button" onClick={onClick} className={className} aria-label={`${title} - ${statusLabel}`}>
        <p className="font-heading font-semibold text-charcoal truncate">{title}</p>
        <p className={`text-sm font-ui mt-1 ${statusColor}`}>{statusLabel}</p>
      </button>
    )
  }

  return (
    <div className={className}>
      <p className="font-heading font-semibold text-charcoal truncate">{title}</p>
      <p className={`text-sm font-ui mt-1 ${statusColor}`}>{statusLabel}</p>
    </div>
  )
}
