# Hired Creative Ops

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <em>Компании используют ИИ, чтобы отбирать кандидатов. Теперь у креативных специалистов есть ИИ, чтобы <em>выбирать</em> компании.</em><br>
  Форк проекта <a href="https://github.com/santifer/career-ops">career-ops</a>, переориентированный на креативных директоров, дизайнеров, копирайтеров и другие креативные роли.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-111827?style=flat&logo=terminal&logoColor=white" alt="OpenCode">
  <img src="https://img.shields.io/badge/Gemini_CLI-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini CLI">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
  <br>
  <img src="https://img.shields.io/badge/EN-blue?style=flat" alt="EN">
  <img src="https://img.shields.io/badge/ES-red?style=flat" alt="ES">
  <img src="https://img.shields.io/badge/PT--BR-green?style=flat" alt="PT-BR">
  <img src="https://img.shields.io/badge/KO-white?style=flat" alt="KO">
  <img src="https://img.shields.io/badge/JA-red?style=flat" alt="JA">
  <img src="https://img.shields.io/badge/RU-blue?style=flat" alt="RU">
  <img src="https://img.shields.io/badge/ZH--CN-red?style=flat" alt="ZH-CN">
  <img src="https://img.shields.io/badge/ZH--TW-blue?style=flat" alt="ZH-TW">
</p>

---

## Что это

Hired Creative Ops превращает любой ИИ-CLI-инструмент для разработки в полноценный командный центр поиска работы для креативных специалистов — креативных директоров, арт-директоров, продуктовых/бренд/моушн-дизайнеров, копирайтеров. Вместо ручного ведения таблицы с откликами вы получаете ИИ-пайплайн, который:

