import { Suspense, lazy } from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Preloader from './components/Preloader/Preloader'
import CookieBanner from './components/CookieBanner/CookieBanner'
import styles from './App.module.css'

const Services = lazy(() => import('./components/Services/Services'))
const About = lazy(() => import('./components/About/About'))
const Works = lazy(() => import('./components/Works/Works'))
const Contacts = lazy(() => import('./components/Contacts/Contacts'))

export default function App() {
  return (
    <div id="top" className={styles.app}>
      <Preloader />
      <CookieBanner />
      <Header />
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
          <Contacts />
        </Suspense>
      </div>
    </div>
  )
}
