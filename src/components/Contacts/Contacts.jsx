import { useState } from 'react'
import { createPortal } from 'react-dom'
import PrivacyPolicyContent from './PrivacyPolicyContent'
import styles from './Contacts.module.css'

const POLICY_URL = import.meta.env.VITE_PRIVACY_POLICY_URL || '#'

const CONTACTS = [
  {
    id: 'telegram',
    title: 'Telegram',
    value: import.meta.env.VITE_CONTACT_TELEGRAM || '@your_telegram',
    href: import.meta.env.VITE_CONTACT_TELEGRAM_URL || 'https://t.me/your_telegram',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.4 4.6L3.3 11.2c-1.1.4-1 1.9.1 2.2l4.3 1.3 1.7 5.2c.3 1 1.6 1.2 2.2.4l2.4-3.1 4.7 3.5c.8.6 2 .1 2.2-.9l2.7-13.9c.2-1.2-1-2.1-2.2-1.6zM9.2 14.2l8.8-6.4-6.9 7.5-.3 2.9-1.6-4z" />
      </svg>
    ),
  },
  {
    id: 'pinterest',
    title: 'Pinterest',
    value: import.meta.env.VITE_CONTACT_PINTEREST || '@your_pinterest',
    href: import.meta.env.VITE_CONTACT_PINTEREST_URL || 'https://pinterest.com/your_profile',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.5 2 4 5.9 4 9.2c0 2.6 1 4.9 3.2 5.7.4.2.8 0 1-.4.1-.3.3-1 .4-1.3.1-.4.1-.5-.2-.9-.7-.8-1.1-1.8-1.1-3.3 0-4.2 3.1-8 8.2-8 4.5 0 7 2.7 7 6.4 0 4.8-2.1 8.8-5.3 8.8-1.7 0-2.9-1.4-2.5-3.1.5-2 .1-1.3 1.5-6.7.3-1.3.5-2.5.5-3.4 0-3.2-2.5-5.8-6.4-5.8z" />
      </svg>
    ),
  },
  {
    id: 'vk',
    title: 'VK',
    value: import.meta.env.VITE_CONTACT_VK || 'vk.com/your_profile',
    href: import.meta.env.VITE_CONTACT_VK_URL || 'https://vk.com/your_profile',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7.8c.1-.4.4-.6.9-.6h2.8c.4 0 .6.2.8.6 1 2.5 2.1 4.6 3.2 6.1.4.6.7.9 1 .9.2 0 .4-.2.4-.8V8.1c0-.6.2-.9.9-.9h2.6c.6 0 .9.3.9.9v3.2c0 1-.1 1.7.3 2 .2.2.5.1.9-.3 1.2-1.2 2.3-3 3.2-5.2.2-.5.5-.7 1-.7h2.8c.5 0 .8.1.9.4.1.3.1.6-.1 1-1 2.3-2.1 4.1-3.4 5.5-.4.5-.5.8 0 1.4.8.9 1.7 1.8 2.5 3 .3.4.4.8.2 1.2-.2.3-.5.4-.9.4h-3.1c-.5 0-.8-.2-1.1-.6-.8-1-1.4-1.7-2-2.1-.4-.3-.7-.4-.9-.3-.2.1-.3.4-.3.9v1.2c0 .6-.3.9-.9.9h-1.6c-1.3 0-2.7-.4-4.1-1.3-1.7-1.1-3.2-2.8-4.6-5.1C4 11.9 3.4 10 3 8.4c-.1-.2-.1-.4 0-.6z" />
      </svg>
    ),
  },
  {
    id: 'new',
    title: import.meta.env.VITE_CONTACT_FOURTH_TITLE || 'Скоро',
    value: import.meta.env.VITE_CONTACT_FOURTH || 'Новый канал в работе',
    href: import.meta.env.VITE_CONTACT_FOURTH_URL || 'https://example.com',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l2.1 4.7L19 9l-3.6 3.3.9 4.8L12 14.8 7.7 17l.9-4.8L5 9l4.9-1.3L12 3zm-.8 8.1v2h-2v1.8h2v2h1.6v-2h2v-1.8h-2v-2h-1.6z" />
      </svg>
    ),
  },
]

