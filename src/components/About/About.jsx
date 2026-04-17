import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

function Counter({ to, prefix = '', suffix = '', label }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setVal(Math.round(ease * to))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to])

  return (
    <div ref={ref} className={styles.counter}>
      <div className={styles.counterNum}>{prefix}{val}{suffix}</div>
      <div className={styles.counterLabel}>{label}</div>
    </div>
  )
}

const KEYS_TOP = [
  { id: 'ps',      label: 'Photoshop',   color: '#31A8FF', icon: '/icons/ps.png'          },
  { id: 'nb',      label: 'Nano Banana', color: '#22c55e', icon: '/icons/nano-banana.png' },
  { id: 'gemini',  label: 'Gemini',      color: '#8B5CF6', icon: '/icons/gemini.png'      },
  { id: 'chatgpt', label: 'ChatGPT',     color: '#10A37F', icon: '/icons/chatgpt.png'     },
]
const KEYS_BOT = [
  { id: 'davinci',  label: 'DaVinci Resolve', color: '#E8473F', icon: '/icons/davinci.png'   },
  { id: 'claude',   label: 'Claude AI',       color: '#D97706', icon: '/icons/claude.png'    },
  { id: 'openclaw', label: 'Openclaw',        color: '#6366F1', icon: '/icons/openclaw.png'  },
]

const GLOW_BY_INDEX = {
  0: ['#31A8FF'], // синий
  1: ['#F5D94A'], // желтый (банан)
  2: ['#22D3EE'], // голубой
  3: ['#FFFFFF'], // белый
  4: ['#FACC15'], // желтый
  5: ['#F97316'], // оранжевый
  6: ['#EF4444'], // красный
}

const glowColorsByIndex = (idx) => GLOW_BY_INDEX[idx] || ['#22C55E']

function buildGlowFilter(colors, sizePx, alphaHex) {
  return colors
    .map((c) => `drop-shadow(0 0 ${sizePx}px ${c}${alphaHex})`)
    .join(' ')
}

function Key({ label, color, icon, gsapIndex, registerKey }) {
  const outerRef = useRef(null)
  const faceRef  = useRef(null)
  const glowColors = glowColorsByIndex(gsapIndex)

  useEffect(() => {
    if (registerKey) registerKey(gsapIndex, faceRef)
  }, [gsapIndex, registerKey])

  const handleEnter = () => {
    gsap.to(outerRef.current, { y: -4, duration: 0.18, ease: 'power2.out' })
    gsap.to(faceRef.current,  { filter: buildGlowFilter(glowColors, 18, 'CC'), duration: 0.18 })
  }
  const handleLeave = () => {
    gsap.to(outerRef.current, { y: 0, duration: 0.18, ease: 'power2.out' })
    gsap.to(faceRef.current,  { filter: 'drop-shadow(0 0 0px transparent)', duration: 0.18 })
  }
  const handlePress = () => {
    gsap.to(outerRef.current, { y: 4, duration: 0.07, ease: 'power3.in' })
    gsap.to(faceRef.current,  { filter: buildGlowFilter(glowColors, 10, '99'), duration: 0.07 })
  }
  const handleRelease = () => {
    gsap.to(outerRef.current, { y: -4, duration: 0.15, ease: 'back.out(2)' })
    gsap.to(faceRef.current,  { filter: buildGlowFilter(glowColors, 18, 'CC'), duration: 0.15 })
  }

  return (
    <div
      ref={outerRef}
      className={styles.keyOuter}
      data-key-idx={gsapIndex}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
    >
      <div ref={faceRef} className={styles.keyFace}>
        {icon
          ? <img src={icon} alt={label} className={styles.keyIcon} />
          : <div className={styles.keyDot} style={{ background: color }} />
        }
      </div>
      <span className={styles.keyLabel}>{label}</span>
    </div>
  )
}

