# IT PARK SOFTWARE — corporate website (frontend)

Premium dark-mode, 7-page website for a software company. Plain **HTML5 + CSS3 + JavaScript (ES6+)**, no framework.
Languages: **O‘zbek (UZ) / Русский (RU) / English (EN)**.

## Ishga tushirish (VS Code + Live Server)

1. Papkani VS Code'da oching (`File → Open Folder → IT-PARK-SOFTWARE`).
2. **Live Server** kengaytmasini o‘rnating (Ritwick Dey).
3. `index.html` ustida o‘ng tugma → **Open with Live Server**.

> Fayllarni `file://` orqali ochmang — Live Server yoki boshqa lokal server (`npx serve`, `python -m http.server`) ishlating.
> Sayt internet bilan ishlaydi: GSAP, Three.js, Swiper va Google Fonts CDN orqali yuklanadi. CDN bo‘lmasa sayt baribir ishlaydi (animatsiyasiz / 3D o‘rniga SVG rasm bilan).

## Sahifalar

| Sahifa | Fayl |
|---|---|
| Bosh sahifa | `index.html` |
| Biz haqimizda | `about.html` |
| Xizmatlar (modal + buyurtma formasi) | `services.html` |
| Loyihalar (filtrlar + modal) | `projects.html` |
| Yangiliklar (filtr + sahifalash + modal) | `news.html` |
| Jamoamiz | `team.html` |
| Kontakt | `contact.html` |

Header va Footer barcha sahifalarda bitta joydan (`js/components.js`) chiqariladi.

## Tuzilma

```
css/        main.css (tokenlar, header/footer) · components.css · animations.css · responsive.css
js/         main.js (ishga tushirish) · language.js (i18n) · components.js (header/footer) · navigation.js (menyu + Modal)
            animations.js (GSAP) · hero3d.js (Three.js) · services.js · projects.js · news.js · team.js · contact.js
            icons.js (Lucide ikonalari, lokal) · config.js (sozlamalar)
js/data/    translations.js (UZ/RU/EN) · services-data.js · projects-data.js · news-data.js · team-data.js
assets/     images/ (SVG rasmlar, logotip) · icons/ · fonts/ · 3d/
```

## Nimani o‘zgartirish kerak (`js/config.js`)

- `telegramUrl` va `socials.telegram` — hozir `https://t.me/YOUR_USERNAME` (o‘zingiznikiga almashtiring).
- `contacts.phone`, `contacts.email`, `contacts.address`, `contacts.mapEmbedUrl` — bo‘sh bo‘lsa sahifada neytral "qo‘shiladi" yozuvi chiqadi.
- `socials.instagram / linkedin / github` — bo‘sh bo‘lsa ikonka o‘chirilgan ko‘rinishda turadi.

## Matnlar va ma’lumotlar

- Barcha interfeys matnlari: `js/data/translations.js` (bitta markaziy i18n). Tanlangan til `localStorage` da saqlanadi.
- Xizmatlar: `services-data.js`. Loyihalar: `projects-data.js`. Yangiliklar: `news-data.js`. Jamoa: `team-data.js`.
- **Namunaviy (demo) ma’lumotlar:** loyihalar va yangiliklar "Demo" deb belgilangan; statistika raqamlari (`data-count` atributi, `index.html` / `about.html`), kompaniya tarixi va hamkor logotiplari o‘rinbosar. Jamoa kartalarida uydirma shaxslar yo‘q — ism/rasm/ijtimoiy havolalarni `team-data.js` ga kiriting.

## Formalar va backend (keyinroq ulash)

Buyurtma formasi (xizmat modali ichida) va aloqa formasi to‘liq validatsiya qilinadi. **Backend ulanmaguncha "yuborildi" degan soxta xabar ko‘rsatilmaydi** — foydalanuvchiga Telegram orqali yuborish taklif qilinadi (matn nusxalanadi, Telegram ochiladi).

Backend tayyor bo‘lganda `js/config.js` da manzillarni kiriting:

```js
api: {
  orderEndpoint:   "https://api.example.uz/orders",
  contactEndpoint: "https://api.example.uz/contact",
  newsEndpoint:    "https://api.example.uz/news"   // keyingi bosqich
}
```

Formalar `POST` + JSON yuboradi: `{ type, lang, fields: {...}, page, createdAt }`. Yangiliklar uchun `js/news.js` ichidagi `getNews()` funksiyasini API chaqiruviga almashtirish yetarli. Admin panel keyingi bosqichda alohida qo‘shiladi.

## Texnologiyalar

GSAP + ScrollTrigger (animatsiyalar), Three.js r128 (bosh sahifa 3D kompozitsiyasi), Swiper 11 (loyihalar karuseli), Lucide ikonalari (`js/icons.js` ichida lokal), Onest shrifti (Google Fonts).
Animatsiyalar `prefers-reduced-motion` va mobil ekranlarda kamaytiriladi.
