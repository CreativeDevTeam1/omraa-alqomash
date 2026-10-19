import type { ReactNode } from 'react'
import { useContent } from '../../i18n/context'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollManager } from './ScrollManager'

interface Props {
  /** Rendered before the header (e.g. the loading screen on Home). */
  before?: ReactNode
  children: ReactNode
}

export function PageLayout({ before, children }: Props) {
  const { ui, lang } = useContent()
  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">
        {ui.skipToContent}
      </a>
      {before}
      <Header />
      {/* Keyed by language: switching language rebuilds every section (ScrollTriggers, pins, reveals)
          from scratch, so nothing keeps the previous language's direction or measurements. */}
      <main id="main" key={lang}>
        {children}
      </main>
      <Footer />
    </>
  )
}
