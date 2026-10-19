import { useContent } from '../../i18n/context'

interface Props {
  className?: string
}

/** Brand logo (public/omraa-logo.svg — vector, original identity colours). */
export function Logo({ className }: Props) {
  const c = useContent()
  return (
    <img
      className={className}
      src="/omraa-logo.svg"
      width={556}
      height={280}
      alt={c.brand.name}
      decoding="async"
    />
  )
}
