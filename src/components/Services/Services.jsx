import styles from './Services.module.css'

const SceneDesign = () => (
  <svg className={styles.scene} viewBox="0 0 200 140" fill="none">
    <rect width="200" height="140" fill="#101114"/>
    <rect className={styles.designCard} x="16" y="14" width="88" height="112" rx="10" fill="#15171b" stroke="#22c55e" strokeWidth="1.2"/>
    <rect className={styles.designScreen} x="24" y="22" width="72" height="40" rx="5" fill="#22c55e14" stroke="#22c55e" strokeWidth="0.9"/>
    <rect x="30" y="30" width="20" height="24" rx="3" fill="#22c55e1f"/>
    <line x1="56" y1="34" x2="88" y2="34" stroke="#22c55e" strokeWidth="1" opacity="0.7"/>
    <line x1="56" y1="42" x2="84" y2="42" stroke="#22c55e" strokeWidth="1" opacity="0.5"/>
    <line x1="56" y1="50" x2="78" y2="50" stroke="#22c55e" strokeWidth="1" opacity="0.35"/>
    <line x1="24" y1="74" x2="96" y2="74" stroke="#22c55e" strokeWidth="1.4"/>
    <line x1="24" y1="86" x2="90" y2="86" stroke="#22c55e" strokeWidth="1" opacity="0.6"/>
    <line x1="24" y1="98" x2="82" y2="98" stroke="#22c55e" strokeWidth="1" opacity="0.45"/>
    <line x1="24" y1="110" x2="76" y2="110" stroke="#22c55e" strokeWidth="1" opacity="0.35"/>
    <rect className={styles.designKpi1} x="124" y="18" width="60" height="18" rx="4" fill="#22c55e16" stroke="#22c55e" strokeWidth="1"/>
    <text className={styles.designText1} x="132" y="30" fontSize="8" fill="#22c55e" fontFamily="sans-serif">УТП</text>
    <rect className={styles.designKpi2} x="124" y="50" width="60" height="18" rx="4" fill="#22c55e16" stroke="#22c55e" strokeWidth="1"/>
    <text className={styles.designText2} x="132" y="62" fontSize="8" fill="#22c55e" fontFamily="sans-serif">CTR</text>
    <rect className={styles.designKpi3} x="124" y="82" width="60" height="18" rx="4" fill="#22c55e16" stroke="#22c55e" strokeWidth="1"/>
    <text className={styles.designText3} x="130" y="94" fontSize="8" fill="#22c55e" fontFamily="sans-serif">Конверсия</text>
    <line className={styles.designFlow} x1="104" y1="27" x2="124" y2="27" stroke="#22c55e" strokeWidth="1"/>
    <line className={styles.designFlow} x1="104" y1="59" x2="124" y2="59" stroke="#22c55e" strokeWidth="1"/>
    <line className={styles.designFlow} x1="104" y1="91" x2="124" y2="91" stroke="#22c55e" strokeWidth="1"/>
  </svg>
)

const SceneAI = () => (
  <svg className={styles.scene} viewBox="0 0 200 140" fill="none">
    <rect width="200" height="140" fill="#0f1114"/>
    <rect x="16" y="22" width="96" height="42" rx="6" fill="#171a1f" stroke="#22c55e" strokeWidth="1"/>
    <text className={styles.aiText1} x="24" y="37" fontSize="8" fill="#22c55e" fontFamily="sans-serif">prompt:</text>
    <text className={styles.aiText2} x="24" y="49" fontSize="7" fill="#8dd5a8" fontFamily="sans-serif">studio light, product shot</text>
    <text className={styles.aiText3} x="24" y="58" fontSize="7" fill="#8dd5a8" fontFamily="sans-serif">clean shadows, premium</text>
    <line className={styles.aiArrow} x1="118" y1="43" x2="142" y2="43" stroke="#22c55e" strokeWidth="1.5"/>
    <polygon className={styles.aiArrowHead} points="142,38 151,43 142,48" fill="#22c55e"/>
    <rect x="156" y="16" width="28" height="56" rx="4" fill="#16191d" stroke="#22c55e" strokeWidth="1"/>
    <rect x="161" y="22" width="18" height="22" rx="3" fill="#22c55e22"/>
    <line x1="161" y1="50" x2="179" y2="50" stroke="#22c55e" strokeWidth="1" opacity="0.6"/>
    <line x1="161" y1="57" x2="175" y2="57" stroke="#22c55e" strokeWidth="1" opacity="0.4"/>
    <rect x="24" y="84" width="152" height="40" rx="8" fill="#171a1f" stroke="#22c55e" strokeWidth="1"/>
    <rect className={styles.aiTile1} x="30" y="90" width="42" height="28" rx="4" fill="#22c55e1f"/>
    <rect className={styles.aiTile2} x="78" y="90" width="42" height="28" rx="4" fill="#22c55e26"/>
    <rect className={styles.aiTile3} x="126" y="90" width="42" height="28" rx="4" fill="#22c55e1a"/>
    <text className={styles.aiText4} x="34" y="107" fontSize="7" fill="#22c55e" fontFamily="sans-serif">SCENE</text>
    <text className={styles.aiText5} x="82" y="107" fontSize="7" fill="#22c55e" fontFamily="sans-serif">LOOK</text>
    <text className={styles.aiText6} x="130" y="107" fontSize="7" fill="#22c55e" fontFamily="sans-serif">STYLE</text>
  </svg>
)

