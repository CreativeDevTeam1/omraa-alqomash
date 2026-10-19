import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MASK = 'display:block;overflow:hidden;padding-block:0.12em;margin-block:-0.12em'

/**
 * Reveals text line by line (Latin) or word by word (Arabic) through a mask — letters are never split,
 * so Arabic joins stay intact. Plays once on entry, then restores the plain text node so the
 * paragraph reflows naturally. Returns a cleanup function.
 */
export function revealText(el: HTMLElement, wordByWord: boolean): () => void {
  const text = el.textContent ?? ''
  let played = false
  let tween: gsap.core.Tween | null = null

  const restore = () => {
    tween?.kill()
    el.textContent = text
    el.style.height = ''
  }

  const build = () => {
    // Keep the paragraph's natural height while its content is swapped for masks (no layout shift).
    el.textContent = text
    el.style.height = ''
    const natural = el.getBoundingClientRect().height
    el.style.height = `${natural}px`
    el.textContent = ''
    const words = text.split(' ')

    if (wordByWord) {
      words.forEach((word, i) => {
        const mask = document.createElement('span')
        mask.style.cssText =
          'display:inline-block;overflow:hidden;vertical-align:top;padding-block:0.2em;margin-block:-0.2em'
        const inner = document.createElement('span')
        inner.style.display = 'inline-block'
        inner.dataset.part = ''
        inner.textContent = word
        mask.appendChild(inner)
        el.appendChild(mask)
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '))
      })
    } else {
      // Measure natural lines first.
      const spans = words.map((word, i) => {
        const s = document.createElement('span')
        s.textContent = word
        el.appendChild(s)
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '))
        return s
      })
      const lines: string[][] = []
      let lastTop: number | null = null
      spans.forEach((s) => {
        const top = s.offsetTop
        if (lastTop === null || Math.abs(top - lastTop) > 2) lines.push([])
        lines[lines.length - 1].push(s.textContent ?? '')
        lastTop = top
      })
      el.textContent = ''
      lines.forEach((line) => {
        const mask = document.createElement('span')
        mask.style.cssText = MASK
        const inner = document.createElement('span')
        inner.style.display = 'block'
        inner.dataset.part = ''
        inner.textContent = line.join(' ')
        mask.appendChild(inner)
        el.appendChild(mask)
      })
    }
    gsap.set(el.querySelectorAll('[data-part]'), { yPercent: 110 })
  }

  const play = () => {
    played = true
    tween = gsap.to(el.querySelectorAll('[data-part]'), {
      yPercent: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: wordByWord ? 0.08 : 0.14,
      onComplete: restore,
    })
  }

  let trigger: ScrollTrigger | null = null
  let timer: number | undefined
  const onResize = () => {
    if (played) return
    clearTimeout(timer)
    timer = window.setTimeout(build, 200)
  }

  let cancelled = false
  document.fonts.ready.then(() => {
    if (cancelled) return
    build()
    trigger = ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: play })
    window.addEventListener('resize', onResize)
  })

  return () => {
    cancelled = true
    clearTimeout(timer)
    window.removeEventListener('resize', onResize)
    trigger?.kill()
    restore()
  }
}
