import { Fragment } from 'react'
import { useContent } from '../../i18n/context'

interface Props {
  text: string
}

const LATIN_RUN = /([A-Za-z0-9]+(?: [A-Za-z0-9]+)*)/g

/**
 * Wraps Latin words and numbers (e.g. "ISO 9001", "Headboards") in <bdi dir="ltr"> so they keep
 * their order inside Arabic text. Plain text is returned untouched when there are none.
 */
export function Bidi({ text }: Props) {
  const { lang } = useContent()
  const parts = text.split(LATIN_RUN)
  // Only Arabic text needs isolation; English is left as is.
  if (lang !== 'ar' || parts.length === 1) return <>{text}</>
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr">
            {part}
          </bdi>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