const SceneCamera = () => (
  <svg className={styles.scene} viewBox="0 0 200 140" fill="none">
    <rect width="200" height="140" fill="#111317"/>
    <rect x="16" y="18" width="72" height="90" rx="10" fill="#1a1c20" stroke="#3a3d44" strokeWidth="1.2"/>
    <circle className={styles.cameraLensOuter} cx="52" cy="58" r="20" fill="#101217" stroke="#22c55e" strokeWidth="1.2"/>
    <circle className={styles.cameraLensMid} cx="52" cy="58" r="12" fill="#0b0d11" stroke="#4a4f58" strokeWidth="1"/>
    <circle className={styles.cameraLensCore} cx="52" cy="58" r="4" fill="#22c55e80"/>
    <rect x="32" y="86" width="40" height="14" rx="4" fill="#22c55e16" stroke="#22c55e" strokeWidth="0.8"/>
    <text className={styles.cameraText1} x="39" y="95" fontSize="7" fill="#22c55e" fontFamily="sans-serif">RAW</text>
    <line className={styles.cameraArrow} x1="96" y1="63" x2="118" y2="63" stroke="#22c55e" strokeWidth="1.4"/>
    <polygon className={styles.cameraArrowHead} points="118,58 126,63 118,68" fill="#22c55e"/>
    <rect x="130" y="22" width="54" height="82" rx="8" fill="#171a1f" stroke="#22c55e" strokeWidth="1"/>
    <rect x="137" y="30" width="40" height="24" rx="4" fill="#22c55e1f"/>
    <line x1="137" y1="63" x2="177" y2="63" stroke="#22c55e" strokeWidth="1" opacity="0.65"/>
    <line x1="137" y1="71" x2="170" y2="71" stroke="#22c55e" strokeWidth="1" opacity="0.45"/>
    <line x1="137" y1="79" x2="164" y2="79" stroke="#22c55e" strokeWidth="1" opacity="0.35"/>
    <rect className={styles.cameraTag} x="137" y="86" width="24" height="10" rx="3" fill="#22c55e24"/>
    <text className={styles.cameraText2} x="141" y="93" fontSize="6.5" fill="#22c55e" fontFamily="sans-serif">AI MIX</text>
  </svg>
)

