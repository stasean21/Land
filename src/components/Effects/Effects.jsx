import { useEffect } from 'react'
import { gsap } from 'gsap'

const TRAIL = 12

export default function Effects() {
  useEffect(() => {
    // ── CURSOR TRAIL ──────────────────────────────────────────
    const dots = Array.from({ length: TRAIL }, (_, i) => {
      const el = document.createElement('div')
      const size = Math.max(3, 14 - i)
      el.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(34,197,94,${(0.75 - i * 0.055).toFixed(2)});
        pointer-events: none;
        z-index: 9999;
        top: 0; left: 0;
        transform: translate(-50%,-50%);
        will-change: transform;
      `
      document.body.appendChild(el)
      return el
    })

    let mx = -200, my = -200
    const pos = dots.map(() => ({ x: -200, y: -200 }))

    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove)

    // Каждый dot lerp-ится к предыдущему — цепочка с нарастающим лагом
    const tick = () => {
      pos[0].x += (mx - pos[0].x) * 0.45
      pos[0].y += (my - pos[0].y) * 0.45
      for (let i = 1; i < TRAIL; i++) {
        pos[i].x += (pos[i - 1].x - pos[i].x) * 0.32
        pos[i].y += (pos[i - 1].y - pos[i].y) * 0.32
      }
      dots.forEach((el, i) => gsap.set(el, { x: pos[i].x, y: pos[i].y }))
    }
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
      dots.forEach((el) => el.remove())
    }
  }, [])

  return null
}
