import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '#top',      label: 'Главная' },
  { href: '#services', label: 'Услуги' },
  { href: '#about',    label: 'Обо мне' },
  { href: '#works',    label: 'Работы' },
  { href: '#resume',   label: 'Этапы работы' },
  { href: '#contact',  label: 'Контакты' },
]

const SECTION_IDS = ['services', 'about', 'works', 'resume', 'contact']

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    // getBoundingClientRect() работает корректно с ScrollSmoother
    // т.к. учитывает CSS transforms на родительских элементах
    const updateActive = () => {
      if (window.scrollY < 80) {
        setActiveSection('top')
        return
      }

      let current = 'top'
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top <= window.innerHeight * 0.45) {
          current = id
        }
      })
      setActiveSection(current)
    }

    window.addEventListener('scroll', updateActive, { passive: true })
    updateActive()

    return () => window.removeEventListener('scroll', updateActive)
  }, [])

  const handleLink = () => setMenuOpen(false)

  const linkClass = (id) =>
    activeSection === id ? styles.linkActive : styles.link

  const mobileLinkClass = (id) =>
    activeSection === id ? styles.mobileLinkActive : styles.mobileLink

  return (
    <header className={styles.wrapper}>
      <nav className={styles.nav}>

        {/* Левая группа */}
        <div className={`${styles.links} ${styles.linksLeft}`}>
          <a href="#top"      className={linkClass('top')}>Главная</a>
          <a href="#services" className={linkClass('services')}>Услуги</a>
          <a href="#about"    className={linkClass('about')}>Обо мне</a>
        </div>

        {/* Лого по центру */}
        <a href="#top" className={styles.logo}>
          <span className={styles.logoIcon}>S</span>
          <span className={styles.logoName}>Stanislav Muntyanu</span>
        </a>

        {/* Правая группа */}
        <div className={`${styles.links} ${styles.linksRight}`}>
          <a href="#works"   className={linkClass('works')}>Работы</a>
          <a href="#resume"  className={linkClass('resume')}>Этапы работы</a>
          <a href="#contact" className={linkClass('contact')}>Контакты</a>
        </div>

        {/* Бургер */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Меню"
        >
          <span /><span /><span />
        </button>

      </nav>

      {/* Мобильное меню */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <a href="#top"      onClick={handleLink} className={mobileLinkClass('top')}>Главная</a>
        <a href="#services" onClick={handleLink} className={mobileLinkClass('services')}>Услуги</a>
        <a href="#about"    onClick={handleLink} className={mobileLinkClass('about')}>Обо мне</a>
        <a href="#works"    onClick={handleLink} className={mobileLinkClass('works')}>Работы</a>
        <a href="#resume"   onClick={handleLink} className={mobileLinkClass('resume')}>Этапы работы</a>
        <a href="#contact"  onClick={handleLink} className={mobileLinkClass('contact')}>Контакты</a>
      </div>
    </header>
  )
}
