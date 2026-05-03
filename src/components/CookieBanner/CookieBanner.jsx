import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './CookieBanner.module.css'
import PrivacyPolicyContent from '../Contacts/PrivacyPolicyContent'

const STORAGE_KEY = 'cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [hiding, setHiding] = useState(false)
  const [checked, setChecked] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const id = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(id)
    }
  }, [])

  const accept = () => {
    if (!checked) return
    localStorage.setItem(STORAGE_KEY, '1')
    setHiding(true)
    setTimeout(() => setVisible(false), 500)
  }

  if (!visible) return null

  return (
    <>
      <div className={`${styles.banner} ${hiding ? styles.hiding : ''}`}>
        <div className={styles.icon}>🍪</div>
        <div className={styles.body}>
          <p className={styles.text}>
            Мы используем файлы cookie и сервис{' '}
            <span className={styles.accent}>Яндекс Метрика</span> для анализа
            посещаемости и улучшения сайта. Продолжая использовать сайт, вы
            соглашаетесь с нашей{' '}
            <button
              className={styles.policyBtn}
              onClick={() => setPolicyOpen(true)}
            >
              политикой конфиденциальности
            </button>
            .
          </p>
          <div className={styles.actions}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span className={styles.checkText}>Я согласен(а)</span>
            </label>
            <button className={styles.btn} onClick={accept} disabled={!checked}>
              Принять
            </button>
          </div>
        </div>
      </div>

      {policyOpen && createPortal(
        <div className={styles.overlay} onClick={() => setPolicyOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setPolicyOpen(false)}
              aria-label="Закрыть"
            >
              ✕
            </button>
            <div className={styles.modalContent}>
              <PrivacyPolicyContent />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
