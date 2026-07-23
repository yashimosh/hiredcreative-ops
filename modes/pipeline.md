# Modo: pipeline — Inbox de URLs (Second Brain)

Procesa URLs de ofertas acumuladas en `data/pipeline.md`. El usuario agrega URLs cuando quiera y luego ejecuta `/hiredcreative-ops pipeline` para procesarlas todas.

## Workflow

1. **Leer** `data/pipeline.md` → buscar items `- [ ]` en la sección "Pendientes"
2. **Para cada URL pendiente**:
   a. Calcular siguiente `REPORT_NUM` secuencial (leer `reports/`, tomar el número más alto + 1)
   b. **Extraer JD** usando Playwright (browser_navigate + browser_snapshot) → WebFetch → WebSearch
   c. Si la URL no es accesible → marcar como `- [!]` con nota y continuar
   d. **Ejecutar auto-pipeline completo**: Evaluación A-F → Report .md → PDF (siempre, sin importar el score — ver `modes/_profile.md` § Application Quality Gate) → Tracker
   e. **Mover de "Pendientes" a "Procesadas"**: `- [x] #NNN | URL | Empresa | Rol | Score/5 | PDF ✅/❌`
3. **Si hay 3+ URLs pendientes**, lanzar agentes en paralelo (Agent tool con `run_in_background`) para maximizar velocidad.
4. **Al terminar**, mostrar tabla resumen:

```
| # | Empresa | Rol | Score | PDF | Acción recomendada |
```

## Formato de pipeline.md

```markdown
## Pendientes
- [ ] https://jobs.example.com/posting/123
- [ ] https://boards.greenhouse.io/company/jobs/456 | Company Inc | Senior PM
- [!] https://private.url/job — Error: login required

## Procesadas
- [x] #143 | https://jobs.example.com/posting/789 | Acme Corp | AI PM | 4.2/5 | PDF ✅
- [x] #144 | https://boards.greenhouse.io/xyz/jobs/012 | BigCo | SA | 2.1/5 | PDF ❌
```

## Detección inteligente de JD desde URL

1. **Playwright (preferido):** `browser_navigate` + `browser_snapshot`. Funciona con todas las SPAs.
2. **WebFetch (fallback):** Para páginas estáticas o cuando Playwright no está disponible.
3. **WebSearch (último recurso):** Buscar en portales secundarios que indexan el JD.

**Casos especiales:**
- **LinkedIn**: Puede requerir login → marcar `[!]` y pedir al usuario que pegue el texto
- **PDF**: Si la URL apunta a un PDF, leerlo directamente con Read tool
- **`local:` prefix**: Leer el archivo local. Ejemplo: `local:jds/linkedin-pm-ai.md` → leer `jds/linkedin-pm-ai.md`

## Numeración automática

1. Listar todos los archivos en `reports/`
2. Extraer el número del prefijo (e.g., `142-medispend...` → 142)
3. Nuevo número = máximo encontrado + 1

## Sincronización de fuentes

Antes de procesar cualquier URL, verificar sync:
```bash
node cv-sync-check.mjs
```
Si hay desincronización, advertir al usuario antes de continuar.

## Track Assignment (post-evaluation)

After evaluating a role, assign it to exactly ONE **track**. The authoritative
track-assignment rules, identity framing, and comp references live in
**`modes/_profile.md` → "Track Assignment Rules" and "Identity per Track"** (user layer —
never hardcode identity data in this file).

Default track → file routing (override in `modes/_profile.md`):

| Track | File | Purpose |
|-------|------|---------|
| **remote** | `data/pipeline-remote.md` | Remote-worldwide roles |
| **relocation** (EU/UK + case-by-case others) | `data/pipeline-relocation.md` | On-site/hybrid roles with a realistic visa path |
| **relocation_us** | `data/pipeline-us.md` | US roles — holding bucket, evaluate only high-probability sponsors |

Scan-time entries in `pipeline.md` MAY carry a track hint appended as `| track:{name}`
(assigned by the scan from the query/tile that surfaced the role). The hint is advisory —
**the JD decides**. Confirm or correct the track at evaluation time using the rules in
`modes/_profile.md`.

After evaluation, append the role to the correct track file under "Ready to Apply" with:
```
- [ ] #{num} | {company} | {role} | {score}/5 | {url} | {one-line geo/visa note}
```

The role also stays in `pipeline.md` as `[x]` (processed) and goes into `applications.md` as usual.

**Track hygiene rules:**
1. A role lives in exactly ONE track file. If re-triaged (e.g., "remote" turns out to be EU-residency-only), MOVE it, don't copy — leave a `[x] Moved to {track}` stub behind.
2. "Remote (Europe)" / "Remote (US)" is NOT remote-worldwide — those are residency-gated. Route to relocation/relocation_us or discard per `modes/_profile.md`.
3. Ambiguous geo → the track whose framing is STRONGER for the candidate (see `modes/_profile.md` defaults).
4. Every relocation entry must carry a visa-sponsorship status note: `sponsor-confirmed`, `sponsor-likely`, `sponsor-unknown — verify`, before it can move to Applied.

### Track-filtered views

- `/hiredcreative-ops pipeline remote` → Read `data/pipeline-remote.md`, show Ready to Apply roles
- `/hiredcreative-ops pipeline relocation` → Read `data/pipeline-relocation.md`, show Ready to Apply roles
- `/hiredcreative-ops pipeline us` → Read `data/pipeline-us.md`, show High-prob sponsor roles

### Identity per track

Identity framing (phone, address, location narrative, comp framing) is user data:
read it from **`modes/_profile.md` → "Identity per Track"** at apply time. Never store
or duplicate identity details in system-layer mode files.
