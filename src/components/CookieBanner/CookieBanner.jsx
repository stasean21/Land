import { useState, useEffect } from 'react'
import styles from './CookieBanner.module.css'

const STORAGE_KEY = 'cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const id = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(id)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setHiding(true)
    setTimeout(() => setVisible(false), 500)
  }

  if (!visible) return null

  return (
    <div className={`${styles.banner} ${hiding ? styles.hiding : ''}`}>
      <div className={styles.icon}>🍪</div>
      <p className={styles.text}>
        Мы используем файлы cookie и сервис{' '}
        <span className={styles.accent}>Яндекс Метрика</span> для анализа
        посещаемости и улучшения сайта. Продолжая использовать сайт, вы
        соглашаетесь с нашей{' '}
        <a
          href={import.meta.env.VITE_PRIVACY_POLICY_URL || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          политикой конфиденциальности
        </a>
        .
      </p>
      <button className={styles.btn} onClick={accept}>
        Принять
      </button>
    </div>
  )
}
