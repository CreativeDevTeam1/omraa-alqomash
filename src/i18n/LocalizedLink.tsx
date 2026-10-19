import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import type { LinkTarget } from '../content'
import { useContent } from './context'
import { toPath } from './paths'

interface Props extends Omit<ComponentProps<typeof Link>, 'to'> {
  to: LinkTarget
}

/** Router link that keeps the user in the current language. */
export function LocalizedLink({ to, ...rest }: Props) {
  const { lang } = useContent()
  return <Link to={toPath(lang, to)} {...rest} />
}
