import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createPortal } from 'react-dom'
import styles from './Works.module.css'
import BeforeAfter from './BeforeAfter'

gsap.registerPlugin(ScrollTrigger)
const InfiniteGallery = lazy(() => import('./InfiniteGallery'))

/* ================================================================
   DATA
   ================================================================ */
const BLOCKS = [
  {
    id: 'design',
    num: '01',
    title: 'Дизайн и инфографика',
    items: [
      { id: 'd1', src: 'https://storage.yandexcloud.net/landing-main/design-info/1.webp' },
      { id: 'd2', src: 'https://storage.yandexcloud.net/landing-main/design-info/2.webp' },
      { id: 'd3', src: 'https://storage.yandexcloud.net/landing-main/design-info/3.webp' },
      { id: 'd4', src: 'https://storage.yandexcloud.net/landing-main/design-info/4.webp' },
      { id: 'd5', src: 'https://storage.yandexcloud.net/landing-main/design-info/5.webp' },
      { id: 'd6', src: 'https://storage.yandexcloud.net/landing-main/design-info/6.webp' },
      { id: 'd7', src: 'https://storage.yandexcloud.net/landing-main/design-info/7.webp' },
      { id: 'd8', src: 'https://storage.yandexcloud.net/landing-main/design-info/8.webp' },
      { id: 'd9', src: 'https://storage.yandexcloud.net/landing-main/design-info/9.webp' },
      { id: 'd10', src: 'https://storage.yandexcloud.net/landing-main/design-info/10.webp' },
      { id: 'd11', src: 'https://storage.yandexcloud.net/landing-main/design-info/11.webp' },
      { id: 'd12', src: 'https://storage.yandexcloud.net/landing-main/design-info/12.webp' },
      { id: 'd13', src: 'https://storage.yandexcloud.net/landing-main/design-info/13.webp' },
      { id: 'd14', src: 'https://storage.yandexcloud.net/landing-main/design-info/14.webp' },
      { id: 'd15', src: 'https://storage.yandexcloud.net/landing-main/design-info/15.webp' },
      { id: 'd16', src: 'https://storage.yandexcloud.net/landing-main/design-info/16.webp' },
      { id: 'd17', src: 'https://storage.yandexcloud.net/landing-main/design-info/17.webp' },
      { id: 'd18', src: 'https://storage.yandexcloud.net/landing-main/design-info/18.webp' },
      { id: 'd19', src: 'https://storage.yandexcloud.net/landing-main/design-info/19.webp' },
      { id: 'd20', src: 'https://storage.yandexcloud.net/landing-main/design-info/20.webp' },
      { id: 'd21', src: 'https://storage.yandexcloud.net/landing-main/design-info/21.webp' },
      { id: 'd22', src: 'https://storage.yandexcloud.net/landing-main/design-info/22.webp' },
      { id: 'd23', src: 'https://storage.yandexcloud.net/landing-main/design-info/23.webp' },
      { id: 'd24', src: 'https://storage.yandexcloud.net/landing-main/design-info/24.webp' },
    ],
  },
  {
    id: 'photo',
    num: '02',
    title: 'AI Предметная съёмка + Upscale',
    items: [
      {
        id: 'ba1',
        beforeSrc: 'https://storage.yandexcloud.net/landing-main/before-after/before%201.webp',
        afterSrc: 'https://storage.yandexcloud.net/landing-main/before-after/after%201.webp',
      },
    ],
  },
  {
    id: 'ai-photo',
    num: '03',
    title: 'AI-фотосессии',
    items: [],
  },
  {
    id: 'animation',
    num: '04',
    title: 'Оживление фото',
    items: [],
  },
]

/* ================================================================
   LIGHTBOX
   ================================================================ */
