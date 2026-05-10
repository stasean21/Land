import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Process.module.css'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { num: '01', title: 'Бриф', text: 'Рассказываете о товаре, площадке и конкурентах. Я задаю нужные вопросы — занимает 10–15 минут.' },
  { num: '02', title: 'Анализ и концепция', text: 'Изучаю нишу, смотрю что продаёт у конкурентов — строю структуру карточки под покупателя, а не под вкус.' },
  { num: '03', title: 'Дизайн', text: 'Отрисовываю инфографику с акцентом на главное: почему ваш товар, почему сейчас, почему стоит своих денег.' },
  { num: '04', title: 'Правки', text: 'Показываю результат. Вносим правки пока не скажете «это то, что нужно».' },
  { num: '05', title: 'Готовые файлы', text: 'Отдаю всё в нужных форматах, готовых к загрузке на Wildberries, Ozon или любую другую площадку.' },
  { num: '06', title: 'Оплата', text: 'Оплачиваете после того, как увидите результат и скажете «всё отлично». Удобный способ оплаты обсудим при общении.' },
]

export default function Process() {
  const sectionRef = useRef(null)
  const stepsRef  = useRef([])
  const dotsRef   = useRef([])
  const linesRef  = useRef([])
  const noteRef   = useRef(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const ctx = gsap.context(() => {

      if (isMobile) {
        // Мобильный: обычные scroll-triggered анимации
        stepsRef.current.filter(Boolean).forEach((item) => {
          gsap.fromTo(item,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 88%' } }
          )
        })
        dotsRef.current.filter(Boolean).forEach((dot, i) => {
          const line = linesRef.current[i]
          gsap.fromTo(dot,
            { scale: 0.3, backgroundColor: '#1C1C1E', borderColor: 'rgba(34,197,94,0.4)' },
            {
              scale: 1, backgroundColor: '#22c55e', borderColor: '#22c55e',
              duration: 0.5, ease: 'back.out(2.5)',
              scrollTrigger: { trigger: dot, start: 'top 90%' },
              onComplete: () => {
                if (line) gsap.fromTo(line, { scaleY: 0, opacity: 1 }, { scaleY: 1, opacity: 1, duration: 0.6, ease: 'power2.inOut' })
              },
            }
          )
        })
      } else {
        // Десктоп: PIN + SCRUB
        // Скрываем всё сразу
        gsap.set(stepsRef.current.filter(Boolean), { opacity: 0, x: -16 })
        gsap.set(dotsRef.current.filter(Boolean), { scale: 0.3, backgroundColor: '#1C1C1E', borderColor: 'rgba(34,197,94,0.4)' })
        gsap.set(linesRef.current.filter(Boolean), { scaleY: 0, opacity: 1 })
        gsap.set([noteRef.current, footerRef.current].filter(Boolean), { opacity: 0, y: 10 })

        const stepDuration = 1.0

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            pinSpacing: true,
            start: 'top 80px',     // учитываем высоту хедера
            end: `+=${window.innerHeight * 6}`,
            scrub: 1,
          },
        })

        stepsRef.current.filter(Boolean).forEach((step, i) => {
          const dot  = dotsRef.current[i]
          const line = linesRef.current[i]
          const pos  = i * stepDuration

          tl.to(step, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, pos)
          tl.to(dot,  { scale: 1, backgroundColor: '#22c55e', borderColor: '#22c55e', duration: 0.35, ease: 'back.out(2.5)' }, pos + 0.25)
          if (line) tl.to(line, { scaleY: 1, duration: 0.45, ease: 'power2.inOut' }, pos + 0.5)
        })

        // Note и footer после последнего шага
        tl.to(
          [noteRef.current, footerRef.current].filter(Boolean),
          { opacity: 1, y: 0, stagger: 0.25, duration: 0.5 },
          STEPS.length * stepDuration
        )
      }

    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="resume" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.island}>

          <div className={styles.header}>
            <span className={styles.label}>Этапы работы</span>
            <h2 className={styles.title}>
              На маркетплейсе побеждает не только цена, но и визуал.
              Создаю визуал, который цепляет с первого взгляда.
            </h2>
          </div>

          <div className={styles.timeline}>
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={styles.step}
                ref={el => { stepsRef.current[i] = el }}
              >
                <div className={styles.stepHead}>
                  <div className={styles.stepDot} ref={el => { dotsRef.current[i] = el }} />
                  <span className={styles.stepNum}>{step.num}</span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className={styles.stepLine} ref={el => { linesRef.current[i] = el }} />
                )}

                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepText}>{step.text}</div>
              </div>
            ))}
          </div>

          <div ref={noteRef} className={styles.note}>
            <strong>Работаю как с физическими лицами, так и с юридическими</strong> — с договором и закрывающими документами.
          </div>

          <p ref={footerRef} className={styles.footer}>
            <strong>Начинаем с одной карточки</strong> — без риска и предоплаты за весь проект. Если понравится, продолжим.
          </p>

        </div>
      </div>
    </section>
  )
}
