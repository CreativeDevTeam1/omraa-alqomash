import type {LayoutProps} from 'sanity'

/** The brand logo in the Studio navbar (static/omraa-logo.svg). */
export function Logo() {
  return (
    <img
      src="/static/omraa-logo.svg"
      alt="OMRAA AL QOMASH أمراء القماش"
      style={{height: 28, width: 'auto', display: 'block'}}
    />
  )
}

export type {LayoutProps}
