import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createPortal } from 'react-dom'
import InfiniteGallery from './InfiniteGallery'
import styles from './Works.module.css'
import { assetUrl } from '../../utils/assetUrl'

gsap.registerPlugin(ScrollTrigger)

/* ================================================================
   DATA
   ================================================================ */
const BLOCKS = [
  {
    id: 'design',
    num: '01',
    title: 'Дизайн и инфографика',
    items: [
      { src: assetUrl('/works/design/1.png'), title: 'Крем NATURELLE',      badge: 'Wildberries' },
      { src: assetUrl('/works/design/2.png'), title: 'Наушники Aurora ANC',  badge: 'Ozon' },
      { src: assetUrl('/works/design/3.png'), title: 'Витамины Daily Multi', badge: 'Ozon' },
      { src: assetUrl('/works/design/4.png'), title: 'Кухонные приборы',     badge: 'Ozon' },
    ],
  },
  {
    id: 'photo',
    num: '02',
    title: 'Предметная съёмка + AI',
    items: [
      { src: assetUrl('/works/photo/1.png'), title: 'Парфюм Aura Blossom',   badge: 'Макро' },
      { src: assetUrl('/works/photo/2.png'), title: 'Premium Headphones',     badge: 'AI-фон' },
      { src: assetUrl('/works/photo/3.png'), title: 'Luxury Watch',           badge: 'Композинг' },
      { src: assetUrl('/works/photo/4.png'), title: 'Organic Cosmetics Line', badge: 'AI-сцена' },
    ],
  },
  {
    id: 'ai-photo',
    num: '03',
    title: 'AI-фотосессии',
    items: [
      { src: assetUrl('/works/ai-photo/1.png'), title: 'Leather Bag Interior', badge: 'Nano Banana' },
      { src: assetUrl('/works/ai-photo/2.png'), title: 'Dinnerware Set',       badge: 'AI-сцена' },
      { src: assetUrl('/works/ai-photo/3.png'), title: 'Trail Sneakers',       badge: 'Lifestyle' },
      { src: assetUrl('/works/ai-photo/4.png'), title: 'Coffee Machine Loft',  badge: 'Интерьер' },
    ],
  },
  {
    id: 'animation',
    num: '04',
    title: 'Оживление фото',
    items: [
      { src: assetUrl('/works/animation/1.png'), title: 'Serum До / После', badge: 'Видеообложка' },
      { src: assetUrl('/works/animation/2.png'), title: 'Headphones Promo',  badge: 'Анимация' },
      { src: assetUrl('/works/animation/3.png'), title: 'Aurum Watch',       badge: 'Motion' },
      { src: assetUrl('/works/animation/4.png'), title: 'Apex Bio Greens',   badge: 'Видеообложка' },
    ],
  },
]

/* ================================================================
   LIGHTBOX
   ================================================================ */
function Lightbox({ allItems, index, onClose, onPrev, onNext }) {
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

  const item = allItems[index]

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <button className={styles.lightboxClose} onClick={onClose} aria-label="Закрыть">✕</button>
      <button
        className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Предыдущая"
      >‹</button>
      <img
        className={styles.lightboxImage}
        src={item.src}
        alt={item.title}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className={`${styles.lightboxNav} ${styles.lightboxNext}`}
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Следующая"
      >›</button>
    </div>
  )
}

/* ================================================================
   DESIGN BLOCK (#1) — fully styled
   ================================================================ */
function DesignBlock({ block, onImageClick, onOpenGallery }) {
  const ref = useRef(null)

  useEffect(() => {
    const cards = ref.current?.querySelectorAll('[data-card]')
    if (!cards?.length) return
    gsap.set(cards, { opacity: 0, y: 40 })
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
        })
      },
    })
    return () => trigger.kill()
  }, [])

  // Show first 3 items in the grid
  const visibleItems = block.items.slice(0, 3)

  return (
    <div className={styles.block} ref={ref}>
      {/* Description heading */}
      <p className={styles.blockDescription}>
        Собираю карточки в стиле сильных коммерческих слайдов
      </p>

      {/* Asymmetric grid: large left, 2 stacked right */}
      <div className={styles.designGrid}>
        {visibleItems.map((item, i) => (
          <div
            key={item.src}
            className={`${styles.designCard} ${i === 0 ? styles.designCardMain : ''}`}
            data-card
            onClick={() => onImageClick(item)}
          >
            <img className={styles.designCardImage} src={item.src} alt={item.title} loading="lazy" />
            <div className={styles.designOverlay}>
              <div className={styles.overlayContent}>
                <p className={styles.overlayTitle}>{item.title}</p>
                <span className={styles.overlayBadge}>{item.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div className={styles.ctaWrap}>
        <button className={styles.ctaButton} onClick={onOpenGallery}>Смотреть все работы</button>
      </div>
    </div>
  )
}

/* ================================================================
   PLACEHOLDER BLOCK (for #2, #3, #4 — simple grid, will be refined)
   ================================================================ */
function PlaceholderBlock({ block, onImageClick }) {
  const ref = useRef(null)

  useEffect(() => {
    const cards = ref.current?.querySelectorAll('[data-card]')
    if (!cards?.length) return
    gsap.set(cards, { opacity: 0, y: 40 })
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        })
      },
    })
    return () => trigger.kill()
  }, [])

  return (
    <div className={styles.block} ref={ref}>
      <div className={styles.divider} />
      <div className={styles.blockHeader}>
        <span className={styles.blockNumber}>{block.num}</span>
        <h3 className={styles.blockTitle}>{block.title}</h3>
      </div>
      <div className={styles.placeholderGrid}>
        {block.items.map((item) => (
          <div
            key={item.src}
            className={styles.placeholderCard}
            data-card
            onClick={() => onImageClick(item)}
          >
            <img className={styles.placeholderImage} src={item.src} alt={item.title} loading="lazy" />
            <div className={styles.placeholderOverlay}>
              <div className={styles.overlayContent}>
                <p className={styles.overlayTitle}>{item.title}</p>
                <span className={styles.overlayBadge}>{item.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
    const idx = allItems.findIndex((i) => i.src === item.src)
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
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.island}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Примеры работ</p>
          </div>

          {/* 01 — Дизайн и инфографика (полноценный блок) */}
          <DesignBlock block={BLOCKS[0]} onImageClick={openLightbox} onOpenGallery={() => setShowGallery(true)} />

          {/* 02, 03, 04 — пока placeholder-сетки */}
          {BLOCKS.slice(1).map((block) => (
            <PlaceholderBlock key={block.id} block={block} onImageClick={openLightbox} />
          ))}
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          allItems={allItems}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}

      {showGallery && createPortal(
        <InfiniteGallery onClose={() => setShowGallery(false)} items={allItems} />,
        document.body
      )}
    </section>
  )
}