const SceneAnimate = () => (
  <svg className={styles.scene} viewBox="0 0 200 140" fill="none">
    <rect width="200" height="140" fill="#101216"/>
    <rect x="14" y="16" width="172" height="108" rx="10" fill="#171a1f" stroke="#3a3f46" strokeWidth="1.2"/>

    {/* before frame */}
    <rect className={styles.animBefore} x="24" y="30" width="56" height="42" rx="6" fill="#12151a" stroke="#3a3f46" strokeWidth="1"/>
    <circle cx="39" cy="42" r="4" fill="#22c55e2a"/>
    <line x1="32" y1="58" x2="72" y2="58" stroke="#4a4f58" strokeWidth="1"/>
    <line x1="32" y1="64" x2="66" y2="64" stroke="#4a4f58" strokeWidth="1" opacity="0.7"/>
    <text className={styles.animText1} x="33" y="78" fontSize="6.5" fill="#7e8794" fontFamily="sans-serif">до</text>

    {/* after frame */}
    <rect className={styles.animAfter} x="120" y="30" width="56" height="42" rx="6" fill="#12151a" stroke="#22c55e" strokeWidth="1"/>
    <circle cx="135" cy="42" r="4" fill="#22c55e66"/>
    <line x1="128" y1="58" x2="168" y2="58" stroke="#22c55e" strokeWidth="1"/>
    <line x1="128" y1="64" x2="162" y2="64" stroke="#22c55e" strokeWidth="1" opacity="0.75"/>
    <text className={styles.animText2} x="129" y="78" fontSize="6.5" fill="#22c55e" fontFamily="sans-serif">после</text>

    {/* transform arrow */}
    <line className={styles.animArrow} x1="86" y1="51" x2="114" y2="51" stroke="#22c55e" strokeWidth="1.4"/>
    <polygon className={styles.animArrowHead} points="114,46 122,51 114,56" fill="#22c55e"/>

    {/* timeline */}
    <rect x="24" y="86" width="152" height="24" rx="6" fill="#12151a" stroke="#3a3f46" strokeWidth="1"/>
    <rect className={styles.animFrame1} x="32" y="92" width="20" height="12" rx="3" fill="#22c55e1f"/>
    <rect className={styles.animFrame2} x="56" y="92" width="20" height="12" rx="3" fill="#22c55e2f"/>
    <rect className={styles.animFrame3} x="80" y="92" width="20" height="12" rx="3" fill="#22c55e3f"/>
    <rect className={styles.animFrame4} x="104" y="92" width="20" height="12" rx="3" fill="#22c55e55"/>
    <rect className={styles.animFrame5} x="128" y="92" width="20" height="12" rx="3" fill="#22c55e70"/>
    <circle className={styles.animPlay} cx="156" cy="98" r="7" fill="#22c55e"/>
    <polygon points="154,94 154,102 160,98" fill="#101216"/>
  </svg>
)

const SERVICES = [
  {
    id: 1, Scene: SceneDesign,
    title: 'Дизайн и инфографика',
    description: 'Создаю продающую структуру слайдов, выделяю УТП товара и закрываю боли покупателей через грамотный визуал.',
    tags: ['Ozon', 'Wildberries', 'Анализ конкурентов'],
    href: '#works-design',
  },
  {
    id: 2, Scene: SceneAI,
    title: 'AI-фотосессии',
    description: 'Генерирую реалистичные фоны и сцены с помощью нейросетей. Помещаю ваш товар в любой интерьер без студийных съемок.',
    tags: ['Nano Banana 2', 'Prompt-инжиниринг', 'AI-сцены'],
    href: '#works-ai-photo',
  },
  {
    id: 3, Scene: SceneCamera,
    title: 'Предметная съёмка + AI',
    description: 'Профессионально фотографирую ваш продукт (макро, нужные ракурсы) и интегрирую его в сгенерированное AI-окружение.',
    tags: ['Предметная съёмка', 'Макро', 'Композинг'],
    href: '#works-photo',
  },
  {
    id: 4, Scene: SceneAnimate,
    title: 'Оживление фото',
    description: 'Создаю динамичные видеообложки и анимирую элементы на фото, чтобы карточка привлекала максимум внимания.',
    tags: ['Видеообложки', 'DaVinci Resolve', 'Анимация'],
    href: '#works-animation',
  },
]

function ServiceCard({ Scene, title, description, tags, href }) {
  const SceneComponent = Scene

  return (
    <a href={href} className={`${styles.card} ${styles.cardLink}`}>
      <div className={styles.sceneWrap}>
        <SceneComponent />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
          <svg className={styles.arrow} width="20" height="20" viewBox="0 0 20 20"
            fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="10" x2="17" y2="10"/>
            <polyline points="11,4 17,10 11,16"/>
          </svg>
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.tags}>
          {tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </a>
  )
}

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.island}>
          <div className={styles.header}>
            <p className={styles.subtitle}>Полный цикл работы с визуалом для маркетплейсов</p>
          </div>
          <div className={styles.grid}>
            {SERVICES.map(s => <ServiceCard key={s.id} {...s} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
