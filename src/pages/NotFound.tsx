import { PageLayout } from '../components/layout/PageLayout'
import { LocalizedLink } from '../i18n/LocalizedLink'
import { useContent } from '../i18n/context'
import styles from './NotFound.module.css'

/** 404 for both languages: the usual header and footer, a heading, and a way back to Home. */
export function NotFound() {
  const { ui, brand, lang } = useContent()
  return (
    <PageLayout>
      <section className="container" style={{ paddingBlock: 'var(--section-pad)' }}>
        <h1 className={lang === 'en' ? styles.titleEn : undefined}>{ui.notFound}</h1>
        <p style={{ marginBlockStart: 'var(--space-5)' }}>
          <LocalizedLink
            to={{ route: 'home' }}
            style={{ textDecoration: 'underline', textUnderlineOffset: '6px' }}
          >
            {brand.name}
          </LocalizedLink>
        </p>
      </section>
    </PageLayout>
  )
}
