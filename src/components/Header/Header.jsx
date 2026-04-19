import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Закрываем меню при клике на ссылку
  const handleLink = () => setMenuOpen(false);

  return (
    <header className={styles.wrapper}>
      <nav className={styles.nav}>

        {/* Левая группа */}
        <div className={`${styles.links} ${styles.linksLeft}`}>
          <a href="#top"       className={styles.linkActive}>Главная</a>
          <a href="#services"  className={styles.link}>Услуги</a>
          <a href="#about"     className={styles.link}>Обо мне</a>
        </div>

        {/* Лого по центру */}
        <a href="#top" className={styles.logo}>
          <span className={styles.logoIcon}>S</span>
          <span className={styles.logoName}>Stanislav Muntyanu</span>
        </a>

        {/* Правая группа */}
        <div className={`${styles.links} ${styles.linksRight}`}>
          <a href="#works" className={styles.link}>Работы</a>
          <a href="#resume" className={styles.link}>Этапы работы</a>
          <a href="#contact" className={styles.link}>Контакты</a>
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
        <a href="#top"       onClick={handleLink} className={styles.mobileLink}>Главная</a>
        <a href="#services"  onClick={handleLink} className={styles.mobileLink}>Услуги</a>
        <a href="#about"     onClick={handleLink} className={styles.mobileLink}>Обо мне</a>
        <a href="#works"     onClick={handleLink} className={styles.mobileLink}>Работы</a>
        <a href="#resume"    onClick={handleLink} className={styles.mobileLink}>Этапы работы</a>
        <a href="#contact"   onClick={handleLink} className={styles.mobileLink}>Контакты</a>
      </div>
    </header>
  );
}
