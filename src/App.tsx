import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DEFAULT_LANG } from './content'
import { SmoothScroll } from './components/layout/SmoothScroll'
import { LangLayout } from './i18n/LangLayout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

// About and Contact are separate chunks: Home visitors never download them up front.
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })))

export function App() {
  return (
    <>
      <SmoothScroll />
      <Suspense fallback={null}>
        <Routes>
          {/* "/" sends visitors to English. */}
          <Route path="/" element={<Navigate to={'/' + DEFAULT_LANG} replace />} />
          <Route path="/:lang" element={<LangLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
