import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ScrollProgress.module.css'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    // Небольшая задержка — даём ScrollSmoother инициализироваться первым
    const id = setTimeout(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: 'max',
          scrub: 0,
        },
      })
    }, 100)

    return () => clearTimeout(id)
  }, [])

  return (
    <div className={styles.track}>
      <div ref={barRef} className={styles.bar} />
    </div>
  )
}
