import { FaTelegramPlane, FaPinterestP, FaVk } from 'react-icons/fa'
import styles from './Contacts.module.css'

const CONTACTS = [
  {
    id: 'telegram',
    title: 'Telegram',
    value: import.meta.env.VITE_CONTACT_TELEGRAM || '@muntyanu_design',
    href: import.meta.env.VITE_CONTACT_TELEGRAM_URL || 'https://t.me/muntyanu_design',
    icon: <FaTelegramPlane />,
  },
  {
    id: 'pinterest',
    title: 'Pinterest',
    value: import.meta.env.VITE_CONTACT_PINTEREST || '@muntyanu_design',
    href: import.meta.env.VITE_CONTACT_PINTEREST_URL || 'https://www.pinterest.com/muntyanu_design/_created',
    icon: <FaPinterestP />,
  },
  {
    id: 'vk',
    title: 'VK',
    value: import.meta.env.VITE_CONTACT_VK || '@muntyanu_design',
    href: import.meta.env.VITE_CONTACT_VK_URL || 'https://vk.com/muntyanu_design',
    icon: <FaVk />,
  },
]

function ContactCard({ id, title, value, href, icon }) {
  return (
    <a className={styles.card} href={href} target="_blank" rel="noreferrer">
      <span className={`${styles.cardIcon} ${styles[`cardIcon_${id}`]}`}>
        {icon}
      </span>
      <div className={styles.cardText}>
        <span className={styles.cardTitle}>{title}</span>
        <span className={styles.cardValue}>{value}</span>
      </div>
    </a>
  )
}

export default function Contacts() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.island}>
          <div className={styles.head}>
            <h2 className={styles.title}>Обсудим ваш проект и запустим работу</h2>
            <p className={styles.lead}>
              Напишите в удобный канал. Отвечаю быстро и предлагаю понятный план с сроками.
            </p>
          </div>

          <div className={styles.cards}>
            {CONTACTS.map((item) => (
              <ContactCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
