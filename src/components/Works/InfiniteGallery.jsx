import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './InfiniteGallery.css'

export default function InfiniteGallery({ onClose, items = [] }) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const coordsRef = useRef(null)
  const miniDotRef = useRef(null)
  const lbRef = useRef(null)
  const lbCardRef = useRef(null)
  const lbCounterRef = useRef(null)
  const hudRef = useRef(null)
  const navHintRef = useRef(null)
  const minimapRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    // Fallback if no items or less than 16
    const validItems = items.length >= 16 ? items.slice(0, 16) : Array(16).fill({ src: '', title: 'Placeholder', badge: 'Draft' })

    // ─── CONFIG ───────────────────────────────────────────────────────────────────
    const TILE_W = 240, TILE_H = 320, GAP = 32
    const COLS = 4, ROWS = 4, REPEAT = 4
    const TOTAL_COLS = COLS * (REPEAT * 2 + 1)
    const TOTAL_ROWS = ROWS * (REPEAT * 2 + 1)
    const CELL_W = TILE_W + GAP
    const CELL_H = TILE_H + GAP
    const GRID_W = COLS * CELL_W
    const GRID_H = ROWS * CELL_H
    const UNIQUE = 16
    
    // Position the main central grid at the origin
    const centerX = window.innerWidth / 2 - (TOTAL_COLS * CELL_W) / 2
    const centerY = window.innerHeight / 2 - (TOTAL_ROWS * CELL_H) / 2

    const canvas = canvasRef.current
    const cards = []
    
    let viewX = 0, viewY = 0
    let currentScale = 1

    canvas.innerHTML = ''
    for (let row = 0; row < TOTAL_ROWS; row++) {
      for (let col = 0; col < TOTAL_COLS; col++) {
        const idx = (row % ROWS) * COLS + (col % COLS)
        const item = validItems[idx]
        const num = String(idx + 1).padStart(2, '0')
        const x = col * CELL_W, y = row * CELL_H

        const card = document.createElement('div')
        card.className = 'ig-card'
        card.style.cssText = `left:${x}px;top:${y}px;width:${TILE_W}px;height:${TILE_H}px;`
        card.dataset.idx = idx
        card.innerHTML = `
          <div class="ig-card-inner">
            <img class="ig-card-img" src="${item.src}" alt="${item.title}" loading="lazy" />
            <div class="ig-card-overlay">
              <div class="ig-card-title">${item.title}</div>
              <div class="ig-card-badge">${item.badge}</div>
            </div>
            <div class="ig-card-num-badge">${num}</div>
          </div>`
        canvas.appendChild(card)
        cards.push({ el: card, idx, col, row })
      }
    }

    function applyTransform() {
      let renderX = viewX
      let renderY = viewY
      
      // Smooth infinite wrapping logic
      if (Math.abs(currentScale - 1) < 0.001) {
         renderX = ((viewX % GRID_W) + GRID_W) % GRID_W
         renderY = ((viewY % GRID_H) + GRID_H) % GRID_H
         // Sync back so it doesn't drift boundlessly
         viewX = renderX
         viewY = renderY
      }

      const vcx = window.innerWidth / 2
      const vcy = window.innerHeight / 2
      const ox = vcx - (centerX + renderX)
      const oy = vcy - (centerY + renderY)
      
      canvas.style.transformOrigin = `${ox}px ${oy}px`
      canvas.style.transform = `translate(${centerX + renderX}px, ${centerY + renderY}px) scale(${currentScale})`

      const cx = Math.round(-renderX), cy = Math.round(-renderY)
      coordsRef.current.textContent = `${cx}, ${cy}`
      
      const mx = (((cx % GRID_W) + GRID_W) % GRID_W) / GRID_W
      const my = (((cy % GRID_H) + GRID_H) % GRID_H) / GRID_H
      miniDotRef.current.style.left = (mx * 100) + '%'
      miniDotRef.current.style.top = (my * 100) + '%'
    }
    applyTransform()

    // ─── INTERACTION STATE ────────────────────────────────────────────────────────
    let lightboxOpen = false
    let animatingLb = false
    let currentIdx = 0
    let isDragging = false, didDrag = false
    let dsx = 0, dsy = 0, dox = 0, doy = 0
    const SCALE_NORMAL = 1, SCALE_OUT = 0.82, ZOOM_DUR = 0.45

    const zoomTo = (target) => {
      gsap.to({ s: currentScale }, {
        s: target,
        duration: ZOOM_DUR,
        ease: target < SCALE_NORMAL ? 'power3.out' : 'power3.inOut',
        onUpdate: function() {
          currentScale = this.targets()[0].s
          applyTransform()
        },
        onComplete: applyTransform
      })
    }

    // ─── EVENT HANDLERS ───────────────────────────────────────────────────────────
    const handleMouseDown = (e) => {
      if (lightboxOpen || e.button !== 0) return
      isDragging = true; didDrag = false
      dsx = e.clientX; dsy = e.clientY; dox = viewX; doy = viewY
      wrapperRef.current.classList.add('dragging')
      zoomTo(SCALE_OUT)
    }
    const handleMouseMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - dsx, dy = e.clientY - dsy
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true
      viewX = dox + dx; viewY = doy + dy
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
      viewX -= e.deltaX; viewY -= e.deltaY
      applyTransform()
    }

    let touch0 = null
    const handleTouchStart = (e) => {
      if (lightboxOpen) return
      touch0 = e.touches[0]; dox = viewX; doy = viewY; didDrag = false
    }
    const handleTouchMove = (e) => {
      if (lightboxOpen) return
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - touch0.clientX, dy = t.clientY - touch0.clientY
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true
      viewX = dox + dx; viewY = doy + dy
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
        if (lightboxOpen) {
          closeLightbox()
        } else if (!animatingLb) {
          onClose() 
        }
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
      if (keys['ArrowLeft'] || keys['a']) { viewX += SPEED; m = true }
      if (keys['ArrowRight'] || keys['d']) { viewX -= SPEED; m = true }
      if (keys['ArrowUp'] || keys['w']) { viewY += SPEED; m = true }
      if (keys['ArrowDown'] || keys['s']) { viewY -= SPEED; m = true }
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
      const item = validItems[idx]
      const num = String(idx + 1).padStart(2, '0')
      lbCardRef.current.innerHTML = `
        <img src="${item.src}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />
        <div style="position:absolute;bottom:0;left:0;right:0;padding:28px 24px 36px;background:linear-gradient(to top,rgba(0,0,0,0.9),transparent);">
          <div style="color:white;font-size:18px;font-weight:600;margin-bottom:6px;">${item.title}</div>
          <div style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:0.15em;">${item.badge}</div>
        </div>
        <div style="position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);padding:6px 12px;border-radius:30px;color:white;font-size:12px;font-weight:600;">${num}</div>
      `
      lbCounterRef.current.textContent = `${idx + 1} / ${UNIQUE}`
    }

    const openLightbox = (idx) => {
      lightboxOpen = true
      animatingLb = false
      currentIdx = idx
      setCardContent(idx)
      wrapper.classList.add('lightbox-open')
      lbRef.current.classList.add('active')

      gsap.to([hudRef.current, navHintRef.current, minimapRef.current, coordsRef.current, closeBtnRef.current], { opacity: 0, duration: 0.25 })
      if (closeBtnRef.current) closeBtnRef.current.style.pointerEvents = 'none'
      gsap.fromTo(lbRef.current, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: 'power2.out' })
      gsap.fromTo(lbCardRef.current, { scale: 0.80, y: 32, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.42, ease: 'power3.out' })
    }

    const closeLightbox = () => {
      if (!lightboxOpen) return
      lightboxOpen = false
      animatingLb = true
      wrapper.classList.remove('lightbox-open')
      gsap.to(lbCardRef.current, { scale: 0.86, y: 24, opacity: 0, duration: 0.28, ease: 'power2.in' })
      gsap.to(lbRef.current, { 
        opacity: 0, duration: 0.32, ease: 'power2.in', delay: 0.05, 
        onComplete: () => {
          lbRef.current.classList.remove('active')
          animatingLb = false
          if (closeBtnRef.current) closeBtnRef.current.style.pointerEvents = ''
        }
      })
      gsap.to([hudRef.current, navHintRef.current, minimapRef.current, coordsRef.current, closeBtnRef.current], { opacity: 1, duration: 0.35, delay: 0.2 })
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

    window.closeLb = (e) => {
      if (e && e.stopPropagation) e.stopPropagation()
      closeLightbox()
    }
    window.navLb = (dir, e) => {
      if (e && e.stopPropagation) e.stopPropagation()
      navLightbox(dir)
    }
    window.canCloseGallery = () => !lightboxOpen && !animatingLb

    // ─── ENTRANCE ANIMATION ───────────────────────────────────────────────────────
    const mc = Math.floor(TOTAL_COLS / 2), mr = Math.floor(TOTAL_ROWS / 2)
    const centerCards = cards.filter(c => Math.abs(c.col - mc) < 3 && Math.abs(c.row - mr) < 3)
    gsap.from(centerCards.map(c => c.el), {
      opacity: 0, scale: 0.85,
      duration: 0.6,
      stagger: { amount: 0.6, from: 'center' },
      ease: 'power3.out',
      delay: 0.25
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
      delete window.closeLb
      delete window.navLb
      delete window.canCloseGallery
    }
  }, []) // Removed unstable dependencies to avoid accidental remounts

  return (
    <div className="infinite-gallery-modal">
      <button className="ig-close-btn" ref={closeBtnRef} onClick={(e) => {
        if (window.canCloseGallery && !window.canCloseGallery()) return;
        onClose();
      }} aria-label="Close Gallery">✕</button>

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
          <div className="ig-lb-backdrop" onClick={(e) => window.closeLb?.(e)}></div>
          <span className="ig-lb-esc" onClick={(e) => window.closeLb?.(e)} style={{cursor: 'pointer'}}>ESC — close</span>
          <button className="ig-lb-close" onClick={(e) => window.closeLb?.(e)}>✕</button>
          <button className="ig-lb-arrow ig-lb-prev" onClick={(e) => window.navLb?.(-1, e)}>‹</button>
          <div className="ig-lb-card" ref={lbCardRef}></div>
          <button className="ig-lb-arrow ig-lb-next" onClick={(e) => window.navLb?.(1, e)}>›</button>
          <div className="ig-lb-counter" ref={lbCounterRef}></div>
        </div>
      </div>
    </div>
  )
}
