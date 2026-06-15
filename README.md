# KITZA Store — Site com Analytics de Acessos

Site da KITZA Store com sistema de monitoramento de acessos integrado.

## Como funciona

- **Banco de dados SQLite** registra cada visita automaticamente
- **Painel admin protegido por senha** em `/admin` mostra todos os acessos
- Dados coletados: pagina, IP, navegador, dispositivo, tela, idioma, referrer, data/hora

## Instalacao

```bash
npm install
```

## Rodar o servidor

```bash
npm start
```

O site fica disponivel em `http://localhost:3000` e o painel admin em `http://localhost:3000/admin`.

## Senha do painel

A senha padrao e `kitza2026`. Para alterar, defina a variavel de ambiente:

```bash
ADMIN_PASSWORD=sua_senha_aqui npm start
```

## Variaveis de ambiente

| Variavel | Padrao | Descricao |
|---|---|---|
| `PORT` | `3000` | Porta do servidor |
| `ADMIN_PASSWORD` | `kitza2026` | Senha do painel admin |
| `SESSION_SECRET` | (aleatorio) | Chave para cookies de sessao |

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
server.js            — Backend Express + SQLite
admin.html           — Painel de analytics (protegido)
admin-login.html     — Tela de login
analytics.db         — Banco de dados SQLite (criado automaticamente)
public/              — Arquivos publicos servidos pelo Express
  index.html         — Pagina principal da loja
  sobre.html         — Sobre a KITZA
  privacidade.html   — Politica de privacidade
  termos.html        — Termos de uso
  trocas.html        — Trocas e devolucoes
  tracker.js         — Script de tracking
  qrcode.js          — Lib QR Code
  produtos/          — Imagens dos produtos
```
