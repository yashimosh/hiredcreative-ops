# Hired Creative Ops

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <em>Empresas usam IA para filtrar candidatos. Isso dá aos profissionais criativos IA para <em>escolher</em> empresas.</em><br>
  Um fork do <a href="https://github.com/santifer/career-ops">career-ops</a>, redirecionado para Diretores Criativos, designers, redatores e outras funções criativas.
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

## O que é isso

Hired Creative Ops transforma qualquer CLI de código com IA em uma central completa de busca de emprego para profissionais criativos -- Diretores Criativos, Diretores de Arte, designers de produto/marca/motion, redatores. Em vez de acompanhar candidaturas manualmente em uma planilha, você tem um pipeline com IA que:

- **Avalia vagas** com um sistema estruturado de pontuação A-F (10 dimensões com pesos)
- **Gera PDFs personalizados** -- CVs otimizados para ATS, personalizados por descrição de vaga
- **Escaneia portais** automaticamente (Greenhouse, Ashby, Lever, páginas de empresas) -- além de uma integração nativa com o [Hired Creative](https://hiredcreative.com), um agregador gratuito de vagas criativas remotas
- **Processa em lote** -- avalia 10+ vagas em paralelo com subagentes
- **Rastreia tudo** em uma única fonte de verdade com verificações de integridade

> **Importante: isso NÃO é uma ferramenta de disparo em massa.** Hired Creative Ops é um filtro -- ajuda você a encontrar as poucas vagas que realmente valem seu tempo entre centenas. O sistema recomenda fortemente não se candidatar a nada com pontuação abaixo do limiar de qualidade que você definir. Seu tempo é valioso, e o do recrutador também. Sempre revise antes de enviar.

Hired Creative Ops é agentic: o Claude Code navega páginas de carreira com Playwright, avalia aderência raciocinando sobre seu CV e portfólio em comparação com a descrição da vaga (não por simples correspondência de palavras-chave) e adapta seu currículo para cada vaga.

> **Aviso: as primeiras avaliações não vão ser ótimas.** O sistema ainda não conhece você. Alimente-o com contexto -- seu CV, seu portfólio, sua trajetória profissional, suas provas de resultado, no que você é bom, o que você quer evitar. Quanto mais você o nutre, melhor ele fica. Pense nisso como o onboarding de um novo recrutador: na primeira semana ele precisa te conhecer, depois se torna indispensável.

## Funcionalidades

| Funcionalidade | Descrição |
|---------|-------------|
| **Auto-Pipeline** | Cole uma URL e receba avaliação completa + PDF + entrada no tracker |
| **Avaliação em 6 blocos** | Resumo da vaga, aderência ao CV/portfólio, estratégia de senioridade, pesquisa de compensação, personalização, preparação para entrevista (STAR+R) |
| **Banco de histórias de entrevista** | Acumula histórias STAR+Reflection ao longo das avaliações -- 5-10 histórias principais que respondem qualquer pergunta comportamental |
| **Scripts de negociação** | Frameworks para negociação salarial, resposta a desconto geográfico e alavanca com ofertas concorrentes |
| **Geração de PDF ATS** | CVs com injeção de palavras-chave usando design com Space Grotesk + DM Sans |
| **Integração com Hired Creative** | Escaneamento pré-configurado do feed agregado de vagas criativas remotas do [hiredcreative.com](https://hiredcreative.com) (22+ fontes) |
| **Scanner de portais** | Lista inicial de empresas e agências com forte cultura de design (Figma, IDEO, R/GA, AKQA...) + consultas customizadas em Ashby, Greenhouse, Lever e Workable |
| **Processamento em lote** | Avaliação paralela com workers `claude -p` |
| **Dashboard TUI** | Interface no terminal para navegar, filtrar e ordenar seu pipeline |
| **Humano no loop** | A IA avalia e recomenda, você decide e age. O sistema nunca envia candidatura automaticamente -- a decisão final é sempre sua |
| **Integridade do pipeline** | Merge automatizado, deduplicação, normalização de status e health checks |

## Início rápido

```bash
# 1. Clone e instale
git clone https://github.com/yashimosh/hiredcreative-ops.git
cd hiredcreative-ops && npm install
npx playwright install chromium   # Necessário para geração de PDF

# 2. Verifique o setup
npm run doctor                     # Valida todos os pré-requisitos

# 3. Configure
cp config/profile.example.yml config/profile.yml  # Edite com seus dados
cp templates/portals.example.yml portals.yml       # Personalize as empresas

# 4. Adicione seu CV
# Crie cv.md na raiz do projeto com seu CV em markdown

# 5. Personalize com Claude
claude   # Abra o Claude Code neste diretório

# Depois, peça ao Claude para adaptar o sistema para você:
# "Mude os arquétipos para vagas de motion design"
# "Traduza os modos para inglês"
# "Adicione estas 5 agências ao portals.yml"
# "Atualize meu perfil com este CV que vou colar"

# 6. Comece a usar
# Cole a URL de uma vaga ou rode /hiredcreative-ops
```

> **O sistema foi projetado para ser personalizado pelo próprio Claude.** Modos, arquétipos, pesos de pontuação, scripts de negociação -- basta pedir ao Claude para alterá-los. Ele lê os mesmos arquivos que usa, então sabe exatamente o que editar.

Veja [docs/SETUP.md](docs/SETUP.md) para o guia completo de configuração.

## Integração com Gemini CLI

Hired Creative Ops suporta nativamente o [Gemini CLI](https://github.com/google-gemini/gemini-cli) -- da mesma forma que suporta Claude Code e OpenCode. Todos os comandos slash estão disponíveis, usando a mesma lógica de avaliação em `modes/*.md`.

### Opção A -- Gemini CLI nativo (recomendado)

```bash
# 1. Instale o Gemini CLI
npm install -g @google/gemini-cli
# ou: npx @google/gemini-cli --version

# 2. Autentique-se (gratuito -- usa sua conta Google)
gemini auth

# 3. Execute no diretório hiredcreative-ops
cd hiredcreative-ops
gemini

# 4. Use comandos slash como no Claude Code
/hiredcreative-ops "Senior Product Designer at Figma..."
/hiredcreative-ops-evaluate --file ./jds/figma.txt
/hiredcreative-ops-scan
/hiredcreative-ops-pdf
/hiredcreative-ops-tracker
```

O arquivo `GEMINI.md` é carregado automaticamente como contexto. Todos os comandos são definidos em `.gemini/commands/*.toml`.

### Opção B -- Script de API standalone (sem precisar instalar a CLI)

```bash
# 1. Obtenha uma chave de API gratuita em https://aistudio.google.com/apikey
cp .env.example .env
# Edite o .env → defina GEMINI_API_KEY=your_key_here

# 2. Instale as dependências
npm install

# 3. Avalie uma descrição de vaga
node gemini-eval.mjs "We are looking for a Senior Product Designer..."
node gemini-eval.mjs --file ./jds/my-job.txt
npm run gemini:eval -- "JD text here"
```

> **Nível gratuito:** as duas opções funcionam sem cobrança. A CLI nativa usa OAuth do Google; o script de API usa `gemini-2.0-flash` (15 RPM, 1M tokens/dia grátis).

## Uso

Hired Creative Ops é um único comando slash com múltiplos modos:

```
/hiredcreative-ops                → Mostra todos os comandos disponíveis
/hiredcreative-ops {cole um JD}   → Auto-pipeline completo (avaliar + PDF + tracker)
/hiredcreative-ops scan           → Escaneia portais em busca de novas vagas (incl. Hired Creative)
/hiredcreative-ops pdf            → Gera CV otimizado para ATS
/hiredcreative-ops batch          → Avalia múltiplas vagas em lote
/hiredcreative-ops tracker        → Mostra o status das candidaturas
/hiredcreative-ops apply          → Preenche formulários de candidatura com IA
/hiredcreative-ops pipeline       → Processa URLs pendentes
/hiredcreative-ops contacto       → Mensagem de outreach no LinkedIn
/hiredcreative-ops deep           → Pesquisa aprofundada da empresa
/hiredcreative-ops training       → Avalia um curso/certificação
/hiredcreative-ops project        → Avalia um projeto de portfólio
```

Ou apenas cole uma URL ou descrição de vaga diretamente -- Hired Creative Ops detecta automaticamente e roda o pipeline completo.

## Como funciona

```
Você cola a URL ou descrição da vaga
        │
        ▼
┌──────────────────┐
│  Detecção de     │  Classifica: Diretor Criativo / Product Designer /
│  Arquétipo       │  Brand Designer / Motion / Redator / Design Systems
└────────┬─────────┘
         │
┌────────▼─────────┐
│  Avaliação A-F   │  Aderência, gaps, pesquisa de compensação, histórias STAR
│  (lê cv.md +     │
│   portfólio)     │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 Report  PDF  Tracker
  .md   .pdf   .tsv
```

## Portais pré-configurados

O scanner já vem com uma lista inicial de empresas e agências conhecidas por sua forte cultura de design, além de uma integração pré-configurada com o [Hired Creative](https://hiredcreative.com) que sozinha cobre mais de 22 fontes. Copie `templates/portals.example.yml` para `portals.yml` e adicione as suas:

**Agências/estúdios:** IDEO, Pentagram, R/GA, AKQA, Instrument, Collins
**Empresas de produto com forte cultura de design:** Figma, Airbnb, Notion, Linear, Duolingo, Canva, Webflow, Spotify, Adobe, Mailchimp
**Agregador:** Hired Creative (hiredcreative.com) -- Greenhouse, Ashby, Lever, Workable, Dribbble, WeWorkRemotely, Welcome to the Jungle e mais, em um único feed

**Job boards pesquisados:** Ashby, Greenhouse, Lever, Workable, RemoteOK, WeWorkRemotely, Himalayas, Dribbble Jobs

## Dashboard TUI

O dashboard de terminal integrado permite navegar visualmente pelo seu pipeline:

```bash
cd dashboard
go build -o hiredcreative-dashboard .
./hiredcreative-dashboard --path ..
```

Recursos: 6 abas de filtro, 4 modos de ordenação, visualização agrupada/plana, prévias com carregamento sob demanda e alterações de status inline.

## Estrutura do projeto

```
hiredcreative-ops/
├── CLAUDE.md                    # Instruções para o agente
├── cv.md                        # Seu CV (crie este arquivo)
├── article-digest.md            # Seus proof points (opcional)
├── config/
│   └── profile.example.yml      # Template para seu perfil
├── modes/                       # Modos de skill
│   ├── _shared.md               # Contexto compartilhado (personalize)
│   ├── oferta.md                # Avaliação individual
│   ├── pdf.md                   # Geração de PDF
│   ├── scan.md                  # Scanner de portais
│   ├── batch.md                 # Processamento em lote
│   └── ...
├── templates/
│   ├── cv-template.html         # Template de CV otimizado para ATS
│   ├── portals.example.yml      # Template de configuração do scanner
│   └── states.yml               # Status canônicos
├── batch/
│   ├── batch-prompt.md          # Prompt autocontido para workers
│   └── batch-runner.sh          # Script orquestrador
├── dashboard/                   # Visualizador de pipeline em Go TUI
├── data/                        # Seus dados de rastreamento (gitignored)
├── reports/                     # Relatórios de avaliação (gitignored)
├── output/                      # PDFs gerados (gitignored)
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # Setup, customização, arquitetura
└── examples/                    # CV de exemplo, relatório e proof points
```

## Stack de tecnologia

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **Agente**: Claude Code com skills e modos customizados
- **PDF**: Playwright/Puppeteer + template HTML
- **Scanner**: Playwright + Greenhouse API + WebSearch + Hired Creative API
- **Dashboard**: Go + Bubble Tea + Lipgloss (tema Catppuccin Mocha)
- **Dados**: Tabelas em Markdown + configuração YAML + arquivos TSV de lote

## Projeto original

Hired Creative Ops é um fork do [career-ops](https://github.com/santifer/career-ops), criado por Santiago Fernández de Valderrama ([santifer.io](https://santifer.io)), que o construiu e usou para avaliar 740+ vagas, gerar 100+ CVs personalizados e conquistar uma posição de Head of Applied AI. Este fork mantém o mesmo motor e redireciona os padrões, exemplos e fontes de vagas para a indústria criativa.

## Sobre este fork

Mantido por [yashimosh](https://yashimosh.com), um Diretor Criativo. Construído para gerenciar sua própria busca de emprego, depois disponibilizado como open source para que outros profissionais criativos possam fazer fork e adaptar para si -- mesmo espírito do projeto original.

## Star History

<a href="https://www.star-history.com/?repos=yashimosh%2Fhiredcreative-ops&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
 </picture>
</a>

## Aviso legal

**hiredcreative-ops é uma ferramenta local e open source -- NÃO é um serviço hospedado.** Ao usar este software, você reconhece que:

1. **Você controla seus dados.** Seu CV, informações de contato e dados pessoais ficam na sua máquina e são enviados diretamente para o provedor de IA que você escolher (Anthropic, OpenAI etc.). Nós não coletamos, armazenamos nem temos acesso aos seus dados.
2. **Você controla a IA.** Os prompts padrão instruem a IA a não enviar candidaturas automaticamente, mas modelos de IA podem se comportar de forma imprevisível. Se você modificar os prompts ou usar modelos diferentes, faz isso por sua conta e risco. **Sempre revise o conteúdo gerado por IA antes de enviar.**
3. **Você cumpre os Termos de Serviço de terceiros.** Você deve usar esta ferramenta em conformidade com os Termos de Serviço dos portais de carreira com os quais interage (Greenhouse, Lever, Workday, LinkedIn etc.). Não use esta ferramenta para enviar spam a empregadores nem para sobrecarregar sistemas ATS.
4. **Sem garantias.** As avaliações são recomendações, não verdades absolutas. Modelos de IA podem alucinar habilidades ou experiências. Os autores não se responsabilizam por resultados profissionais, candidaturas rejeitadas, restrições de conta ou qualquer outra consequência.

Veja [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) para o aviso completo. Este software é fornecido sob a [Licença MIT](LICENSE) "como está", sem garantia de qualquer tipo.

## Contribuidores

Conseguiu um emprego usando o hiredcreative-ops? [Conte sua história!](https://github.com/yashimosh/hiredcreative-ops/issues/new?template=i-got-hired.yml)

Veja [CONTRIBUTORS.md](CONTRIBUTORS.md) para conhecer as pessoas construindo este fork, e os [contribuidores do career-ops original](https://github.com/santifer/career-ops/graphs/contributors) para o motor sobre o qual ele foi construído.

## Licença

MIT

## Vamos nos conectar

[![Website](https://img.shields.io/badge/yashimosh.com-000?style=for-the-badge&logo=safari&logoColor=white)](https://yashimosh.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashimosh)
[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/yashimosh_)