- **Оценивает вакансии** по структурированной системе A-F (10 взвешенных параметров)
- **Генерирует персонализированные PDF** — резюме, оптимизированные под ATS, адаптированные под каждое описание вакансии
- **Сканирует порталы** автоматически (Greenhouse, Ashby, Lever, страницы компаний) — плюс встроенная интеграция с [Hired Creative](https://hiredcreative.com), бесплатным агрегатором удалённых креативных вакансий
- **Обрабатывает пакетно** — оценка 10+ вакансий параллельно через суб-агентов
- **Трекает всё** в единой точке правды с проверками целостности

> **Важно: это НЕ инструмент для массовой рассылки откликов.** Hired Creative Ops — это фильтр: он помогает найти те немногие вакансии, которые стоят вашего времени, среди сотен. Система настоятельно не рекомендует откликаться на вакансии с оценкой ниже установленного вами порога качества. Ваше время ценно, как и время рекрутера. Всегда проверяйте перед отправкой.

Hired Creative Ops — агентная система: Claude Code перемещается по карьерным страницам через Playwright, оценивает соответствие, анализируя ваше CV и портфолио в сопоставлении с описанием вакансии (а не просто подбирая ключевые слова), и адаптирует резюме под каждое объявление.

> **Учтите: первые оценки не будут идеальными.** Система пока вас не знает. Дайте ей контекст — ваше CV, портфолио, историю карьеры, доказательные кейсы, в чём вы сильны и чего хотите избегать. Чем больше вы её развиваете, тем лучше она работает. Думайте об этом как об онбординге нового рекрутера: первую неделю ему нужно узнать вас, а затем он становится незаменимым.

## Возможности

| Функция | Описание |
|---------|-------------|
| **Авто-пайплайн** | Вставьте URL — получите полную оценку + PDF + запись в трекере |
| **6-блочная оценка** | Резюме роли, совпадение с CV/портфолио, стратегия по грейду, исследование компенсации, персонализация, подготовка к интервью (STAR+R) |
| **Банк историй для интервью** | Накапливает STAR+Reflection истории из всех оценок — 5–10 мастер-историй, которые закрывают любой поведенческий вопрос |
| **Скрипты переговоров** | Фреймворки зарплатных переговоров, отстаивание от географической скидки, использование конкурирующих офферов как рычага |
| **ATS PDF-генерация** | Резюме с инъекцией ключевых слов, дизайн Space Grotesk + DM Sans |
| **Интеграция с Hired Creative** | Готовое сканирование агрегированной ленты [hiredcreative.com](https://hiredcreative.com) с удалёнными креативными вакансиями (22+ источников) |
| **Сканер порталов** | Стартовый список дизайн-ориентированных компаний и агентств (Figma, IDEO, R/GA, AKQA...) + собственные запросы по Ashby, Greenhouse, Lever, Workable |
| **Пакетная обработка** | Параллельная оценка через воркеры `claude -p` |
| **Dashboard TUI** | Терминальный интерфейс для просмотра, фильтрации и сортировки пайплайна |
| **Human-in-the-Loop** | ИИ оценивает и рекомендует, вы решаете и действуете. Система никогда не отправляет отклик сама — последнее слово всегда за вами |
| **Целостность пайплайна** | Автоматический merge, дедупликация, нормализация статусов, проверки здоровья |

## Быстрый старт

```bash
# 1. Клонируйте и установите
git clone https://github.com/yashimosh/hiredcreative-ops.git
cd hiredcreative-ops && npm install
npx playwright install chromium   # Требуется для генерации PDF

# 2. Проверьте настройку
npm run doctor                     # Проверяет все зависимости

# 3. Настройте
cp config/profile.example.yml config/profile.yml  # Заполните своими данными
cp templates/portals.example.yml portals.yml       # Настройте компании

# 4. Добавьте своё CV
# Создайте cv.md в корне проекта — CV в формате markdown

# 5. Персонализируйте через Claude
claude   # Откройте Claude Code в этой директории

# Затем попросите Claude адаптировать систему под вас:
# "Смените архетипы на роли моушн-дизайна"
# "Переведите режимы на русский"
# "Добавьте эти 5 агентств в portals.yml"
# "Обновите мой профиль на основе этого CV, которое я вставляю"

# 6. Начинайте пользоваться
# Вставьте URL вакансии или запустите /hiredcreative-ops
```

> **Система спроектирована так, чтобы Claude сам мог её кастомизировать.** Режимы, архетипы, веса оценки, скрипты переговоров — просто попросите Claude изменить их. Он читает те же файлы, которые использует, поэтому точно знает, что редактировать.

Полное руководство по настройке — в [docs/SETUP.md](docs/SETUP.md).

## Интеграция с Gemini CLI

Hired Creative Ops нативно поддерживает [Gemini CLI](https://github.com/google-gemini/gemini-cli) — так же, как поддерживает Claude Code и OpenCode. Доступны все slash-команды, использующие ту же логику оценки из `modes/*.md`.

### Вариант A — нативный Gemini CLI (рекомендуется)

```bash
# 1. Установите Gemini CLI
npm install -g @google/gemini-cli
# или: npx @google/gemini-cli --version

# 2. Авторизуйтесь (бесплатно — через ваш Google-аккаунт)
gemini auth

# 3. Запустите в директории hiredcreative-ops
cd hiredcreative-ops
gemini

# 4. Используйте slash-команды так же, как в Claude Code
/hiredcreative-ops "Senior Product Designer at Figma..."
/hiredcreative-ops-evaluate --file ./jds/figma.txt
/hiredcreative-ops-scan
/hiredcreative-ops-pdf
/hiredcreative-ops-tracker
```

Файл `GEMINI.md` автоматически загружается как контекст. Все команды определены в `.gemini/commands/*.toml`.

### Вариант B — отдельный API-скрипт (без установки CLI)

```bash
# 1. Получите бесплатный API-ключ на https://aistudio.google.com/apikey
cp .env.example .env
# Отредактируйте .env → укажите GEMINI_API_KEY=ваш_ключ

# 2. Установите зависимости
npm install

# 3. Оцените описание вакансии
node gemini-eval.mjs "We are looking for a Senior Product Designer..."
node gemini-eval.mjs --file ./jds/my-job.txt
npm run gemini:eval -- "JD text here"
```

> **Бесплатный тариф:** оба варианта работают без оплаты. Нативный CLI использует Google OAuth; API-скрипт использует `gemini-2.0-flash` (15 RPM, 1M токенов/день бесплатно).

## Использование

Hired Creative Ops — это одна slash-команда с множеством режимов:

```
/hiredcreative-ops                → Показать все доступные команды
/hiredcreative-ops {вставьте JD}  → Полный авто-пайплайн (оценка + PDF + трекер)
/hiredcreative-ops scan           → Сканирование порталов на новые вакансии (вкл. Hired Creative)
/hiredcreative-ops pdf            → Генерация ATS-оптимизированного CV
/hiredcreative-ops batch          → Пакетная оценка нескольких вакансий
/hiredcreative-ops tracker        → Просмотр статуса откликов
/hiredcreative-ops apply          → Заполнение форм отклика с помощью ИИ
/hiredcreative-ops pipeline       → Обработка URL в очереди
/hiredcreative-ops contacto       → Сообщение для LinkedIn-аутрича
/hiredcreative-ops deep           → Глубокое исследование компании
/hiredcreative-ops training       → Оценка курса/сертификации
/hiredcreative-ops project        → Оценка проекта в портфолио
```

Или просто вставьте URL вакансии либо её описание — Hired Creative Ops автоматически определит его и запустит полный пайплайн.

## Как это работает

```
Вы вставляете URL или описание вакансии
        │
        ▼
┌──────────────────┐
│  Определение     │  Классификация: Креативный директор / Продуктовый дизайнер /
│  архетипа        │  Бренд-дизайнер / Моушн / Копирайтер / Дизайн-системы
└────────┬─────────┘
         │
┌────────▼─────────┐
│  Оценка A-F      │  Совпадение, пробелы, исследование компенсации, STAR-истории
│  (читает cv.md + │
│   портфолио)     │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 Отчёт  PDF  Трекер
  .md   .pdf   .tsv
```

## Предустановленные порталы

Сканер поставляется со стартовым списком известных дизайн-ориентированных компаний и агентств, а также готовой интеграцией с [Hired Creative](https://hiredcreative.com), которая сама по себе покрывает 22+ источников. Скопируйте `templates/portals.example.yml` в `portals.yml` и добавьте свои:

**Агентства/студии:** IDEO, Pentagram, R/GA, AKQA, Instrument, Collins
**Дизайн-ориентированные продуктовые компании:** Figma, Airbnb, Notion, Linear, Duolingo, Canva, Webflow, Spotify, Adobe, Mailchimp
**Агрегатор:** Hired Creative (hiredcreative.com) — Greenhouse, Ashby, Lever, Workable, Dribbble, WeWorkRemotely, Welcome to the Jungle и другие, в одной ленте

**Проверяемые джоб-борды:** Ashby, Greenhouse, Lever, Workable, RemoteOK, WeWorkRemotely, Himalayas, Dribbble Jobs

## Dashboard TUI

Встроенный терминальный дашборд позволяет визуально просматривать ваш пайплайн:

```bash
cd dashboard
go build -o hiredcreative-dashboard .
./hiredcreative-dashboard --path ..
```

Возможности: 6 табов фильтрации, 4 режима сортировки, группированный/плоский вид, ленивая подгрузка превью, изменение статуса inline.

## Структура проекта

```
hiredcreative-ops/
├── CLAUDE.md                    # Инструкции для агента
├── cv.md                        # Ваше CV (создайте этот файл)
├── article-digest.md            # Ваши доказательные кейсы (опционально)
├── config/
│   └── profile.example.yml      # Шаблон вашего профиля
├── modes/                       # Режимы навыков
│   ├── _shared.md               # Общий контекст (кастомизируйте этот файл)
│   ├── oferta.md                # Оценка одной вакансии
│   ├── pdf.md                   # Генерация PDF
│   ├── scan.md                  # Сканер порталов
│   ├── batch.md                 # Пакетная обработка
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS-оптимизированный шаблон CV
│   ├── portals.example.yml      # Шаблон конфигурации сканера
│   └── states.yml               # Канонические статусы
├── batch/
│   ├── batch-prompt.md          # Автономный промт для воркера
│   └── batch-runner.sh          # Скрипт оркестратора
├── dashboard/                   # Go TUI для просмотра пайплайна
├── data/                        # Ваши данные трекинга (gitignored)
├── reports/                     # Отчёты оценки (gitignored)
├── output/                      # Сгенерированные PDF (gitignored)
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # Настройка, кастомизация, архитектура
└── examples/                    # Примеры CV, отчёта, доказательных кейсов
```

## Технологии

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **Агент**: Claude Code с кастомными навыками и режимами
- **PDF**: Playwright/Puppeteer + HTML-шаблон
- **Сканер**: Playwright + Greenhouse API + WebSearch + Hired Creative API
- **Dashboard**: Go + Bubble Tea + Lipgloss (тема Catppuccin Mocha)
- **Данные**: Markdown-таблицы + YAML-конфиг + TSV-файлы батчей

## Апстрим

Hired Creative Ops — форк проекта [career-ops](https://github.com/santifer/career-ops), созданного Сантьяго Фернандесом де Вальдеррама ([santifer.io](https://santifer.io)), который он построил и использовал, чтобы оценить 740+ вакансий, сгенерировать 100+ персонализированных резюме и получить должность Head of Applied AI. Этот форк сохраняет тот же движок, но переориентирует настройки по умолчанию, примеры и источники вакансий на креативную индустрию.

## Об этом форке

Поддерживается [yashimosh](https://yashimosh.com), креативным директором. Изначально создан для собственного поиска работы, затем выложен в открытый доступ, чтобы другие креативные специалисты могли форкнуть его и сделать своим — в том же духе, что и исходный проект.

## История звёзд

<a href="https://www.star-history.com/?repos=yashimosh%2Fhiredcreative-ops&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
 </picture>
</a>

## Дисклеймер

**hiredcreative-ops — локальный open-source инструмент, а НЕ хостинг-сервис.** Используя это ПО, вы подтверждаете:

1. **Вы контролируете свои данные.** Ваше CV, контактная информация и персональные данные остаются на вашем устройстве и отправляются напрямую выбранному вами AI-провайдеру (Anthropic, OpenAI и т.д.). Мы не собираем, не храним и не имеем доступа к вашим данным.
2. **Вы контролируете ИИ.** Промты по умолчанию инструктируют ИИ не отправлять отклики автоматически, но модели ИИ могут вести себя непредсказуемо. Если вы изменяете промты или используете другие модели, вы делаете это на свой риск. **Всегда проверяйте сгенерированный ИИ контент на точность перед отправкой.**
3. **Вы соблюдаете условия использования сторонних сервисов.** Вы обязаны использовать этот инструмент в соответствии с условиями использования карьерных порталов, с которыми взаимодействуете (Greenhouse, Lever, Workday, LinkedIn и т.д.). Не используйте этот инструмент для спама работодателям или перегрузки ATS-систем.
4. **Никаких гарантий.** Оценки — это рекомендации, а не истина в последней инстанции. Модели ИИ могут галлюцинировать навыки или опыт. Авторы не несут ответственности за результаты трудоустройства, отклонённые заявки, ограничения аккаунтов или любые другие последствия.

Подробности — в [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md). Это ПО предоставляется по [лицензии MIT](LICENSE) «как есть», без каких-либо гарантий.

## Контрибьюторы

Нашли работу с помощью hiredcreative-ops? [Поделитесь своей историей!](https://github.com/yashimosh/hiredcreative-ops/issues/new?template=i-got-hired.yml)

Список людей, работающих над этим форком — в [CONTRIBUTORS.md](CONTRIBUTORS.md); [контрибьюторы апстрима career-ops](https://github.com/santifer/career-ops/graphs/contributors) — авторы движка, на основе которого всё построено.

## Лицензия

MIT

## Будем на связи

[![Website](https://img.shields.io/badge/yashimosh.com-000?style=for-the-badge&logo=safari&logoColor=white)](https://yashimosh.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashimosh)
[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/yashimosh_)
