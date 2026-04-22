import { useRef, useState, useEffect } from 'react'
import styles from './Works.module.css'

export default function BeforeAfter({ beforeSrc, afterSrc }) {
  const containerRef = useRef(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (e) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    let x = e.clientX - rect.left

    // Handle touch
    if (e.touches) {
      x = e.touches[0].clientX - rect.left
    }

    // Constrain to bounds
    x = Math.max(0, Math.min(x, rect.width))
    const percentage = (x / rect.width) * 100
    setSliderPos(percentage)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleTouchStart = () => setIsDragging(true)

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => handleMove(e)
    const handleTouchMove = (e) => handleMove(e)
    const handleEnd = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging])

  const handleClick = (e) => {
    handleMove(e)
  }

  return (
    <div
      className={styles.beforeAfterContainer}
      ref={containerRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After image (always visible) */}
      <img
        src={afterSrc}
        alt="After"
        className={styles.beforeAfterImage}
        loading="lazy"
        decoding="async"
      />

      {/* Before image (clipped by slider position) */}
      <img
        src={beforeSrc}
        alt="Before"
        className={styles.beforeAfterImage}
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        loading="lazy"
        decoding="async"
      />

      {/* Slider handle */}
      <div
        className={styles.beforeAfterSlider}
        style={{ left: `${sliderPos}%` }}
      >
        <div className={styles.beforeAfterHandle}>
          <svg
            className={styles.beforeAfterArrow}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg
            className={styles.beforeAfterArrow}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className={styles.beforeAfterLabel} style={{ left: '12px', top: '12px' }}>
        BEFORE
      </div>
      <div className={styles.beforeAfterLabel} style={{ right: '12px', top: '12px' }}>
        AFTER
      </div>
    </div>
  )
}
