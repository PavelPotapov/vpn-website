# VPN Website — Design Strategy

## MVP Sitemap

```
/                   → Home (лендинг)
/pricing            → Тарифы и оплата
/features           → Возможности и протоколы
/about              → О сервисе
/support            → FAQ + контакты (можно объединить с About на MVP)
```

**MVP (делаем сейчас):** Home, Pricing, Features
**Следующая итерация:** About, Support/FAQ (отдельные страницы)
**Будущее:** Blog, Knowledge Base, Server Status, Changelog, Личный кабинет

**Рекомендация:** Support/FAQ на MVP встраиваем секциями в Home и Pricing. Отдельную страницу About можно отложить — её контент размазываем по Home (trust section) и footer. Это сокращает объём работы без потери конверсии.

---

## Design Directions

### Direction A — "Cloud Walk" (airy, minimal)
Максимально воздушный. Белый фон, еле заметные голубые градиенты, мягкие формы. Иллюстрации — абстрактные облачные формы с лёгким движением. Минимум элементов, максимум воздуха.

### Direction B — "Sky City" (playful, illustrated)
Иллюстративный стиль с элементами городского пейзажа — силуэты зданий, маршруты сигнала, лёгкие линии движения. Может быть маленький персонаж (маскот), но не обязательно. Более тёплый, дружелюбный.

### Direction C — "Clear Signal" (premium, tech-light)
Чуть более технологичный. Чистые линии, геометрические формы, тонкие градиенты. Акцент на данных и цифрах. Ощущение "premium tool", но без холода. Светлый, но с чёткой струк��урой.

**Рекомендация:** Direction A как основа, элементы B для иллюстраций. Direction C оставить для будущего личного кабинета.

---

## Color Palettes

### Palette A — Airy Minimal
| Token | Hex | Описание |
|-------|-----|----------|
| background | `#F8FBFF` | Чуть голубоватый белый |
| foreground | `#1A2332` | Тёмно-синий для текста |
| primary | `#3B9BF5` | Небесно-голубой (CTA) |
| primary-foreground | `#FFFFFF` | Белый на кнопках |
| secondary | `#EDF4FC` | Очень светло-голубой |
| secondary-foreground | `#1A2332` | Тёмный текст |
| muted | `#F0F5FA` | Фон карточек |
| muted-foreground | `#6B7D93` | Вторичный текст |
| accent | `#5AC8D8` | Mint/aqua акцент |
| accent-foreground | `#FFFFFF` | |
| card | `#FFFFFF` | Белые карточки |
| card-foreground | `#1A2332` | |
| border | `#E2EBF3` | Мягкая граница |
| destructive | `#EF4444` | Ошибки |
| ring | `#3B9BF5` | Focus ring |

### Palette B — Playful Illustrated
| Token | Hex | Описание |
|-------|-----|----------|
| background | `#F5F9FF` | Тёплый светло-голубой |
| foreground | `#1E293B` | Slate тёмный |
| primary | `#4DA3FF` | Яркий голубой |
| secondary | `#E8F3FF` | Лёгкий голубой фон |
| muted | `#F1F6FC` | |
| muted-foreground | `#64748B` | |
| accent | `#38D9A9` | Мятный зелёный |
| border | `#D8E6F5` | |

### Palette C — Premium Tech-Light
| Token | Hex | Описание |
|-------|-----|----------|
| background | `#FAFCFF` | Почти белый |
| foreground | `#0F172A` | Глубокий тёмный |
| primary | `#2B7FE0` | Уверенный синий |
| secondary | `#F1F5F9` | Нейтральный серый |
| muted | `#F8FAFC` | |
| muted-foreground | `#475569` | |
| accent | `#06B6D4` | Cyan акцент |
| border | `#E2E8F0` | |

### Dark Mode (единый для всех палитр)
| Token | Hex |
|-------|-----|
| background | `#0C1222` |
| foreground | `#E8EDF5` |
| primary | `#5AADFF` |
| secondary | `#1A2744` |
| muted | `#152033` |
| muted-foreground | `#8899AC` |
| accent | `#5AC8D8` |
| card | `#131D30` |
| border | `#1E3050` |

---

## Typography

### Пара 1 (рекомендуется)
- **Заголовки:** Inter (weight 600-700) — современный, чистый, чуть округлый
- **Текст:** Inter (weight 400-500) — тот же шрифт, идеальная читаемость

### Пара 2
- **Заголовки:** Plus Jakarta Sans (weight 600-700) — мягче, дружелюбнее
- **Текст:** Inter (weight 400)

### Пара 3
- **Заголовки:** DM Sans (weight 600-700) — геометричный, уверенный
- **Текст:** Inter (weight 400)

**Рекомендация:** Пара 1 (Inter everywhere). Один шрифт = меньше бандл, проще система. Inter отлично работает на всех размерах.

---

## UI Design System

### Кнопки
- **Primary:** `bg-primary text-white`, rounded-xl (12px), h-11 px-6
- **Secondary:** `bg-secondary text-foreground`, rounded-xl
- **Ghost:** transparent, hover: bg-muted
- **Hover:** scale(1.02) + shadow-md, transition 200ms
- **Active:** scale(0.98)
- **Большая CTA:** h-14 px-8 text-lg rounded-2xl, gradient shadow

