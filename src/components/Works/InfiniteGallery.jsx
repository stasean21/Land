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
  const navHintRef = useRef(null)
  const minimapRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    // Fallback if no items or less than 16
    const validItems = items.length >= 16 ? items.slice(0, 16) : Array(16).fill({ src: '', title: 'Placeholder', badge: 'Draft' })

    // ─── CONFIG ───────────────────────────────────────────────────────────────────
    const TILE_W = 240, TILE_H = 320, GAP = 32
    const COLS = 4, ROWS = 4
    const isMobile = window.innerWidth <= 768
    const REPEAT = isMobile ? 1 : 2
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
            <img class="ig-card-img" src="${item.src}" alt="${item.title}" loading="lazy" decoding="async" />
            <div class="ig-card-num-badge">${num}</div>
          </div>`
        canvas.appendChild(card)
        cards.push({ el: card, idx, col, row })
      }
    }

    function applyTransform() {
      // Всегда применяем логику зацикливания, чтобы при драге (zoom out) галерея не тормозила
      const renderX = ((viewX % GRID_W) + GRID_W) % GRID_W
      const renderY = ((viewY % GRID_H) + GRID_H) % GRID_H
      
      const vcx = window.innerWidth / 2
      const vcy = window.innerHeight / 2
      const ox = vcx - (centerX + renderX)
      const oy = vcy - (centerY + renderY)
      
      canvas.style.transformOrigin = `${ox}px ${oy}px`
      canvas.style.transform = `translate(${centerX + renderX}px, ${centerY + renderY}px) scale(${currentScale})`

      const cx = Math.round(-renderX), cy = Math.round(-renderY)
      if (coordsRef.current) coordsRef.current.textContent = `${cx}, ${cy}`
      
      if (miniDotRef.current) {
        const mx = (((cx % GRID_W) + GRID_W) % GRID_W) / GRID_W
        const my = (((cy % GRID_H) + GRID_H) % GRID_H) / GRID_H
        miniDotRef.current.style.left = (mx * 100) + '%'
        miniDotRef.current.style.top = (my * 100) + '%'
      }
    }
    applyTransform()

    // ─── INTERACTION STATE ────────────────────────────────────────────────────────
    let lightboxOpen = false
    let animatingLb = false
    let currentIdx = 0
    let isDragging = false, didDrag = false
    let isZoomedOut = false
    let dsx = 0, dsy = 0, dox = 0, doy = 0
    let zoomTimeout = null
    const SCALE_NORMAL = 1, SCALE_OUT = 0.82, ZOOM_DUR = 0.45

    const zoomTo = (target) => {
      isZoomedOut = target < 1
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

    const startZoomTimer = () => {
      if (zoomTimeout) clearTimeout(zoomTimeout)
      zoomTimeout = setTimeout(() => {
        if (isDragging && !isZoomedOut) zoomTo(SCALE_OUT)
      }, 250) // Задержка 250мс для определения "удержания"
    }

    // ─── EVENT HANDLERS ───────────────────────────────────────────────────────────
    const handleMouseDown = (e) => {
      if (lightboxOpen || e.button !== 0) return
      isDragging = true; didDrag = false
      dsx = e.clientX; dsy = e.clientY; dox = viewX; doy = viewY
      wrapperRef.current.classList.add('dragging')
      startZoomTimer()
    }
    const handleMouseMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - dsx, dy = e.clientY - dsy
      
      // Если начали двигать — это уже не просто клик, включаем зум сразу
      if (!didDrag && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        didDrag = true
        if (zoomTimeout) clearTimeout(zoomTimeout)
        if (!isZoomedOut) zoomTo(SCALE_OUT)
      }

      viewX = dox + dx; viewY = doy + dy
      applyTransform()
    }
    const handleMouseUp = () => {
      if (!isDragging) return
      isDragging = false
      if (zoomTimeout) clearTimeout(zoomTimeout)
      wrapperRef.current.classList.remove('dragging')
      if (isZoomedOut) zoomTo(SCALE_NORMAL)
    }
    const handleMouseLeave = () => {
      if (isDragging) handleMouseUp()
      else if (isZoomedOut) zoomTo(SCALE_NORMAL)
    }
    const handleWheel = (e) => {
      if (lightboxOpen) return
      e.preventDefault()
      viewX -= e.deltaX; viewY -= e.deltaY
      applyTransform()
    }

    const handleTouchStart = (e) => {
      if (lightboxOpen) return
      const t = e.touches[0]
      isDragging = true; didDrag = false
      dsx = t.clientX; dsy = t.clientY; dox = viewX; doy = viewY
      startZoomTimer()
    }
    const handleTouchMove = (e) => {
      if (!isDragging) return
      const t = e.touches[0]
      const dx = t.clientX - dsx, dy = t.clientY - dsy
      if (!didDrag && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        didDrag = true
        if (zoomTimeout) clearTimeout(zoomTimeout)
        if (!isZoomedOut) zoomTo(SCALE_OUT)
      }
      viewX = dox + dx; viewY = doy + dy
      applyTransform()
    }

    const wrapper = wrapperRef.current
    wrapper.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    wrapper.addEventListener('mouseleave', handleMouseLeave)
    wrapper.addEventListener('wheel', handleWheel, { passive: false })
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false })
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false })
    wrapper.addEventListener('touchend', handleMouseUp)

    // ─── KEYBOARD & TICKER ────────────────────────────────────────────────────────
    const SPEED = 40; const keys = {}
    const handleKeyDown = (e) => {
      keys[e.key] = true
      if (e.key === 'Escape') {
        if (lightboxOpen) closeLightbox()
        else if (!animatingLb) onClose() 
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
      if (zoomTimeout) clearTimeout(zoomTimeout)
      openLightbox(parseInt(cardEl.dataset.idx))
    })

    const setCardContent = (idx) => {
      const item = validItems[idx]
      const num = String(idx + 1).padStart(2, '0')
      lbCardRef.current.innerHTML = `
        <img src="${item.src}" alt="${item.title}" style="width:100%;height:auto;max-height:85vh;object-fit:contain;display:block;" />
        <div style="position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);padding:6px 12px;border-radius:30px;color:white;font-size:12px;font-weight:600;pointer-events:none;">${num}</div>
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

      gsap.to([navHintRef.current, minimapRef.current, coordsRef.current, closeBtnRef.current], { opacity: 0, duration: 0.25 })
      if (closeBtnRef.current) closeBtnRef.current.style.pointerEvents = 'none'
      gsap.fromTo(lbRef.current, { opacity: 0 }, { opacity: 1, duration: 0.32, ease: 'power2.out' })
      gsap.fromTo(lbCardRef.current, { scale: 0.80, y: 32, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.42, ease: 'power3.out' })
    }

    const closeLightbox = () => {
      // Кнопка закрытия не должна виснуть — игнорируем только если УЖЕ идет закрытие
      if (!lightboxOpen && animatingLb) return 
      
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
      gsap.to([navHintRef.current, minimapRef.current, coordsRef.current, closeBtnRef.current], { opacity: 1, duration: 0.35, delay: 0.2 })
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

    // Экспонируем функции для JSX
    window._closeLb = closeLightbox
    window._navLb = navLightbox
    window._canCloseGallery = () => !lightboxOpen && !animatingLb

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
      delete window._closeLb
      delete window._navLb
      delete window._canCloseGallery
    }
  }, []) // Removed unstable dependencies to avoid accidental remounts

  return (
    <div className="infinite-gallery-modal">
      <button className="ig-close-btn" ref={closeBtnRef} onClick={(e) => {
        if (window._canCloseGallery && !window._canCloseGallery()) return;
        onClose();
      }} aria-label="Close Gallery">✕</button>

      <div className="infinite-gallery-wrapper" ref={wrapperRef}>
        <div className="ig-coords" ref={coordsRef}>0, 0</div>
        <div className="ig-nav-hint" ref={navHintRef}>infinite canvas — drag to explore</div>
        <div className="ig-minimap" ref={minimapRef}>
          <div className="ig-minimap-center"><div className="ig-minimap-cross"></div></div>
          <div className="ig-minimap-dot" ref={miniDotRef}></div>
        </div>

        <div className="ig-canvas" ref={canvasRef}></div>

        <div className="ig-lightbox" ref={lbRef}>
          <div className="ig-lb-backdrop" onClick={(e) => window._closeLb?.(e)}></div>
          <span className="ig-lb-esc" onClick={(e) => window._closeLb?.(e)} style={{cursor: 'pointer'}}>ESC — close</span>
          <button className="ig-lb-close" onClick={(e) => window._closeLb?.(e)}>✕</button>
          <button className="ig-lb-arrow ig-lb-prev" onClick={(e) => window._navLb?.(-1, e)}>‹</button>
          <div className="ig-lb-card" ref={lbCardRef}></div>
          <button className="ig-lb-arrow ig-lb-next" onClick={(e) => window._navLb?.(1, e)}>›</button>
          <div className="ig-lb-counter" ref={lbCounterRef}></div>
        </div>
      </div>
    </div>
  )
}
