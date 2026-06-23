# KITZA Store — Site com Analytics de Acessos

Site da KITZA Store com sistema de monitoramento de acessos integrado, hospedado no Netlify com banco de dados PostgreSQL (Neon).

## Como funciona

- **Banco de dados Neon PostgreSQL** (integrado ao Netlify) registra cada visita automaticamente
- **Painel admin protegido por senha** em `/admin` mostra todos os acessos
- **Netlify Functions** processam as APIs (tracking, stats, login)
- Dados coletados: pagina, IP, navegador, dispositivo, tela, idioma, referrer, data/hora

## Deploy no Netlify

1. Conecte este repositorio ao Netlify
2. O Netlify detecta automaticamente o `netlify.toml`
3. Configure as variaveis de ambiente no painel do Netlify:
   - `DATABASE_URL` — String de conexao do banco Neon (a versao read/write)
   - `ADMIN_PASSWORD` — Senha do painel admin (padrao: `kitza2026`)
   - `JWT_SECRET` — Chave secreta para tokens de autenticacao

## Desenvolvimento local

```bash
npm install
# Defina DATABASE_URL no arquivo .env
echo 'DATABASE_URL=postgresql://...' > .env
npx netlify dev
```

## Senha do painel

A senha padrao e `kitza2026`. Para alterar, defina a variavel `ADMIN_PASSWORD` no Netlify.

## Variaveis de ambiente

| Variavel | Padrao | Descricao |
|---|---|---|
| `DATABASE_URL` | (obrigatorio) | String de conexao PostgreSQL (Neon) |
| `ADMIN_PASSWORD` | `kitza2026` | Senha do painel admin |
| `JWT_SECRET` | (padrao interno) | Chave para tokens JWT |

## Recursos do painel

- Total de visitas e visitantes unicos
- Grafico de visitas por dia
- Paginas mais acessadas
- Navegadores e dispositivos
- Origem do trafego (referrers)
- Tabela detalhada com paginacao
- Exportar dados em CSV
- Filtro por periodo (hoje, 7 dias, 30 dias, 90 dias, 1 ano)

## Estrutura

```
netlify.toml             — Config Netlify (redirects, functions)
netlify/functions/       — Netlify Functions (APIs serverless)
  track.js               — POST /api/track (registra visita)
  stats.js               — GET /api/stats (dados do dashboard)
  visits.js              — GET /api/visits (lista paginada)
  export.js              — GET /api/export (CSV)
  login.js               — POST /api/login (autenticacao)
  logout.js              — GET /admin/logout
  lib/db.js              — Conexao com Neon PostgreSQL
  lib/auth.js            — JWT auth helpers
public/                  — Arquivos estaticos
  index.html             — Pagina principal da loja
  sobre.html             — Sobre a KITZA
  privacidade.html       — Politica de privacidade
  termos.html            — Termos de uso
  trocas.html            — Trocas e devolucoes
  admin.html             — Painel de analytics
  admin-login.html       — Tela de login
  tracker.js             — Script de tracking
  qrcode.js              — Lib QR Code
  produtos/              — Imagens dos produtos
```
