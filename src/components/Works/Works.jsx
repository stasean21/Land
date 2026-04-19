import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createPortal } from 'react-dom'
import styles from './Works.module.css'
import { assetUrl } from '../../utils/assetUrl'

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
      { id: 'd1', src: assetUrl('/1.jpg'), title: 'Крем NATURELLE',      badge: 'Wildberries' },
      { id: 'd2', src: assetUrl('/2.jpg'), title: 'Наушники Aurora ANC',  badge: 'Ozon' },
      { id: 'd3', src: assetUrl('/3.jpg'), title: 'Витамины Daily Multi', badge: 'Ozon' },
      { id: 'd4', src: assetUrl('/4.jpg'), title: 'Кухонные приборы',     badge: 'Ozon' },
    ],
  },
  {
    id: 'photo',
    num: '02',
    title: 'Предметная съёмка + AI',
    items: [
      { id: 'p1', src: assetUrl('/5.jpg'), title: 'Парфюм Aura Blossom',   badge: 'Макро' },
      { id: 'p2', src: assetUrl('/6.jpg'), title: 'Premium Headphones',     badge: 'AI-фон' },
      { id: 'p3', src: assetUrl('/7.jpg'), title: 'Luxury Watch',           badge: 'Композинг' },
      { id: 'p4', src: assetUrl('/1.jpg'), title: 'Organic Cosmetics Line', badge: 'AI-сцена' },
    ],
  },
  {
    id: 'ai-photo',
    num: '03',
    title: 'AI-фотосессии',
    items: [
      { id: 'a1', src: assetUrl('/2.jpg'), title: 'Leather Bag Interior', badge: 'Nano Banana' },
      { id: 'a2', src: assetUrl('/3.jpg'), title: 'Dinnerware Set',       badge: 'AI-сцена' },
      { id: 'a3', src: assetUrl('/4.jpg'), title: 'Trail Sneakers',       badge: 'Lifestyle' },
      { id: 'a4', src: assetUrl('/5.jpg'), title: 'Coffee Machine Loft',  badge: 'Интерьер' },
    ],
  },
  {
    id: 'animation',
    num: '04',
    title: 'Оживление фото',
    items: [
      { id: 'an1', src: assetUrl('/6.jpg'), title: 'Serum До / После', badge: 'Видеообложка' },
      { id: 'an2', src: assetUrl('/7.jpg'), title: 'Headphones Promo',  badge: 'Анимация' },
      { id: 'an3', src: assetUrl('/1.jpg'), title: 'Aurum Watch',       badge: 'Motion' },
      { id: 'an4', src: assetUrl('/2.jpg'), title: 'Apex Bio Greens',   badge: 'Видеообложка' },
    ],
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

      <div className={styles.carouselViewport}>
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
                alt={item.title}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
              <div className={styles.designOverlay}>
                <div className={styles.overlayContent}>
                  <p className={styles.overlayTitle}>{item.title}</p>
                  <span className={styles.overlayBadge}>{item.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          {BLOCKS.slice(1).map((block, idx) => (
            <WorksBlock 
              key={block.id} 
              block={block} 
              onImageClick={openLightbox} 
              interval={3000 + (idx * 500)} // Небольшой рассинхрон для живости
            />
          ))}
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
