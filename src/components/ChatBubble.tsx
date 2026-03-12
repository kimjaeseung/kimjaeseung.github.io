interface ChatBubbleProps {
  message: string
  sender: 'ai' | 'user'
  isTyping?: boolean
  timestamp?: string
}

/**
 * 채팅 메시지 버블. AI(왼쪽) / User(오른쪽), 타이핑 인디케이터 지원.
 */
export default function ChatBubble({ message, sender, isTyping, timestamp }: ChatBubbleProps) {
  const isAi = sender === 'ai'

  return (
    <div
      className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-slide-up`}
      style={{ animationDuration: '300ms' }}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isAi
            ? 'bg-warm text-espresso border border-sand/50 rounded-tl-sm'
            : 'bg-espresso text-cream rounded-tr-sm'
        }`}
      >
        {isAi && (
          <span className="inline-block mr-2 text-lg opacity-80" aria-hidden>
            📖
          </span>
        )}
        {isTyping ? (
          <span className="inline-flex gap-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        ) : (
          <p className="font-body text-[15px] leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
        {timestamp && (
          <p className={`text-xs mt-1 ${isAi ? 'text-sand' : 'text-cream/80'}`}>{timestamp}</p>
        )}
      </div>
    </div>
  )
}
