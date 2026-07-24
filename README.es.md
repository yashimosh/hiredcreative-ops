# Hired Creative Ops

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <em>Las empresas usan IA para filtrar candidatos. Esto le da a los profesionales creativos IA para <em>elegir</em> empresas.</em><br>
  Un fork de <a href="https://github.com/santifer/career-ops">career-ops</a>, reorientado para Directores Creativos, diseñadores, copywriters y otros roles creativos.
</p>

<p align="center">
  <a href="https://github.com/yashimosh/hiredcreative-ops/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/yashimosh/hiredcreative-ops/test.yml?branch=main&label=tests" alt="Tests"></a>
  <a href="https://github.com/yashimosh/hiredcreative-ops/blob/main/LICENSE"><img src="https://img.shields.io/github/license/yashimosh/hiredcreative-ops" alt="License"></a>
  <a href="https://github.com/yashimosh/hiredcreative-ops/commits/main"><img src="https://img.shields.io/github/last-commit/yashimosh/hiredcreative-ops" alt="Last commit"></a>
  <a href="https://github.com/yashimosh/hiredcreative-ops/stargazers"><img src="https://img.shields.io/github/stars/yashimosh/hiredcreative-ops?style=flat" alt="Stars"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-111827?style=flat&logo=terminal&logoColor=white" alt="OpenCode">
  <img src="https://img.shields.io/badge/Gemini_CLI-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini CLI">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
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

## Qué es esto

Hired Creative Ops convierte cualquier CLI de IA en un centro de mando completo de búsqueda de empleo para profesionales creativos -- Creative Directors, Art Directors, diseñadores de producto/marca/motion, copywriters. En vez de trackear aplicaciones manualmente en una hoja de cálculo, tienes un pipeline con IA que:

- **Evalúa ofertas** con un sistema de puntuación estructurado A-F (10 dimensiones ponderadas)
- **Genera PDFs personalizados** -- CVs optimizados para ATS, adaptados a cada descripción de puesto
- **Escanea portales** automáticamente (Greenhouse, Ashby, Lever, webs de empresas) -- además de una integración incorporada con [Hired Creative](https://hiredcreative.com), un agregador gratuito de empleos creativos remotos
- **Procesa en batch** -- evalúa 10+ ofertas en paralelo con sub-agentes
- **Trackea todo** en una única fuente de verdad con checks de integridad

> **Importante: Esto NO es una herramienta para spamear empresas.** Hired Creative Ops es un filtro -- te ayuda a encontrar las pocas ofertas que merecen tu tiempo entre cientos. El sistema recomienda encarecidamente no aplicar a nada que quede por debajo del umbral de calidad que definas. Tu tiempo es valioso, y el del recruiter también. Siempre revisa antes de enviar.

Hired Creative Ops es agéntico: Claude Code navega páginas de empleo con Playwright, evalúa el fit razonando sobre tu CV y portfolio frente a la descripción del puesto (no por coincidencia de palabras clave), y adapta tu CV para cada oferta.

> **Aviso: las primeras evaluaciones no serán geniales.** El sistema todavía no te conoce. Dale contexto -- tu CV, tu portfolio, tu historia profesional, tus proof points, en qué eres bueno, qué quieres evitar. Cuanto más lo nutras, mejor se vuelve. Piénsalo como el onboarding de un recruiter nuevo: la primera semana necesita conocerte, luego se vuelve invaluable.

## Features

| Feature | Descripción |
|---------|-------------|
| **Auto-Pipeline** | Pega una URL y obtén una evaluación completa + PDF + entrada en el tracker |
| **Evaluación de 6 bloques** | Resumen del rol, match de CV/portfolio, estrategia de nivel, research de compensación, personalización, prep de entrevista (STAR+R) |
| **Banco de historias para entrevistas** | Acumula historias STAR+Reflexión a través de las evaluaciones -- 5-10 historias maestras que responden a cualquier pregunta conductual |
| **Scripts de negociación** | Frameworks de negociación salarial, contraargumentos frente a descuentos geográficos, leverage de ofertas competidoras |
| **Generación de PDF ATS** | CVs con keywords inyectadas, con diseño Space Grotesk + DM Sans |
| **Integración con Hired Creative** | Escaneo pre-configurado del feed agregado de [hiredcreative.com](https://hiredcreative.com) de empleos creativos remotos (22+ fuentes) |
| **Scanner de portales** | Lista inicial de empresas y agencias con foco en diseño (Figma, IDEO, R/GA, AKQA...) + queries personalizadas en Ashby, Greenhouse, Lever, Workable |
| **Procesamiento en batch** | Evaluación en paralelo con workers `claude -p` |
| **Dashboard TUI** | Interfaz de terminal para navegar, filtrar y ordenar tu pipeline |
| **Human-in-the-Loop** | La IA evalúa y recomienda, tú decides y actúas. El sistema nunca envía una aplicación -- tú siempre tienes la última palabra |
| **Integridad de pipeline** | Merge automático, dedup, normalización de estados, health checks |

## Inicio rápido

```bash
# 1. Clonar e instalar
git clone https://github.com/yashimosh/hiredcreative-ops.git
cd hiredcreative-ops && npm install
npx playwright install chromium   # Necesario para generar PDFs

# 2. Verificar setup
npm run doctor                     # Valida todos los requisitos previos

# 3. Configurar
cp config/profile.example.yml config/profile.yml  # Editar con tus datos
cp templates/portals.example.yml portals.yml       # Personalizar empresas

# 4. Añadir tu CV
# Crea cv.md en la raíz del proyecto con tu CV en markdown

# 5. Personalizar con Claude
claude   # Abre Claude Code en este directorio

# Luego pídele a Claude que adapte el sistema a ti:
# "Cambia los arquetipos a roles de motion design"
# "Traduce los modes al inglés"
# "Añade estas 5 agencias a portals.yml"
# "Actualiza mi perfil con este CV que te pego"

# 6. Empezar a usarlo
# Pega una URL de oferta o ejecuta /hiredcreative-ops
```

> **El sistema está diseñado para que el propio Claude lo personalice.** Modes, arquetipos, pesos de scoring, scripts de negociación -- solo pídeselo a Claude. Lee los mismos archivos que usa, así que sabe exactamente qué editar.

Consulta [docs/SETUP.md](docs/SETUP.md) para la guía de instalación completa.

## Integración con Gemini CLI

Hired Creative Ops soporta [Gemini CLI](https://github.com/google-gemini/gemini-cli) de forma nativa -- de la misma manera que soporta Claude Code y OpenCode. Todos los slash commands están disponibles, usando la misma lógica de evaluación de `modes/*.md`.

### Opción A -- Gemini CLI nativo (recomendado)

```bash
# 1. Instalar Gemini CLI
npm install -g @google/gemini-cli
# o: npx @google/gemini-cli --version

# 2. Autenticarse (gratis -- usa tu cuenta de Google)
gemini auth

# 3. Ejecutar en el directorio hiredcreative-ops
cd hiredcreative-ops
gemini

# 4. Usar slash commands igual que en Claude Code
/hiredcreative-ops "Senior Product Designer en Figma..."
/hiredcreative-ops-evaluate --file ./jds/figma.txt
/hiredcreative-ops-scan
/hiredcreative-ops-pdf
/hiredcreative-ops-tracker
```

El archivo `GEMINI.md` se carga automáticamente como contexto. Todos los comandos están definidos en `.gemini/commands/*.toml`.

### Opción B -- Script de API independiente (sin necesidad de instalar el CLI)

```bash
# 1. Obtén una API key gratis en https://aistudio.google.com/apikey
cp .env.example .env
# Edita .env → configura GEMINI_API_KEY=tu_clave_aqui

# 2. Instalar dependencias
npm install

# 3. Evaluar una descripción de puesto
node gemini-eval.mjs "Buscamos un Senior Product Designer..."
node gemini-eval.mjs --file ./jds/my-job.txt
npm run gemini:eval -- "Texto del JD aquí"
```

> **Nivel gratuito:** Ambas opciones funcionan sin facturación. El CLI nativo usa Google OAuth; el script de API usa `gemini-2.0-flash` (15 RPM, 1M tokens/día gratis).

## Uso

Hired Creative Ops es un único slash command con múltiples modos:

```
/hiredcreative-ops                → Muestra todos los comandos disponibles
/hiredcreative-ops {pega un JD}   → Pipeline automático completo (evaluar + PDF + tracker)
/hiredcreative-ops scan           → Escanea portales en busca de nuevas ofertas (incl. Hired Creative)
/hiredcreative-ops pdf            → Genera un CV optimizado para ATS
/hiredcreative-ops batch          → Evalúa varias ofertas en batch
/hiredcreative-ops tracker        → Ver el estado de las aplicaciones
/hiredcreative-ops apply          → Rellena formularios de aplicación con IA
/hiredcreative-ops pipeline       → Procesa URLs pendientes
/hiredcreative-ops contacto       → Mensaje de outreach para LinkedIn
/hiredcreative-ops deep           → Research profundo de la empresa
/hiredcreative-ops training       → Evalúa un curso/certificación
/hiredcreative-ops project        → Evalúa un proyecto de portfolio
```

O simplemente pega una URL o descripción de oferta directamente -- Hired Creative Ops la detecta automáticamente y ejecuta el pipeline completo.

## Cómo funciona

```
Pegas una URL o descripción de oferta
        │
        ▼
┌─────────────────────┐
│  Detección de       │  Clasifica: Creative Director / Product Designer /
│  Arquetipo          │  Brand Designer / Motion / Copywriter / Design Systems
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Evaluación A-F     │  Match, gaps, comp research, historias STAR
│  (lee cv.md +       │
│   portfolio)        │
└──────────┬──────────┘
           │
      ┌────┼────┐
      ▼    ▼    ▼
   Report  PDF  Tracker
    .md   .pdf   .tsv
```

## Portales pre-configurados

El scanner viene con una lista inicial de empresas y agencias reconocidas con foco en diseño, además de una integración pre-configurada con [Hired Creative](https://hiredcreative.com) que por sí sola cubre 22+ fuentes. Copia `templates/portals.example.yml` a `portals.yml` y añade las tuyas:

**Agencias/estudios:** IDEO, Pentagram, R/GA, AKQA, Instrument, Collins
**Empresas de producto con foco en diseño:** Figma, Airbnb, Notion, Linear, Duolingo, Canva, Webflow, Spotify, Adobe, Mailchimp
**Agregador:** Hired Creative (hiredcreative.com) -- Greenhouse, Ashby, Lever, Workable, Dribbble, WeWorkRemotely, Welcome to the Jungle, y más, en un solo feed

**Portales de empleo escaneados:** Ashby, Greenhouse, Lever, Workable, RemoteOK, WeWorkRemotely, Himalayas, Dribbble Jobs

## Dashboard TUI

El dashboard de terminal incorporado te permite navegar tu pipeline visualmente:

```bash
cd dashboard
go build -o hiredcreative-dashboard .
./hiredcreative-dashboard --path ..
```

Features: 6 pestañas de filtro, 4 modos de ordenación, vista agrupada/plana, previews de carga diferida, cambios de estado inline.

## Estructura del proyecto

```
hiredcreative-ops/
├── CLAUDE.md                    # Instrucciones del agente
├── cv.md                        # Tu CV (créalo tú)
├── article-digest.md            # Tus proof points (opcional)
├── config/
│   └── profile.example.yml      # Template para tu perfil
├── modes/                       # Modos de habilidad
│   ├── _shared.md               # Contexto compartido (personaliza esto)
│   ├── oferta.md                # Evaluación individual
│   ├── pdf.md                   # Generación de PDF
│   ├── scan.md                  # Scanner de portales
│   ├── batch.md                 # Procesamiento batch
│   └── ...
├── templates/
│   ├── cv-template.html         # Template de CV optimizado para ATS
│   ├── portals.example.yml      # Template de configuración del scanner
│   └── states.yml               # Estados canónicos
├── batch/
│   ├── batch-prompt.md          # Prompt autocontenido del worker
│   └── batch-runner.sh          # Script orquestador
├── dashboard/                   # Visor de pipeline en Go TUI
├── data/                        # Tus datos de tracking (gitignored)
├── reports/                     # Reports de evaluación (gitignored)
├── output/                      # PDFs generados (gitignored)
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # Setup, personalización, arquitectura
└── examples/                    # CV de ejemplo, report, proof points
```

## Tech Stack

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **Agente**: Claude Code con skills y modos personalizados
- **PDF**: Playwright/Puppeteer + template HTML
- **Scanner**: Playwright + Greenhouse API + WebSearch + API de Hired Creative
- **Dashboard**: Go + Bubble Tea + Lipgloss (tema Catppuccin Mocha)
- **Datos**: Tablas Markdown + config YAML + ficheros TSV batch

## Upstream

Hired Creative Ops es un fork de [career-ops](https://github.com/santifer/career-ops), creado por Santiago Fernández de Valderrama ([santifer.io](https://santifer.io)), quien lo construyó y usó para evaluar 740+ ofertas de empleo, generar 100+ CVs personalizados, y conseguir un rol de Head of Applied AI. Este fork mantiene el mismo motor y reorienta los valores por defecto, los ejemplos y las fuentes de empleo hacia la industria creativa.

## Sobre este fork

Mantenido por [yashimosh](https://yashimosh.com), un Creative Director. Construido para gestionar su propia búsqueda de empleo, y luego liberado como open source para que otros profesionales creativos puedan hacer su propio fork -- mismo espíritu que el proyecto upstream.

## Star History

<a href="https://www.star-history.com/?repos=yashimosh%2Fhiredcreative-ops&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
 </picture>
</a>

## Aviso legal

**hiredcreative-ops es una herramienta local y open source -- NO un servicio alojado.** Al usar este software, aceptas que:

1. **Tú controlas tus datos.** Tu CV, datos de contacto e información personal se quedan en tu máquina y se envían directamente al proveedor de IA que elijas (Anthropic, OpenAI, etc.). No recopilamos, almacenamos ni tenemos acceso a ninguno de tus datos.
2. **Tú controlas la IA.** Los prompts por defecto instruyen a la IA para que no envíe aplicaciones automáticamente, pero los modelos de IA pueden comportarse de forma impredecible. Si modificas los prompts o usas otros modelos, lo haces bajo tu propia responsabilidad. **Revisa siempre la precisión del contenido generado por IA antes de enviarlo.**
3. **Cumples con los Términos de Servicio de terceros.** Debes usar esta herramienta de acuerdo con los Términos de Servicio de los portales de empleo con los que interactúes (Greenhouse, Lever, Workday, LinkedIn, etc.). No uses esta herramienta para spamear empleadores ni sobrecargar los sistemas ATS.
4. **Sin garantías.** Las evaluaciones son recomendaciones, no verdades absolutas. Los modelos de IA pueden alucinar habilidades o experiencia. Los autores no son responsables de resultados laborales, aplicaciones rechazadas, restricciones de cuenta ni ninguna otra consecuencia.

Consulta [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) para más detalles. Este software se proporciona bajo la [Licencia MIT](LICENSE) "tal cual", sin garantía de ningún tipo.

## Colaboradores

¿Conseguiste trabajo usando hiredcreative-ops? [¡Comparte tu historia!](https://github.com/yashimosh/hiredcreative-ops/issues/new?template=i-got-hired.yml)

Consulta [CONTRIBUTORS.md](CONTRIBUTORS.md) para ver a las personas que construyen este fork, y los [contribuidores del career-ops original](https://github.com/santifer/career-ops/graphs/contributors) por el motor sobre el que está construido.

## Licencia

MIT

## Conectemos

[![Website](https://img.shields.io/badge/yashimosh.com-000?style=for-the-badge&logo=safari&logoColor=white)](https://yashimosh.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashimosh)
[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/yashimosh_)