### Карточки
- `bg-card`, rounded-2xl (16px), shadow-sm
- Hover: shadow-md + translateY(-2px)
- Padding: p-6 md:p-8
- Border: 1px solid border (опционально, без border тоже красиво)

### Бейджи
- Маленькие: px-2.5 py-0.5 rounded-full text-xs
- "Popular"/"Recommended": bg-primary/10 text-primary
- "New": bg-accent/10 text-accent

### Иконки
- Lucide React, size 20-24px
- Для features: в кружочках bg-primary/10 p-3 rounded-xl

### Радиусы
- Кнопки: rounded-xl (12px)
- Карточки: rounded-2xl (16px)
- Бейджи: rounded-full
- Inputs: rounded-lg (8px)
- Модалки: rounded-2xl

### Тени
- sm: `0 1px 3px rgba(0,0,0,0.04)`
- md: `0 4px 16px rgba(0,0,0,0.06)`
- lg: `0 8px 32px rgba(0,0,0,0.08)`
- Без тяжёлых теней, всё мягкое

### Градиенты
- Hero фон: linear-gradient(180deg, #F0F7FF 0%, #FFFFFF 100%)
- CTA кнопка glow: box-shadow с primary/20
- Секции: чередование bg-background и bg-muted

---

## Pages

### HOME — структура секций

**1. Hero**
- Заголовок: "Интернет без границ" / "Internet Without Limits"
- Подзаголовок: "Быстрый VPN с современными протоколами. Подключение в один клик." / "Fast VPN with modern protocols. Connect in one click."
- CTA primary: "Начать" / "Get Started"
- CTA secondary: "Узнать больше" / "Learn More"
- Визуал: абстрактная облачная иллюстрация с линиями движения, мягкий градиент

**2. Trust Bar**
- 3-4 метрики в ряд: "99.9% uptime", "50+ серверов", "5 протоколов", "24/7 поддержка"
- Мелкий текст, иконки, горизонтальная полоска

**3. Why Us (benefits grid)**
- 6 карточек в grid 2x3 (md) или 1 колонка (mobile)
- Скорость: "Протоколы нового поколения для максимальной скорости"
- Стабильность: "Автопереключение между серверами при сбоях"
- Простота: "Один клик — и вы защищены"
- Приватность: "Без логов, без отслеживания"
- Платформы: "Windows, Android, iOS, Linux"
- Поддержка: "Живая помощь в Telegram"

**4. Protocols Preview**
- Tabs или horizontal scroll карточек
- AmneziaWG: "Обход блокировок + скорость WireGuard"
- WireGuard: "Стандарт индустрии, минимальный пинг"
- VLESS/XRay: "Маскировка трафика под обычный HTTPS"
- Каждый: иконка + 1 предложение + badge "Рекомендуем" для AmneziaWG

**5. Pricing Teaser**
- 2-3 карточки тарифов (краткие)
- Выделить средний как "Популярный"
- CTA: "Выбрать тариф"

**6. FAQ Snippet**
- 4-5 частых вопросов в accordion
- "Как начать?", "Какие протоколы поддерживаются?", "Можно ли использовать на нескольких устройствах?", "Как работает поддержка?"

**7. Final CTA**
- Большой блок с градиентным фоном
- "Готовы начать?" / "Ready to start?"
- Повтор главной CTA кнопки

**8. Footer**
- Логотип, навигация, соц.сети (Telegram), copyright
- Ссылки: Home, Features, Pricing, Support, Privacy Policy, Terms

---

### PRICING — структура секций

**1. Hero**
- "Выберите свой тариф" / "Choose Your Plan"
- "Простые тарифы без скрытых условий"

**2. Plan Cards**
- **Starter** (1 месяц): базовая цена, 3 устройства
- **Standard** (6 месяцев): скидка, 5 устройств, badge "Популярный"
- **Pro** (12 месяцев): максимальная скидка, 10 устройств

Каждая карточка:
- Название тарифа
- Цена / месяц + полная цена
- Кол-во устройств
- Список включённого (все протоколы, поддержка, без логов)
- CTA кнопка

**3. What's Included**
- Все протоколы
- Все платформы
- Поддержка в Telegram
- Без ограничений трафика
- Без логов

**4. FAQ**
- Вопросы об оплате, активации, возврате

**5. Final CTA**

---

### FEATURES — структура секций

**1. Hero**
- "Почему наш VPN быстрее и надёжнее" / "Why Our VPN is Faster and More Reliable"

**2. Speed & Stability**
- Визуал: график/метрика скорости
- Объяснение протоколов без жаргона

**3. Protocols Deep Dive**
- Развёрнутые карточки для каждого протокола
- Для кого, когда использовать, в чём преимущество

**4. Privacy**
- No-logs policy
- Шифрование
- Open source протоколы

**5. Platforms**
- Windows, Android, iOS, Linux
- Скриншоты приложений

**6. CTA → Pricing**

---

## How to Use in Development

### Делаем сейчас:
1. Переключить тему на light-first (CSS variables для light + dark)
2. Theme switcher (light/dark/system)
3. Home page — все 8 секций
4. Pricing page — базовая структура
5. Навигация (header + footer)

### Следующая итерация:
1. Features page
2. About page
3. Анимации (Motion)
4. Иллюстрации
5. Мобильная адаптация (polish)

### Позже:
1. Blog
2. Knowledge Base
3. Server Status
4. Личный кабинет
