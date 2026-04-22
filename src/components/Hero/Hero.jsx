import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

const PHRASES = [
  'Инфографика для маркетплейсов',
  'AI-Нейрофотосессии',
  'AI-Продуктовая съёмка',
]

const TYPE_MS   = 80
const DELETE_MS = 40
const PAUSE_MS  = 2000
const HERO_VIDEO_WEBM = 'https://storage.yandexcloud.net/landing-main/video/main-video-1.webm?v=20260419'
const HERO_VIDEO_MP4  = 'https://storage.yandexcloud.net/landing-main/video/main-video-1.mp4?v=20260419'
const HERO_VIDEO_POSTER = 'https://storage.yandexcloud.net/landing-main/video/main-video-1-poster.jpg'

export default function Hero() {
  const typewriterRef = useRef(null)

  useEffect(() => {
    const el = typewriterRef.current
    if (!el) return

    let phraseIndex = 0
    let charIndex   = 0
    let isDeleting  = false
    let timer       = null

    function tick() {
      const current = PHRASES[phraseIndex]

      if (!isDeleting) {
        el.textContent = current.slice(0, charIndex + 1)
        charIndex++
        if (charIndex === current.length) {
          isDeleting = true
          timer = setTimeout(tick, PAUSE_MS)
          return
        }
        timer = setTimeout(tick, TYPE_MS)
      } else {
        el.textContent = current.slice(0, charIndex - 1)
        charIndex--
        if (charIndex === 0) {
          isDeleting  = false
          phraseIndex = (phraseIndex + 1) % PHRASES.length
        }
        timer = setTimeout(tick, DELETE_MS)
      }
    }

    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.heroWrapper}>
      <section className={styles.hero}>

        {/* фоновое видео */}
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_VIDEO_POSTER}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_WEBM} type="video/webm" />
          <source src={HERO_VIDEO_MP4} type="video/mp4" />
        </video>

        {/* оверлей */}
        <div className={styles.overlay} />

        {/* стеклянный контейнер */}
        <div className={styles.glass}>

          {/* шапка */}
          <div className={styles.meta}>
            <span>ГРАФИЧЕСКИЙ ДИЗАЙНЕР</span>
            <span>CONTENT AI · ВИЗУАЛ · ГРАФИКА</span>
          </div>

          {/* имя */}
          <h1 className={styles.name}>Станислав Мунтяну</h1>

          {/* typewriter */}
          <div className={styles.typewriterWrap}>
            <span ref={typewriterRef} />
            <span className={styles.cursor} />
          </div>

          {/* слоган */}
          <p className={styles.tagline}>
            Создаю визуал, который делает
            карточку заметной и поднимает CTR
          </p>

          {/* буллеты */}
          <ul className={styles.bullets}>
            <li>
              <span className={styles.dot} />
              <span className={styles.bulletText}>
                Разрабатываю уникальный дизайн под нишу и выдачу
              </span>
            </li>
            <li>
              <span className={styles.dot} />
              <span className={styles.bulletText}>
                Собираю продающую структуру и прорабатываю УТП
              </span>
            </li>
            <li>
              <span className={styles.dot} />
              <span className={styles.bulletText}>
                Подключаю AI-сцены, AI-модели и продуктовую съёмку
              </span>
            </li>
          </ul>

          {/* кнопки */}
          <div className={styles.buttons}>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              Смотреть работы
            </button>
            <button className={`${styles.btn} ${styles.btnOutline}`}>
              Обсудить задачу
            </button>
          </div>

        </div>
      </section>
    </div>
  )
}
