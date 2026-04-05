# Land

Лендинг-портфолио для услуг по визуалу маркетплейсов (Ozon, Wildberries, Яндекс Маркет) на React + Vite.

## Что сейчас в ветке `main`

- Одностраничный сайт с секциями: `Header`, `Hero`, `Services`, `About`
- Адаптивная шапка с бургер-меню и состоянием при скролле
- Hero-блок с фоновым видео и typewriter-эффектом
- Блок услуг с кастомными SVG-сценами и карточками
- Блок About с анимациями на `gsap` + `ScrollTrigger`
- Локальные ассеты: иконки инструментов, фото и видео в `public/`
- Крупный файл `public/video/hero-video2.mp4` удален из репозитория

## Технологии

- React 19
- Vite
- CSS Modules
- GSAP (`gsap`, `ScrollTrigger`)
- ESLint

## Структура проекта

```text
src/
  components/
    Header/
    Hero/
    Services/
    About/
  fonts/
  App.jsx
  main.jsx
public/
  icons/
  video/
```

## Запуск локально

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```