function Lightbox({ allItems, index, onClose, onPrev, onNext }) {
  const imgRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  // Плавное появление при смене картинки
  useLayoutEffect(() => {
    if (!imgRef.current) return
    gsap.fromTo(imgRef.current, 
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    )
  }, [index])

  const item = allItems[index]

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <div className={styles.lightboxBackdrop} />
      
      <div className={styles.lightboxHeader}>
        <div className={styles.lightboxCounter}>
          Работа <strong>{index + 1}</strong> из {allItems.length}
        </div>
        <button className={styles.lightboxClose} onClick={onClose}>✕</button>
      </div>

      <button
        className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
        onClick={(e) => { e.stopPropagation(); onPrev() }}
      >‹</button>

      <div className={styles.lightboxMain} onClick={(e) => e.stopPropagation()}>
        <img
          ref={imgRef}
          className={styles.lightboxImage}
          src={item.src}
          alt={item.title}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />

      </div>

      <button
        className={`${styles.lightboxNav} ${styles.lightboxNext}`}
        onClick={(e) => { e.stopPropagation(); onNext() }}
      >›</button>
    </div>
  )
}

/* ================================================================
   CAROUSEL BLOCK
   ================================================================ */
function WorksBlock({ block, onImageClick, onOpenGallery, interval = 5000 }) {
  const [items, setItems] = useState(block.items)
  const [isPaused, setIsPaused] = useState(false)
  const trackRef = useRef(null)
  const timerRef = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const rotate = useCallback(() => {
    if (!trackRef.current) return

    const cards = trackRef.current.children
    if (cards.length < 2) return
    const cardWidth = cards[0].offsetWidth
    const gap = 16
    const moveDist = cardWidth + gap

    gsap.to(trackRef.current, {
      x: -moveDist,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        setItems((prev) => {
          const next = [...prev]
          const first = next.shift()
          next.push(first)
          return next
        })
      }
    })
  }, [])

  const rotatePrev = useCallback(() => {
    if (!trackRef.current) return

    const cards = trackRef.current.children
    if (cards.length < 2) return
    
    setItems((prev) => {
      const next = [...prev]
      const last = next.pop()
      next.unshift(last)
      return next
    })

    setTimeout(() => {
      const cardWidth = cards[0].offsetWidth
      const gap = 16
      const moveDist = cardWidth + gap
      gsap.to(trackRef.current, {
        x: moveDist,
        duration: 0.8,
        ease: 'power2.inOut',
      })
    }, 0)
  }, [])

  const rotateNext = useCallback(() => {
    setIsPaused(true)
    setTimeout(() => {
      setIsPaused(false)
      rotate()
    }, 0)
  }, [rotate])

  const handlePrev = useCallback(() => {
    setIsPaused(true)
    setTimeout(() => {
      setIsPaused(false)
      rotatePrev()
    }, 0)
  }, [rotatePrev])

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) rotateNext()
      else handlePrev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }, [rotateNext, handlePrev])

  // Бесшовный сброс позиции трека после вращения стейта
  useLayoutEffect(() => {
    gsap.set(trackRef.current, { x: 0 })
  }, [items])

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
    } else {
      timerRef.current = setInterval(rotate, interval)
    }
    return () => clearInterval(timerRef.current)
  }, [isPaused, rotate, interval])

  // ScrollTrigger: entrance animation for the block
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const cards = el.querySelectorAll('[data-card]')
    gsap.set(cards, { opacity: 0, y: 30 })
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
      },
    })
    return () => trigger.kill()
  }, [])

  return (
    <div 
      id={`works-${block.id}`}
      className={styles.block}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {block.id !== 'design' && <div className={styles.divider} />}
      
      <div className={styles.blockHeader}>
        <span className={styles.blockNumber}>{block.num}</span>
        {block.id === 'design' ? (
          <p className={styles.blockDescription}>Дизайн и инфографика</p>
        ) : (
          <h3 className={styles.blockTitle}>{block.title}</h3>
        )}
      </div>

      <div className={styles.carouselContainer}>
        <button
          className={`${styles.carouselNav} ${styles.carouselPrev}`}
          onClick={handlePrev}
          aria-label="Предыдущие работы"
        >
          ‹
        </button>

        <div
          className={styles.carouselViewport}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.carouselTrack} ref={trackRef}>
            {items.map((item) => (
              <div
                key={item.id}
                className={styles.designCard}
                data-card
                onClick={() => onImageClick(item)}
              >
                <img
                  className={styles.designCardImage}
                  src={item.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.carouselNav} ${styles.carouselNext}`}
          onClick={rotateNext}
          aria-label="Следующие работы"
        >
          ›
        </button>
      </div>

      {block.id === 'design' && (
        <div className={styles.ctaWrap}>
          <button className={styles.ctaButton} onClick={onOpenGallery}>Смотреть все работы</button>
        </div>
      )}
    </div>
  )
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function Works() {
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [showGallery, setShowGallery] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const sectionRef = useRef(null)

  // Flatten all items for lightbox navigation
  const allItems = BLOCKS.flatMap((b) => b.items)

  // GSAP: section entrance
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    gsap.set(el, { opacity: 0, y: 60 })
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      },
    })
    return () => trigger.kill()
  }, [])

  const openLightbox = (item) => {
    const idx = allItems.findIndex((i) => i.id === item.id)
    setLightboxIdx(idx >= 0 ? idx : 0)
  }
  const closeLightbox = () => setLightboxIdx(null)

  const prevLightbox = useCallback(() => {
    setLightboxIdx((prev) => (prev <= 0 ? allItems.length - 1 : prev - 1))
  }, [allItems.length])

  const nextLightbox = useCallback(() => {
    setLightboxIdx((prev) => (prev >= allItems.length - 1 ? 0 : prev + 1))
  }, [allItems.length])

  return (
    <section id="works" className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.island}>
          {/* 01 — Дизайн и инфографика */}
          <WorksBlock 
            block={BLOCKS[0]} 
            onImageClick={openLightbox} 
            onOpenGallery={() => setShowGallery(true)} 
            interval={3000}
          />

          {/* 02, 03, 04 — остальные блоки */}
          {BLOCKS.slice(1)
            .filter(block => block.items.length > 0)
            .map((block, idx) => {
              if (block.id === 'photo') {
                const photoItems = block.items
                return (
                  <div key={block.id} id={`works-${block.id}`} className={styles.block}>
                    <div className={styles.divider} />
                    <div className={styles.blockHeader}>
                      <span className={styles.blockNumber}>{block.num}</span>
                      <p className={styles.blockDescription}>{block.title}</p>
                    </div>
                    <div className={styles.carouselContainer}>
                      <button
                        className={`${styles.carouselNav} ${styles.carouselPrev}`}
                        onClick={() => setPhotoIdx(i => (i <= 0 ? photoItems.length - 1 : i - 1))}
                        aria-label="Предыдущая работа"
                      >‹</button>
                      <div className={styles.carouselViewport}>
                        <BeforeAfter
                          beforeSrc={photoItems[photoIdx].beforeSrc}
                          afterSrc={photoItems[photoIdx].afterSrc}
                        />
                      </div>
                      <button
                        className={`${styles.carouselNav} ${styles.carouselNext}`}
                        onClick={() => setPhotoIdx(i => (i >= photoItems.length - 1 ? 0 : i + 1))}
                        aria-label="Следующая работа"
                      >›</button>
                    </div>
                  </div>
                )
              }
              
              return (
                <WorksBlock 
                  key={block.id} 
                  block={block} 
                  onImageClick={openLightbox} 
                  interval={3000 + (idx * 500)}
                />
              )
            })}
        </div>
      </div>

      {lightboxIdx !== null && createPortal(
        <Lightbox
          allItems={allItems}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />,
        document.body
      )}

      {showGallery && createPortal(
        <Suspense fallback={<div className={styles.galleryLoader}>Загружаем галерею...</div>}>
          <InfiniteGallery onClose={() => setShowGallery(false)} items={allItems} />
        </Suspense>,
        document.body
      )}
    </section>
  )
}
