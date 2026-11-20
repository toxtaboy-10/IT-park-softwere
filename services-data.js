/* IT PARK SOFTWARE — services-data.js
   Each service: id, icon (Lucide), art (image), localized text, tech list.
   "projects" lists ids from projects-data.js shown as related work. */
window.ITP_SERVICES = [
  {
    id: "web", icon: "code", art: "svc-web", tech: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "WebGL"], projects: ["nova-commerce", "clinic-flow"],
    name: { uz: "Web dasturlash", ru: "Веб-разработка", en: "Web Development" },
    short: { uz: "Zamonaviy va tezkor veb-saytlar hamda web-ilovalar yaratamiz.", ru: "Создаём современные и быстрые сайты и веб-приложения.", en: "We build modern, fast websites and web applications." },
    long: {
      uz: "Korporativ saytlar, onlayn do‘konlar va murakkab web-ilovalarni noldan yaratamiz. Har bir sahifa tezlik, xavfsizlik va qulaylik talablariga mos ishlab chiqiladi.",
      ru: "Создаём с нуля корпоративные сайты, интернет-магазины и сложные веб-приложения. Каждая страница разрабатывается с учётом скорости, безопасности и удобства.",
      en: "We build corporate sites, online stores and complex web applications from scratch. Every page is engineered for speed, security and usability."
    },
    benefits: {
      uz: ["Barcha qurilmalarga moslashgan dizayn", "Yuqori yuklanish tezligi va SEO", "Kengaytirish oson bo‘lgan toza kod", "Admin panel va backend bilan integratsiya"],
      ru: ["Адаптивный дизайн для всех устройств", "Высокая скорость загрузки и SEO", "Чистый код, который легко расширять", "Интеграция с админ-панелью и backend"],
      en: ["Responsive design for every device", "Fast loading and solid SEO", "Clean code that is easy to extend", "Integration with admin panels and backends"]
    }
  },
  {
    id: "mobile", icon: "smartphone", art: "svc-mobile", tech: ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"], projects: ["pay-wallet", "fit-route"],
    name: { uz: "Mobil ilovalar", ru: "Мобильные приложения", en: "Mobile Apps" },
    short: { uz: "iOS va Android uchun innovatsion ilovalar.", ru: "Инновационные приложения для iOS и Android.", en: "Innovative apps for iOS and Android." },
    long: {
      uz: "iOS va Android uchun ishonchli mobil ilovalar yaratamiz: g‘oya va prototipdan tortib do‘konlarga joylashtirishgacha.",
      ru: "Создаём надёжные мобильные приложения для iOS и Android: от идеи и прототипа до публикации в магазинах приложений.",
      en: "We build dependable mobile apps for iOS and Android — from idea and prototype to publishing in the app stores."
    },
    benefits: {
      uz: ["Bitta kod bazasidan ikki platforma", "Silliq va tezkor interfeys", "Push-bildirishnomalar va oflayn rejim", "App Store va Google Play'ga joylash"],
      ru: ["Две платформы из одной кодовой базы", "Плавный и быстрый интерфейс", "Push-уведомления и офлайн-режим", "Публикация в App Store и Google Play"],
      en: ["Two platforms from one codebase", "Smooth, responsive interface", "Push notifications and offline mode", "App Store and Google Play publishing"]
    }
  },
  {
    id: "backend", icon: "server", art: "svc-backend", tech: ["Node.js", "Python", "PostgreSQL", "Redis", "REST", "GraphQL"], projects: ["inventory-pro", "doc-flow"],
    name: { uz: "Backend dasturlash", ru: "Backend-разработка", en: "Backend Development" },
    short: { uz: "Kuchli va ishonchli server yechimlari.", ru: "Мощные и надёжные серверные решения.", en: "Powerful and reliable server-side solutions." },
    long: {
      uz: "API, ma’lumotlar bazasi va server mantiqini loyihalaymiz. Yuklama oshganda ham barqaror ishlaydigan arxitektura quramiz.",
      ru: "Проектируем API, базы данных и серверную логику. Строим архитектуру, которая остаётся стабильной при росте нагрузки.",
      en: "We design APIs, databases and server logic, building architecture that stays stable as load grows."
    },
    benefits: {
      uz: ["Masshtablanadigan arxitektura", "Xavfsiz autentifikatsiya va rollar", "Tashqi tizimlar bilan integratsiya", "Hujjatlashtirilgan API"],
      ru: ["Масштабируемая архитектура", "Безопасная аутентификация и роли", "Интеграция с внешними системами", "Документированный API"],
      en: ["Scalable architecture", "Secure authentication and roles", "Integration with external systems", "Documented APIs"]
    }
  },
  {
    id: "ai", icon: "cpu", art: "svc-ai", tech: ["Python", "TensorFlow", "PyTorch", "OpenAI API", "LangChain"], projects: ["vision-qa", "smart-assistant"],
    name: { uz: "Sun’iy intellekt (AI)", ru: "Искусственный интеллект (AI)", en: "Artificial Intelligence (AI)" },
    short: { uz: "Aqlli texnologiyalar bilan biznesingizni rivojlantiring.", ru: "Развивайте бизнес с помощью умных технологий.", en: "Grow your business with intelligent technologies." },
    long: {
      uz: "Chat-botlar, tasvirni tahlil qilish va ma’lumotlar asosida bashorat qilish kabi AI yechimlarini biznes jarayonlariga joriy etamiz.",
      ru: "Внедряем AI-решения в бизнес-процессы: чат-боты, анализ изображений и прогнозирование на основе данных.",
      en: "We bring AI into business processes: chatbots, image analysis and data-driven forecasting."
    },
    benefits: {
      uz: ["Takroriy ishlarni avtomatlashtirish", "Ma’lumotlarga asoslangan qarorlar", "Mavjud tizimlarga integratsiya", "Aniq o‘lchanadigan natijalar"],
      ru: ["Автоматизация рутинных задач", "Решения на основе данных", "Интеграция с существующими системами", "Чётко измеримые результаты"],
      en: ["Automation of repetitive work", "Data-driven decisions", "Integration with existing systems", "Clearly measurable results"]
    }
  },
  {
    id: "cloud", icon: "cloud", art: "svc-cloud", tech: ["AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "CI/CD"], projects: ["inventory-pro"],
    name: { uz: "Cloud texnologiyalar", ru: "Облачные технологии", en: "Cloud Technologies" },
    short: { uz: "Bulutli yechimlar bilan ish samaradorligini oshiring.", ru: "Повышайте эффективность с помощью облачных решений.", en: "Boost efficiency with cloud solutions." },
    long: {
      uz: "Ilovalarni bulutga ko‘chirish, infratuzilmani sozlash va avtomatik joylashtirish (CI/CD) jarayonlarini yo‘lga qo‘yamiz.",
      ru: "Переносим приложения в облако, настраиваем инфраструктуру и выстраиваем автоматическое развёртывание (CI/CD).",
      en: "We migrate applications to the cloud, configure infrastructure and set up automated deployment (CI/CD)."
    },
    benefits: {
      uz: ["Yuklamaga qarab avtomatik masshtablash", "Zaxira nusxa va tiklash", "Infratuzilma xarajatlarini optimallashtirish", "Doimiy monitoring"],
      ru: ["Автомасштабирование под нагрузку", "Резервное копирование и восстановление", "Оптимизация затрат на инфраструктуру", "Постоянный мониторинг"],
      en: ["Automatic scaling with load", "Backups and recovery", "Optimized infrastructure costs", "Continuous monitoring"]
    }
  },
  {
    id: "design", icon: "penTool", art: "svc-design", tech: ["Figma", "Design System", "Prototyping", "User Research", "Accessibility"], projects: ["nova-commerce", "pay-wallet"],
    name: { uz: "UI/UX dizayn", ru: "UI/UX дизайн", en: "UI/UX Design" },
    short: { uz: "Foydalanuvchilar uchun mukammal interfeyslar.", ru: "Продуманные интерфейсы для пользователей.", en: "Well-crafted interfaces for your users." },
    long: {
      uz: "Foydalanuvchi tadqiqotidan dizayn tizimigacha: qulay, chiroyli va g‘oyani aniq yetkazadigan interfeyslar loyihalaymiz.",
      ru: "От исследования пользователей до дизайн-системы: проектируем удобные, красивые интерфейсы, ясно передающие идею.",
      en: "From user research to design systems, we craft interfaces that are usable, beautiful and clear."
    },
    benefits: {
      uz: ["Interaktiv prototiplar", "Yagona dizayn tizimi", "Mobil va desktop uchun maketlar", "Dasturchilarga tayyor spetsifikatsiya"],
      ru: ["Интерактивные прототипы", "Единая дизайн-система", "Макеты для мобильных и desktop", "Готовые спецификации для разработчиков"],
      en: ["Interactive prototypes", "A unified design system", "Layouts for mobile and desktop", "Developer-ready specifications"]
    }
  },
  {
    id: "security", icon: "shield", art: "svc-security", tech: ["OWASP", "Pentest", "SSL/TLS", "IAM", "Audit"], projects: ["doc-flow"],
    name: { uz: "Kiberxavfsizlik", ru: "Кибербезопасность", en: "Cybersecurity" },
    short: { uz: "Ma’lumotlaringiz xavfsizligi — bizning ustuvor vazifamiz.", ru: "Безопасность ваших данных — наш приоритет.", en: "The security of your data is our priority." },
    long: {
      uz: "Tizimlar xavfsizligini tekshiramiz, zaifliklarni aniqlaymiz va ma’lumotlarni himoya qilish choralarini joriy etamiz.",
      ru: "Проверяем безопасность систем, выявляем уязвимости и внедряем меры защиты данных.",
      en: "We assess system security, find vulnerabilities and put data protection measures in place."
    },
    benefits: {
      uz: ["Xavfsizlik auditi", "Zaifliklarni bartaraf etish", "Kirish huquqlarini boshqarish", "Xodimlarni o‘qitish tavsiyalari"],
      ru: ["Аудит безопасности", "Устранение уязвимостей", "Управление правами доступа", "Рекомендации по обучению сотрудников"],
      en: ["Security audits", "Vulnerability remediation", "Access control management", "Staff awareness recommendations"]
    }
  },
  {
    id: "consulting", icon: "users", art: "svc-consulting", tech: ["Roadmap", "Architecture", "Audit", "Agile", "Documentation"], projects: [],
    name: { uz: "IT konsalting", ru: "IT-консалтинг", en: "IT Consulting" },
    short: { uz: "Texnologik strategiya va professional maslahat.", ru: "Технологическая стратегия и профессиональные консультации.", en: "Technology strategy and professional advice." },
    long: {
      uz: "Biznes maqsadlaringizga mos texnologiyalarni tanlashga, loyiha arxitekturasini rejalashtirishga va xarajatlarni baholashga yordam beramiz.",
      ru: "Помогаем выбрать технологии под цели бизнеса, спланировать архитектуру проекта и оценить затраты.",
      en: "We help you choose technology that fits your business goals, plan project architecture and estimate costs."
    },
    benefits: {
      uz: ["Texnologiyalar bo‘yicha aniq tavsiya", "Loyiha yo‘l xaritasi", "Xavf va xarajat baholash", "Mavjud tizim auditi"],
      ru: ["Чёткие рекомендации по технологиям", "Дорожная карта проекта", "Оценка рисков и затрат", "Аудит существующих систем"],
      en: ["Clear technology recommendations", "A project roadmap", "Risk and cost estimation", "Audit of existing systems"]
    }
  },
  {
    id: "software", icon: "box", art: "svc-software", tech: [".NET", "Java", "Python", "Electron", "SQL"], projects: ["inventory-pro", "doc-flow"],
    name: { uz: "Software mahsulotlar", ru: "Программные продукты", en: "Software Products" },
    short: { uz: "Biznesingiz uchun maxsus dasturiy mahsulotlar.", ru: "Специализированные программные продукты для вашего бизнеса.", en: "Custom software products for your business." },
    long: {
      uz: "Biznes jarayonlariga moslashtirilgan ichki tizimlar, hisobot va boshqaruv dasturlarini ishlab chiqamiz.",
      ru: "Разрабатываем внутренние системы, отчётные и управленческие программы под ваши бизнес-процессы.",
      en: "We develop internal systems, reporting and management software tailored to your business processes."
    },
    benefits: {
      uz: ["Jarayonlaringizga moslashtirilgan", "Hisobotlar va tahlil", "Xodimlar uchun rollar", "Uzoq muddatli qo‘llab-quvvatlash"],
      ru: ["Под ваши процессы", "Отчёты и аналитика", "Роли для сотрудников", "Долгосрочная поддержка"],
      en: ["Tailored to your processes", "Reports and analytics", "Roles for employees", "Long-term support"]
    }
  }
];