function ContactCard({ id, title, value, href, icon }) {
  return (
    <a className={styles.card} href={href} target="_blank" rel="noreferrer">
      <span className={`${styles.cardIcon} ${styles[`cardIcon_${id}`] || ''}`}>
        {icon}
      </span>
      <div className={styles.cardText}>
        <span className={styles.cardTitle}>{title}</span>
        <span className={styles.cardValue}>{value}</span>
      </div>
    </a>
  )
}

function PolicyModal({ onClose }) {
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Политика конфиденциальности</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <PrivacyPolicyContent />
        </div>
      </div>
    </div>,
    document.body
  )
}

function SuccessModal({ onClose }) {
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.successContent} onClick={e => e.stopPropagation()}>
        <div className={styles.successIcon}>🚀</div>
        <h3 className={styles.successTitle}>Успешно отправлено!</h3>
        <p className={styles.successText}>
          Спасибо за доверие. Я уже получил ваше сообщение и отвечу в течение часа.
        </p>
        <button className={styles.successBtn} onClick={onClose}>
          Вернуться на сайт
        </button>
      </div>
    </div>,
    document.body
  )
}

export default function Contacts() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    let numbers = value.replace(/\D/g, '');
    
    if (!numbers) {
      setPhone('');
      return;
    }

    // Force all Rus numbers to +7
    if (numbers[0] === '8' || numbers[0] === '9') {
      if (numbers[0] === '9') numbers = '7' + numbers;
      else numbers = '7' + numbers.substring(1);
    } else if (numbers[0] !== '7') {
      numbers = '7' + numbers;
    }

    let result = '+7';
    if (numbers.length > 1) {
      result += ' (' + numbers.substring(1, 4);
    }
    if (numbers.length >= 5) {
      result += ') ' + numbers.substring(4, 7);
    }
    if (numbers.length >= 8) {
      result += ' ' + numbers.substring(7, 9);
    }
    if (numbers.length >= 10) {
      result += ' ' + numbers.substring(9, 11);
    }
    
    setPhone(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Получаем токены из .env (Vite использует import.meta.env)
    const token = import.meta.env.VITE_TG_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TG_CHAT_ID;
    
    if (!token || !chatId) {
      console.warn("Пожалуйста, добавьте VITE_TG_BOT_TOKEN и VITE_TG_CHAT_ID в файл .env");
      alert("Данные бота не настроены в проекте. См. консоль.");
      setIsSubmitting(false);
      return;
    }
    
    const text = `🚀 Новая заявка!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n✉️ Email: ${email || "Не указан"}`;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
        }),
      });
      
      if (response.ok) {
        setShowSuccess(true);
        setName('');
        setPhone('');
        setEmail('');
      } else {
        alert("Произошла ошибка при отправке. Пожалуйста, попробуйте связаться другим способом.");
      }
    } catch (error) {
      alert("Произошла ошибка сети. Пожалуйста, проверьте подключение интернета.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <div className={styles.layout}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Имя *</span>
                <input 
                  className={styles.input} 
                  name="name" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя" 
                  pattern="^[A-Za-zА-Яа-яЁё\s\-]{2,}$"
                  title="Введите ваше имя (только буквы, минимум 2 символа)"
                  required 
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Телефон *</span>
                <input 
                  className={styles.input} 
                  name="phone" 
                  type="tel" 
                  placeholder="+7 (___) ___-__-__" 
                  value={phone}
                  onChange={handlePhoneChange}
                  title="Введите корректный номер телефона"
                  required 
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input 
                  className={styles.input} 
                  name="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email (необязательно)" 
                />
              </label>

              <button className={styles.submit} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </button>
              <p className={styles.agreement}>
                Нажимая кнопку, я даю согласие на обработку моих персональных данных в соответствии c{' '}
                <button 
                  type="button" 
                  className={styles.policyBtn}
                  onClick={() => setIsPolicyOpen(true)}
                >
                  Политикой конфиденциальности
                </button>
              </p>
            </form>

            <div className={styles.cards}>
              {CONTACTS.map((item) => (
                <ContactCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isPolicyOpen && <PolicyModal onClose={() => setIsPolicyOpen(false)} />}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </section>
  )
}
