import { useEffect, useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Закрываем меню при клике на ссылку
  const handleLink = () => setMenuOpen(false);

  return (
    <header className={`${styles.wrapper} ${scrolled ? styles.fixed : ''}`}>
      <nav className={styles.nav}>

        {/* Левая группа */}
        <div className={`${styles.links} ${styles.linksLeft}`}>
          <a href="#home"      className={styles.linkActive}>Главная</a>
          <a href="#about"     className={styles.link}>Обо мне</a>
          <a href="#services"  className={styles.link}>Услуги</a>
        </div>

        {/* Лого по центру */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>S</span>
          <span className={styles.logoName}>Stanislav</span>
        </div>

        {/* Правая группа */}
        <div className={`${styles.links} ${styles.linksRight}`}>
          <a href="#portfolio" className={styles.link}>Работы</a>
          <a href="#resume"    className={styles.link}>Резюме</a>
          <a href="#contact"   className={styles.link}>Контакты</a>
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
        <a href="#home"      onClick={handleLink} className={styles.mobileLink}>Главная</a>
        <a href="#about"     onClick={handleLink} className={styles.mobileLink}>Обо мне</a>
        <a href="#services"  onClick={handleLink} className={styles.mobileLink}>Услуги</a>
        <a href="#portfolio" onClick={handleLink} className={styles.mobileLink}>Работы</a>
        <a href="#resume"    onClick={handleLink} className={styles.mobileLink}>Резюме</a>
        <a href="#contact"   onClick={handleLink} className={styles.mobileLink}>Контакты</a>
      </div>
    </header>
  );
}
