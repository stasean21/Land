import { Suspense, lazy, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Preloader from './components/Preloader/Preloader'
import CookieBanner from './components/CookieBanner/CookieBanner'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'
import styles from './App.module.css'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const Services = lazy(() => import('./components/Services/Services'))
const About    = lazy(() => import('./components/About/About'))
const Works    = lazy(() => import('./components/Works/Works'))
const Process  = lazy(() => import('./components/Process/Process'))
const Contacts = lazy(() => import('./components/Contacts/Contacts'))

export default function App() {
  // ScrollSmoother инициализируется ПЕРВЫМ — до любых ScrollTrigger из секций
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper:     '#smooth-wrapper',
      content:     '#smooth-content',
      smooth:      1.5,
      effects:     true,   // включает data-speed / data-lag атрибуты
      smoothTouch: 0.1,
    })

    // Перехватываем якорные ссылки — нативный scroll не работает с smooth-content
    const handleAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')
      if (!hash) return

      e.preventDefault()
      if (hash === '#' || hash === '#top') {
        smoother.scrollTo(0, true)
      } else {
        const target = document.querySelector(hash)
        if (target) smoother.scrollTo(target, true, 'top 80px')
      }
    }
    document.addEventListener('click', handleAnchor)

    return () => {
      document.removeEventListener('click', handleAnchor)
      smoother.kill()
    }
  }, [])

  return (
    <>
      {/*
        position:fixed элементы — СНАРУЖИ smooth-content.
        Внутри transform-контейнера fixed-позиционирование ломается.
      */}
      <ScrollProgress />
      <Preloader />
      <CookieBanner />
      <Header />

      {/* ScrollSmoother требует эту двухуровневую структуру */}
      <div id="smooth-wrapper">
        <div id="smooth-content" className={styles.app}>
          <Hero />
          <div className={styles.deferSection}>
            <Suspense fallback={<div className={styles.sectionSkeleton} aria-hidden="true" />}>
              <Services />
            </Suspense>
          </div>
          <div className={styles.deferSection}>
            <Suspense fallback={<div className={styles.sectionSkeleton} aria-hidden="true" />}>
              <About />
            </Suspense>
          </div>
          <div className={styles.deferSection}>
            <Suspense fallback={<div className={styles.sectionSkeleton} aria-hidden="true" />}>
              <Works />
            </Suspense>
          </div>
          <div className={styles.deferSection}>
            <Suspense fallback={<div className={styles.sectionSkeleton} aria-hidden="true" />}>
              <Process />
            </Suspense>
          </div>
          <div className={styles.deferSection}>
            <Suspense fallback={<div className={styles.sectionSkeleton} aria-hidden="true" />}>
              <Contacts />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
