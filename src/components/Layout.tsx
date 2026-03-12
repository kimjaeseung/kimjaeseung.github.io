import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * 공통 레이아웃: 네비게이션 + 푸터 + 페이지 전환 fade
 */
export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: '홈' },
    { to: '/interview', label: '인터뷰' },
    { to: '/preview', label: '미리보기' },
    { to: '/photo-demo', label: '사진복원' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-cream font-body">
      <header className="border-b border-sand/50 bg-cream/95 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link
            to="/"
            className="font-heading font-semibold text-charcoal text-xl hover:text-espresso transition-colors"
            aria-label="Echo Legacy Books 홈"
          >
            Echo Legacy Books
          </Link>

          {/* 데스크탑 네비 */}
          <nav className="hidden md:flex items-center gap-6 font-ui text-sm" aria-label="메인 메뉴">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`transition-colors ${
                  location.pathname === to ? 'text-espresso font-semibold' : 'text-charcoal hover:text-gold'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* 모바일 햄버거 */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-charcoal hover:bg-warm"
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            <span className="block w-6 h-0.5 bg-charcoal mb-1" />
            <span className="block w-6 h-0.5 bg-charcoal mb-1" />
            <span className="block w-6 h-0.5 bg-charcoal" />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-sand/50 bg-cream py-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block px-4 py-2 font-ui text-charcoal hover:bg-warm"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 page-enter max-w-[960px] w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-sand/50 py-4 text-center text-sand text-sm font-ui">
        © 2025 Echo Legacy Books · 당신의 이야기는 영원합니다
      </footer>
    </div>
  )
}