function KeyboardCard() {
  const boardRef   = useRef(null)
  const keyFaceMap = useRef({})
  const idleTimer  = useRef(null)
  const ghostTimer = useRef(null)

  const registerKey = (idx, faceRef) => {
    keyFaceMap.current[idx] = faceRef
  }

  const runGhost = useCallback(() => {
    ghostTimer.current = setInterval(() => {
      const indices = Object.keys(keyFaceMap.current)
      if (!indices.length) return
      const idx  = indices[Math.floor(Math.random() * indices.length)]
      const glowColors = glowColorsByIndex(Number(idx))
      const face = keyFaceMap.current[idx]?.current
      if (!face) return
      gsap.to(face, {
        y: 5, borderBottomWidth: '1px',
        filter: buildGlowFilter(glowColors, 10, '99'),
        duration: 0.07, ease: 'power3.in',
        onComplete: () => {
          gsap.to(face, {
            y: 0, borderBottomWidth: '3px',
            filter: buildGlowFilter(glowColors, 18, 'CC'),
            duration: 0.18, ease: 'back.out(2)',
            onComplete: () => {
              gsap.to(face, {
                filter: 'drop-shadow(0 0 0px transparent)',
                duration: 0.25,
                delay: 0.12,
                ease: 'power2.out',
              })
            }
          })
        }
      })
    }, 1800)
  }, [])

  const startIdle = useCallback(() => {
    clearTimeout(idleTimer.current)
    clearInterval(ghostTimer.current)
    idleTimer.current = setTimeout(runGhost, 3500)
  }, [runGhost])

  useEffect(() => {
    const keys = boardRef.current?.querySelectorAll('[data-key-idx]')
    if (!keys?.length) return

    gsap.set(keys, { opacity: 0, y: 28 })

    const trigger = ScrollTrigger.create({
      trigger: boardRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(keys, {
          opacity: 1, y: 0,
          duration: 0.55,
          ease: 'back.out(1.7)',
          stagger: 0.08,
          onComplete: startIdle,
        })
      },
    })

    window.addEventListener('mousemove', startIdle)
    window.addEventListener('touchstart', startIdle)

    return () => {
      trigger.kill()
      clearTimeout(idleTimer.current)
      clearInterval(ghostTimer.current)
      window.removeEventListener('mousemove', startIdle)
      window.removeEventListener('touchstart', startIdle)
    }
  }, [startIdle])

  const ALL = [...KEYS_TOP, ...KEYS_BOT]

  return (
    <div ref={boardRef} className={styles.keyboard}>
      <div className={styles.keyRow}>
        {ALL.map((k, i) => (
          <Key key={k.id} {...k} gsapIndex={i} registerKey={registerKey} />
        ))}
      </div>
    </div>
  )
}

const SKILLS = [
  'Figma', 'Photoshop', 'Prompt-инжиниринг',
  'DaVinci Resolve', 'Макро-съемка',
]

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.island}>
          <div className={styles.header}>
            <p className={styles.subtitle}>Опыт, технологии и результаты</p>
          </div>

          <div className={styles.bento}>

            <div className={[styles.card, styles.cardStory].join(' ')}>
              <div className={styles.photoWrap}>
                <img src="/photo.jpg" alt="Станислав Мунтяну" className={styles.photo} />
                <div className={styles.photoOverlay} />
              </div>
              <div className={styles.storyText}>
                <h3 className={styles.storyName}>Станислав Мунтяну</h3>
                <p className={styles.storyBody}>
                  Более <span className={styles.accent}>5 лет</span> в графическом дизайне,
                  специализируюсь на создании коммерческого визуала для маркетплейсов.
                </p>
                <p className={styles.storyBody}>
                  Как действующий селлер на <span className={styles.accent}>Ozon</span>, я на практике знаю,
                  как визуальная упаковка и грамотное УТП пробивают баннерную слепоту конкурентов.
                </p>
                <p className={styles.storyBody}>
                  Мой подход — микс глубокого понимания алгоритмов продаж
                  и передовых <span className={styles.accent}>AI-технологий</span>.
                </p>
              </div>
            </div>

            <div className={styles.rightCol}>

              <div className={[styles.card, styles.cardStats].join(' ')}>
                <Counter to={5}   prefix="> " suffix=" лет" label="Опыт в коммерческом дизайне" />
                <div className={styles.divider} />
                <Counter to={1000} suffix="+"            label="Реализованных проектов" />
                <div className={styles.divider} />
                <Counter to={27}  prefix="+" suffix="%"  label="Средний рост CTR" />
              </div>

              <div className={[styles.card, styles.cardKeys].join(' ')}>
                <div className={styles.cardKeysHeader}>
                  <p className={styles.cardSubBig}>Нейросети и редакторы, которые делают магию</p>
                </div>
                <KeyboardCard />
              </div>

              <div className={[styles.card, styles.cardSkills].join(' ')}>
                <h3 className={styles.cardTitle}>Ключевые навыки</h3>
                <div className={styles.skillTags}>
                  {SKILLS.map(s => (
                    <span key={s} className={styles.skillTag}>{s}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
