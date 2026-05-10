import { useEffect, useRef } from 'react'
import styles from './ScrollLine.module.css'

export default function ScrollLine() {
  const pathRef = useRef(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()
    path.style.strokeDasharray = length
    path.style.strokeDashoffset = length

    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      path.style.strokeDashoffset = length * (1 - progress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d="
            M 500 0
            C 50 80, 950 180, 500 280
            C 50 380, 950 480, 500 580
            C 50 680, 950 780, 500 880
            C 200 950, 800 980, 500 1000
          "
          fill="none"
          stroke="rgba(34,197,94,0.22)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
