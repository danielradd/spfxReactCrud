# SPFx React CRUD

Web part de CRUD de itens de uma lista do SharePoint. Pacote `spfx-react-crud`, projeto em `spfxReactCRUD/`.
Responda e escreva textos (commits, README, strings pt-br) em português.

## Stack

SPFx 1.24.2 · **Heft** (`@microsoft/spfx-web-build-rig`) · Node 22 (`.nvmrc`) · TypeScript ~5.8 · React 18 (`createRoot`) · PnPjs 4 · Fluent UI 8

## Comandos

Rodar de dentro de `spfxReactCRUD/`, com Node 22 ativo (`source ~/.nvm/nvm.sh && nvm use`).

| Ação | Comando |
|---|---|
| Servir e testar no site | `npm start` (abre a página de `config/serve.json` com `debugManifestsFile`) |
| Build de produção + `.sppkg` | `npm run build` |
| Limpar | `npm run clean` |
| Certificado de dev | `npx heft trust-dev-cert` |

**Nunca** usar ou sugerir gulp (`gulp serve`, `gulp bundle`, `gulpfile.js`): a SPFx 1.24 não suporta.

O repositório é público: **nenhum endereço de tenant** em `config/serve.json`, `.vscode/launch.json`, README ou código. O `serve.json` usa `https://{tenantDomain}/...`, preenchido pela variável de ambiente `SPFX_SERVE_TENANT_DOMAIN` da máquina de cada dev (aceita domínio + site, ex. `contoso.sharepoint.com/sites/MeuSite`).

## Estrutura

```
spfxReactCRUD/src/
├── services/base/base.service.ts   BaseService: _sp e _web via getSP
├── services/{dominio}.service.ts   acesso SharePoint (estende BaseService)
├── utils/get-sp.ts                 bootstrap PnP único
├── utils/format.ts                 format("{0}", valor) para strings de loc/
├── styles/_variables.scss          tokens de estilo
└── webparts/spfxReactCrud/
    ├── SpfxReactCrudWebPart.ts     propriedades, tema, monta o App
    ├── App.tsx
    ├── hooks/use-*.ts              hooks da tela (use-list-crud, use-item-selection)
    ├── components/index.tsx        tela: só compõe os filhos
    ├── components/props.d.ts       contrato WebPart ↔ App
    ├── components/{filho}/         kebab-case: index.tsx (+ styles.module.scss)
    └── loc/                        en-us.js, pt-br.js, mystrings.d.ts
```

`src/hooks/` e `src/components/` só quando houver reuso real entre web parts.

## Padrões obrigatórios

- WebPart só monta o App com `createRoot`: `React.createElement(App, { context: this.context, listName, theme })`
- UI: `export function Nome`. O único `export default` é a classe `*WebPart`
- Dados do SharePoint só em service (`BaseService` + `getSP`); o hook instancia o service; o componente não chama PnP
- Strings de tela em `loc/en-us.js` **e** `loc/pt-br.js` + `mystrings.d.ts`
- `async/await` + `try/catch` no service e no hook
- Props tipadas (`props.d.ts` ou `interface` local)
- Pacote `@pnp/*` usado no código precisa estar no `package.json`

Regras detalhadas por tipo de arquivo em `.claude/rules/` (carregadas quando o arquivo é tocado).

## Não fazer

- Trocar Heft por gulp
- `ReactDOM.render` (React 18 usa `createRoot`)
- `any`, `React.FC`, `export default` na UI
- `console.log` (só `console.error` em falha inesperada)
- PnP, `sp.web` ou `SPHttpClient` dentro de componente; `SPFI`/`SPHttpClient` como prop
- `components/components/`
- Strings fixas no JSX
- Props do Yeoman (`description`, `environmentMessage`, `spHttpClient`)
- Mudar os IDs da solução (`dc4ac0ca-…`) ou do web part (`37adff56-…`): o App Catalog precisa tratar o pacote como atualização

## Antes de dar uma tarefa por concluída

1. `npm run build` sem erros **e** sem avisos de lint
2. Nenhuma violação: `grep -rnE ": any\b|<any>|React\.FC|console\.log|SPHttpClient" spfxReactCRUD/src` não retorna nada
3. String nova existe nos dois `loc/*.js` e no `mystrings.d.ts`
4. Se a estrutura mudou, atualizar a seção Estrutura deste arquivo e o `spfxReactCRUD/README.md`

O teste no SharePoint (lista **Sample**, só coluna `Title`) é feito pelo usuário: diga o que testar.
