import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './InfiniteGallery.css'

export default function InfiniteGallery({ onClose }) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const coordsRef = useRef(null)
  const miniDotRef = useRef(null)
  const lbRef = useRef(null)
  const lbCardRef = useRef(null)
  const lbNumRef = useRef(null)
  const lbLabelRef = useRef(null)
  const lbCounterRef = useRef(null)
  const hudRef = useRef(null)
  const navHintRef = useRef(null)
  const minimapRef = useRef(null)

  useEffect(() => {
    // ─── CONFIG ───────────────────────────────────────────────────────────────────
    const TILE_W = 220, TILE_H = 280, GAP = 24
    const COLS = 8, ROWS = 8, REPEAT = 3
    const TOTAL_COLS = COLS * (REPEAT * 2 + 1)
    const TOTAL_ROWS = ROWS * (REPEAT * 2 + 1)
    const CELL_W = TILE_W + GAP
    const CELL_H = TILE_H + GAP
    const GRID_W = COLS * CELL_W
    const GRID_H = ROWS * CELL_H
    const UNIQUE = COLS * ROWS
    const baseX = window.innerWidth / 2 - GRID_W / 2
    const baseY = window.innerHeight / 2 - GRID_H / 2

    const PALETTES = [
      { bg: '#1a1a2e', accent: '#e94560' }, { bg: '#16213e', accent: '#5db8ff' },
      { bg: '#533483', accent: '#e8d5b7' }, { bg: '#2c003e', accent: '#f9a825' },
      { bg: '#1b262c', accent: '#bbe1fa' }, { bg: '#0f0c29', accent: '#a78bfa' },
      { bg: '#3a1c71', accent: '#ffaf7b' }, { bg: '#24243e', accent: '#fc67fa' },
      { bg: '#0f2027', accent: '#78ffd6' }, { bg: '#1a0533', accent: '#c471ed' },
      { bg: '#2b1055', accent: '#7597de' }, { bg: '#0e0e0e', accent: '#f9f871' },
      { bg: '#200122', accent: '#ff6b6b' }, { bg: '#0a3d62', accent: '#f8c291' }
    ]
    const LABELS = [
      'ARCHIVE','WORK','GRID','LIST','FILTER','SORT',
      'INDEX','EXPLORE','DISCOVER','BROWSE','COLLECT',
      'CURATE','DISPLAY','SHOW','VIEW'
    ]

    const uniqPal = Array.from({ length: UNIQUE }, (_, i) => PALETTES[i % PALETTES.length])
    const uniqLabel = Array.from({ length: UNIQUE }, (_, i) => LABELS[i % LABELS.length])

    const canvas = canvasRef.current
    const cards = []
    let offsetX = 0, offsetY = 0
    let currentScale = 1

    // Build grid DOM manually for performance
    canvas.innerHTML = ''
    for (let row = 0; row < TOTAL_ROWS; row++) {
      for (let col = 0; col < TOTAL_COLS; col++) {
        const idx = (row % ROWS) * COLS + (col % COLS)
        const pal = uniqPal[idx]
        const lbl = uniqLabel[idx]
        const num = String(idx + 1).padStart(2, '0')
        const x = col * CELL_W, y = row * CELL_H

        const card = document.createElement('div')
        card.className = 'ig-card'
        card.style.cssText = `left:${x}px;top:${y}px;`
        card.dataset.idx = idx
        card.innerHTML = `
          <div class="ig-card-inner" style="background:${pal.bg};border:1px solid ${pal.accent}22;">
            <div class="ig-card-num" style="color:${pal.accent}33">${num}</div>
            <div class="ig-card-label" style="color:${pal.accent}cc">${lbl} [${num}]</div>
          </div>`
        canvas.appendChild(card)
        cards.push({ el: card, idx })
      }
    }

    function applyTransform() {
      const vcx = window.innerWidth / 2
      const vcy = window.innerHeight / 2
      const ox = vcx - (baseX + offsetX)
      const oy = vcy - (baseY + offsetY)
      canvas.style.transformOrigin = `${ox}px ${oy}px`
      canvas.style.transform = `translate(${baseX + offsetX}px, ${baseY + offsetY}px) scale(${currentScale})`

      const cx = Math.round(-offsetX), cy = Math.round(-offsetY)
      coordsRef.current.textContent = `${cx}, ${cy}`
      const mx = (((cx % GRID_W) + GRID_W) % GRID_W) / GRID_W
      const my = (((cy % GRID_H) + GRID_H) % GRID_H) / GRID_H
      miniDotRef.current.style.left = (mx * 100) + '%'
      miniDotRef.current.style.top = (my * 100) + '%'
    }
    applyTransform()

    // ─── INTERACTION STATE ────────────────────────────────────────────────────────
    let lightboxOpen = false
    let currentIdx = 0
    let isDragging = false, didDrag = false
    let dsx = 0, dsy = 0, dox = 0, doy = 0
    const SCALE_NORMAL = 1, SCALE_OUT = 0.80, ZOOM_DUR = 0.45

    const zoomTo = (target) => {
      gsap.to({ s: currentScale }, {
        s: target,
        duration: ZOOM_DUR,
        ease: target < SCALE_NORMAL ? 'power3.out' : 'power3.inOut',
        onUpdate: function() {
          currentScale = this.targets()[0].s
          applyTransform()
        }
      })
    }

    // ─── EVENT HANDLERS ───────────────────────────────────────────────────────────
    const handleMouseDown = (e) => {
      if (lightboxOpen || e.button !== 0) return
      isDragging = true; didDrag = false
      dsx = e.clientX; dsy = e.clientY; dox = offsetX; doy = offsetY
      wrapperRef.current.classList.add('dragging')
      zoomTo(SCALE_OUT)
    }
    const handleMouseMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - dsx, dy = e.clientY - dsy
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true
      offsetX = dox + dx; offsetY = doy + dy
      applyTransform()
    }
    const handleMouseUp = () => {
      isDragging = false
      wrapperRef.current.classList.remove('dragging')
      zoomTo(SCALE_NORMAL)
    }
    const handleMouseLeave = () => {
      if (currentScale !== SCALE_NORMAL) zoomTo(SCALE_NORMAL)
    }
    const handleWheel = (e) => {
      if (lightboxOpen) return
      e.preventDefault()
      offsetX -= e.deltaX; offsetY -= e.deltaY
      applyTransform()
    }

    let touch0 = null
    const handleTouchStart = (e) => {
      if (lightboxOpen) return
      touch0 = e.touches[0]; dox = offsetX; doy = offsetY; didDrag = false
    }
    const handleTouchMove = (e) => {
      if (lightboxOpen) return
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - touch0.clientX, dy = t.clientY - touch0.clientY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true
      offsetX = dox + dx; offsetY = doy + dy
      applyTransform()
    }

    const wrapper = wrapperRef.current
    wrapper.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    wrapper.addEventListener('mouseleave', handleMouseLeave)
    wrapper.addEventListener('wheel', handleWheel, { passive: false })
    wrapper.addEventListener('touchstart', handleTouchStart)
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false })

    // ─── KEYBOARD & TICKER ────────────────────────────────────────────────────────
    const SPEED = 40; const keys = {}
    const handleKeyDown = (e) => {
      keys[e.key] = true
      if (e.key === 'Escape') {
        if (lightboxOpen) closeLightbox()
        else onClose() // Closes the entire full-screen gallery
      }
      if (lightboxOpen && e.key === 'ArrowRight') navLightbox(1)
      if (lightboxOpen && e.key === 'ArrowLeft') navLightbox(-1)
    }
    const handleKeyUp = (e) => { keys[e.key] = false }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const ticker = () => {
      if (lightboxOpen || isDragging) return
      let m = false
      if (keys['ArrowLeft'] || keys['a']) { offsetX += SPEED; m = true }
      if (keys['ArrowRight'] || keys['d']) { offsetX -= SPEED; m = true }
      if (keys['ArrowUp'] || keys['w']) { offsetY += SPEED; m = true }
      if (keys['ArrowDown'] || keys['s']) { offsetY -= SPEED; m = true }
      if (m) applyTransform()
    }
    gsap.ticker.add(ticker)

    // ─── LIGHTBOX LOGIC ───────────────────────────────────────────────────────────
    canvas.addEventListener('click', (e) => {
      if (didDrag) return
      const cardEl = e.target.closest('.ig-card')
      if (!cardEl) return
      openLightbox(parseInt(cardEl.dataset.idx))
    })

    const setCardContent = (idx) => {
      const pal = uniqPal[idx]
      const lbl = uniqLabel[idx]
      const num = String(idx + 1).padStart(2, '0')
      lbCardRef.current.style.background = pal.bg
      lbCardRef.current.style.border = `1px solid ${pal.accent}33`
      lbCardRef.current.style.boxShadow = `0 40px 120px ${pal.accent}18, 0 0 0 1px ${pal.accent}10`
      lbNumRef.current.textContent = num
      lbNumRef.current.style.color = pal.accent
      lbLabelRef.current.textContent = `${lbl} [${num}]`
      lbLabelRef.current.style.color = pal.accent
      lbCounterRef.current.textContent = `${idx + 1} / ${UNIQUE}`
    }

    const openLightbox = (idx) => {
      lightboxOpen = true
      currentIdx = idx
      setCardContent(idx)
      wrapper.classList.add('lightbox-open')
      lbRef.current.classList.add('active')

      gsap.to([hudRef.current, navHintRef.current, minimapRef.current, coordsRef.current], { opacity: 0, duration: 0.25 })
      gsap.fromTo(lbRef.current, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: 'power2.out' })
      gsap.fromTo(lbCardRef.current, { scale: 0.80, y: 32, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.42, ease: 'power3.out' })
    }

    const closeLightbox = () => {
      if (!lightboxOpen) return
      lightboxOpen = false
      wrapper.classList.remove('lightbox-open')
      gsap.to(lbCardRef.current, { scale: 0.86, y: 24, opacity: 0, duration: 0.28, ease: 'power2.in' })
      gsap.to(lbRef.current, { opacity: 0, duration: 0.32, ease: 'power2.in', delay: 0.05, onComplete: () => lbRef.current.classList.remove('active') })
      gsap.to([hudRef.current, navHintRef.current, minimapRef.current, coordsRef.current], { opacity: 1, duration: 0.35, delay: 0.2 })
    }

    const navLightbox = (dir) => {
      currentIdx = ((currentIdx + dir) % UNIQUE + UNIQUE) % UNIQUE
      gsap.to(lbCardRef.current, {
        x: -dir * 70, opacity: 0, duration: 0.16, ease: 'power2.in',
        onComplete: () => {
          setCardContent(currentIdx)
          gsap.fromTo(lbCardRef.current, { x: dir * 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.22, ease: 'power2.out' })
        }
      })
    }

    window.closeLb = closeLightbox
    window.navLb = navLightbox

    // ─── ENTRANCE ANIMATION ───────────────────────────────────────────────────────
    const centerCards = cards.filter((_, i) => {
      const col = i % TOTAL_COLS, row = Math.floor(i / TOTAL_COLS)
      const mc = Math.floor(TOTAL_COLS / 2), mr = Math.floor(TOTAL_ROWS / 2)
      return Math.abs(col - mc) < 4 && Math.abs(row - mr) < 3
    })
    gsap.from(centerCards.map(c => c.el), {
      opacity: 0, scale: 0.85,
      duration: 0.6,
      stagger: { amount: 0.8, from: 'center' },
      ease: 'power3.out',
      delay: 0.3 // Delay to wait for generic modal fadein
    })

    return () => {
      wrapper.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
      wrapper.removeEventListener('wheel', handleWheel)
      wrapper.removeEventListener('touchstart', handleTouchStart)
      wrapper.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      gsap.ticker.remove(ticker)
    }
  }, [onClose])

  return (
    <div className="infinite-gallery-modal">
      {/* Global Close Button for the whole modal */}
      <button className="ig-close-btn" onClick={onClose} aria-label="Close Gallery">✕</button>

      <div className="infinite-gallery-wrapper" ref={wrapperRef}>
        <div className="ig-hud" ref={hudRef}>
          <span className="ig-hud-label">Hold click — zoom out · Drag — pan · Click card — open</span>
        </div>
        <div className="ig-coords" ref={coordsRef}>0, 0</div>
        <div className="ig-nav-hint" ref={navHintRef}>infinite canvas — drag to explore</div>
        <div className="ig-minimap" ref={minimapRef}>
          <div className="ig-minimap-center"><div className="ig-minimap-cross"></div></div>
          <div className="ig-minimap-dot" ref={miniDotRef}></div>
        </div>

        <div className="ig-canvas" ref={canvasRef}></div>

        <div className="ig-lightbox" ref={lbRef}>
          <div className="ig-lb-backdrop" onClick={() => window.closeLb()}></div>
          <span className="ig-lb-esc">ESC — close</span>
          <button className="ig-lb-close" onClick={() => window.closeLb()}>✕</button>
          <button className="ig-lb-arrow ig-lb-prev" onClick={() => window.navLb(-1)}>‹</button>
          <div className="ig-lb-card" ref={lbCardRef}>
            <div className="ig-lb-num" ref={lbNumRef}></div>
            <div className="ig-lb-label" ref={lbLabelRef}></div>
            <div className="ig-lb-sub">Press ← → to browse · ESC to return to gallery</div>
          </div>
          <button className="ig-lb-arrow ig-lb-next" onClick={() => window.navLb(1)}>›</button>
          <div className="ig-lb-counter" ref={lbCounterRef}></div>
        </div>
      </div>
    </div>
  )
}
