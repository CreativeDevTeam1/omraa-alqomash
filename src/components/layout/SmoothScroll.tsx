import { useEffect } from 'react'
import { startSmoothScroll, stopSmoothScroll } from '../../lib/smoothScroll'

/** Mounts Lenis once for the whole app. */
export function SmoothScroll() {
  useEffect(() => {
    startSmoothScroll()
    return stopSmoothScroll
  }, [])
  return null
}
