import { useState, useEffect } from 'react'
import styles from './Preloader.module.css'

const MIN_MS = 1000

export default function Preloader() {
  const [hiding, setHiding] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const start = Date.now()

    const fontsReady = document.fonts.ready
    const timeout = new Promise(resolve => setTimeout(resolve, 3000))

    Promise.race([fontsReady, timeout]).then(() => {
      const wait = Math.max(0, MIN_MS - (Date.now() - start))
      setTimeout(() => {
        setHiding(true)
        setTimeout(() => {
          setGone(true)
          document.body.style.overflow = ''
        }, 650)
      }, wait)
    })

    return () => { document.body.style.overflow = '' }
  }, [])

  if (gone) return null

  return (
    <div className={`${styles.preloader} ${hiding ? styles.hiding : ''}`}>
      <div className={styles.inner}>
        <span className={styles.logo}>M</span>
        <div className={styles.track}>
          <div className={styles.bar} />
        </div>
        <span className={styles.label}>MUNTYANU DESIGN</span>
      </div>
    </div>
  )
}
